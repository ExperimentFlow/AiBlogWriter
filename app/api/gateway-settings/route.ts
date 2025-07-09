import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { paymentSettingsSchema } from "@/lib/validations/payment";
import { safeEncrypt, safeDecrypt } from "@/lib/encryption";
import { generateWebhookUrl } from "@/lib/utils";
import { StripeService } from "@/lib/services/gateway/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { error: "No tenant associated with this session" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validationResult = paymentSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const errorMessages = Object.values(errors)
        .flat()
        .filter(Boolean)
        .join(", ");
      return NextResponse.json(
        { error: "Validation failed", details: errorMessages },
        { status: 400 }
      );
    }

    const { publicKey, secretKey, currency } = validationResult.data;

    const webhookUrl = generateWebhookUrl();

    const stripe = new StripeService({ secretKey });

    // Declare variables outside try block
    let existingGatewaySetting = null;
    let webhooks: Stripe.WebhookEndpoint[] = [];

    try {
      [existingGatewaySetting, webhooks] = await Promise.all([
        prisma.gatewaySetting.findUnique({ where: { tenantId } }),
        stripe.listWebhooks(),
      ]);
    } catch (error) {
      console.log("Error listing webhooks: hooo la lal al a", error);
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("invalid api key")
      ) {
        console.log("Invalid Stripe API key");
        return NextResponse.json(
          { error: "Invalid Stripe API key" },
          { status: 400 }
        );
      }
      throw error
    }

    const webhookExists = webhooks.find(
      (webhook) => webhook.url === webhookUrl && webhook.status === "enabled"
    );

    let webhookId = existingGatewaySetting?.webhookId ?? undefined;
    let webhookSecret = existingGatewaySetting?.webhookSecret ?? undefined;

    if (!webhookExists) {
      const newWebhook = await stripe.createWebhook(webhookUrl);
      webhookId = newWebhook.id;
      webhookSecret = newWebhook.secret;
    }

    const encryptedSecretKey = safeEncrypt(secretKey, "payment-gateway");

    const gatewaySetting = existingGatewaySetting
      ? await prisma.gatewaySetting.update({
          where: { tenantId },
          data: {
            publicKey,
            secretKey: encryptedSecretKey,
            currency,
            webhookId,
            webhookSecret,
          },
        })
      : await prisma.gatewaySetting.create({
          data: {
            tenantId,
            publicKey,
            secretKey: encryptedSecretKey,
            currency,
            webhookId,
            webhookSecret,
          },
        });

    return NextResponse.json({
      success: true,
      gatewaySetting: {
        ...gatewaySetting,
        secretKey: "[ENCRYPTED]",
      },
      webhook: {
        id: webhookId,
        url: webhookUrl,
        status: webhookExists ? "already exists" : "created",
      },
      message:
        "Gateway settings saved successfully. Webhook has been created or updated on your Stripe account.",
    });
  } catch (error) {
    console.error("Gateway settings error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = user.tenantId;

    if (!tenantId) {
      return NextResponse.json(
        { error: "No tenant associated with this session" },
        { status: 400 }
      );
    }

    // Get existing gateway settings
    const gatewaySetting = await prisma.gatewaySetting.findUnique({
      where: { tenantId },
      select: {
        publicKey: true,
        secretKey: true,
        currency: true,
        webhookId: true,
        webhookSecret: true,
        additional: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!gatewaySetting) {
      return NextResponse.json({
        success: true,
        settings: null,
      });
    }

    // Decrypt sensitive fields for the response
    const decryptedSettings = {
      ...gatewaySetting,
      secretKey: safeDecrypt(gatewaySetting.secretKey, "payment-gateway"),
      webhookSecret: gatewaySetting.webhookSecret
        ? safeDecrypt(gatewaySetting.webhookSecret, "payment-gateway")
        : null,
    };

    return NextResponse.json({
      success: true,
      settings: decryptedSettings,
    });
  } catch (error) {
    console.error("Get gateway settings error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
