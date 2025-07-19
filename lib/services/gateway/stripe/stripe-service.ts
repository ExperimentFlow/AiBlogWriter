import Stripe from 'stripe';

export interface StripeConfig {
  secretKey: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  currency: string;
  customerId?: string;
  paymentMethodId?: string;
  description?: string;
  metadata?: Record<string, string>;
  automaticPaymentMethods?: boolean;
  confirm?: boolean;
  returnUrl?: string;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  quantity?: number;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
  paymentBehavior?: 'default_incomplete' | 'allow_incomplete' | 'error_if_incomplete';
}

export interface CreateProductParams {
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
  active?: boolean;
}

export interface CreatePriceParams {
  productId: string;
  unitAmount: number; // Amount in cents
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
    trialPeriodDays?: number;
  };
  metadata?: Record<string, string>;
}

export interface CreateWebhookParams {
  url: string;
  events: string[];
}



export class StripeService {
  private stripe: Stripe;

  constructor(config: StripeConfig) {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  // ===== WEBHOOK MANAGEMENT =====

  /**
   * Creates a webhook endpoint
   */
  async createWebhook(url: string, events: string[] = ['payment_intent.succeeded', 'payment_intent.payment_failed']): Promise<{ id: string; secret: string }> {
    try {
      const webhook = await this.stripe.webhookEndpoints.create({
        url,
        enabled_events: events as Stripe.WebhookEndpointCreateParams.EnabledEvent[],
        description: 'Platform payment webhook',
      });

      return {
        id: webhook.id,
        secret: webhook.secret || '',
      };
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates an existing webhook
   */
  async updateWebhook(webhookId: string, url: string, events: string[]): Promise<{ id: string; secret: string }> {
    try {
      const webhook = await this.stripe.webhookEndpoints.update(webhookId, {
        url,
        enabled_events: events as Stripe.WebhookEndpointUpdateParams.EnabledEvent[],
        description: 'Platform payment webhook',
      });

      return {
        id: webhook.id,
        secret: webhook.secret || '',
      };
    } catch (error) {
      throw new Error(`Failed to update webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists all webhooks
   */
  async listWebhooks(): Promise<Stripe.WebhookEndpoint[]> {
    try {
      const webhooks = await this.stripe.webhookEndpoints.list();
      return webhooks.data;
    } catch (error) {
      throw new Error(`Failed to list webhooks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes a webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await this.stripe.webhookEndpoints.del(webhookId);
    } catch (error) {
      throw new Error(`Failed to delete webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== CUSTOMER MANAGEMENT =====

  /**
   * Creates a customer
   */
  async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        phone: params.phone,
        address: params.address,
        metadata: params.metadata,
      });

      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a customer
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
    } catch (error) {
      throw new Error(`Failed to retrieve customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates a customer
   */
  async updateCustomer(customerId: string, updates: Partial<CreateCustomerParams>): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.update(customerId, {
        email: updates.email,
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
        metadata: updates.metadata,
      });
    } catch (error) {
      throw new Error(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists customers
   */
  async listCustomers(limit: number = 10): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list({ limit });
      return customers.data;
    } catch (error) {
      throw new Error(`Failed to list customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes a customer
   */
  async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
    try {
      return await this.stripe.customers.del(customerId);
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== PAYMENT METHODS =====

  /**
   * Creates a payment method
   */
  async createPaymentMethod(type: 'card', card: { token?: string; number?: string; exp_month: number; exp_year: number; cvc?: string }): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type,
        card,
      });

      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to create payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Attaches a payment method to a customer
   */
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      throw new Error(`Failed to attach payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists payment methods for a customer
   */
  async listPaymentMethods(customerId: string, type: 'card' = 'card'): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type,
      });
      return paymentMethods.data;
    } catch (error) {
      throw new Error(`Failed to list payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== PAYMENT INTENTS =====

  /**
   * Creates a payment intent
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        customer: params.customerId,
        payment_method: params.paymentMethodId,
        description: params.description,
        metadata: params.metadata,
        automatic_payment_methods: params.automaticPaymentMethods ? { enabled: true } : undefined,
        confirm: params.confirm,
        return_url: params.returnUrl,
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Confirms a payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancels a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to cancel payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== PRODUCTS & PRICES =====

  /**
   * Creates a product
   */
  async createProduct(params: CreateProductParams): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.create({
        name: params.name,
        description: params.description,
        images: params.images,
        metadata: params.metadata,
        active: params.active,
      });

      return product;
    } catch (error) {
      throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a price
   */
  async createPrice(params: CreatePriceParams): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.create({
        product: params.productId,
        unit_amount: params.unitAmount,
        currency: params.currency,
        recurring: params.recurring,
        metadata: params.metadata,
      });

      return price;
    } catch (error) {
      throw new Error(`Failed to create price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists products
   */
  async listProducts(limit: number = 10): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list({ limit });
      return products.data;
    } catch (error) {
      throw new Error(`Failed to list products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists prices
   */
  async listPrices(productId?: string, limit: number = 10): Promise<Stripe.Price[]> {
    try {
      const prices = await this.stripe.prices.list({
        product: productId,
        limit,
      });
      return prices.data;
    } catch (error) {
      throw new Error(`Failed to list prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== SUBSCRIPTIONS =====

  /**
   * Creates a subscription
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ price: params.priceId, quantity: params.quantity }],
        metadata: params.metadata,
        trial_period_days: params.trialPeriodDays,
        payment_behavior: params.paymentBehavior,
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      throw new Error(`Failed to retrieve subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates a subscription
   */
  async updateSubscription(subscriptionId: string, updates: any): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, updates);
    } catch (error) {
      throw new Error(`Failed to update subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancels a subscription
   */
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = false): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId, {
        at_period_end: atPeriodEnd,
      });
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists subscriptions
   */
  async listSubscriptions(customerId?: string, limit: number = 10): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit,
      });
      return subscriptions.data;
    } catch (error) {
      throw new Error(`Failed to list subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== CHARGES =====

  /**
   * Creates a charge
   */
  async createCharge(amount: number, currency: string, customerId?: string, paymentMethodId?: string, description?: string): Promise<Stripe.Charge> {
    try {
      const charge = await this.stripe.charges.create({
        amount,
        currency,
        customer: customerId,
        source: paymentMethodId,
        description,
      });

      return charge;
    } catch (error) {
      throw new Error(`Failed to create charge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a charge
   */
  async getCharge(chargeId: string): Promise<Stripe.Charge> {
    try {
      return await this.stripe.charges.retrieve(chargeId);
    } catch (error) {
      throw new Error(`Failed to retrieve charge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refunds a charge
   */
  async refundCharge(chargeId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        charge: chargeId,
        amount,
        reason,
      });
    } catch (error) {
      throw new Error(`Failed to refund charge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Validates Stripe credentials
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.stripe.accounts.retrieve();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets account information
   */
  async getAccount(): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.retrieve();
    } catch (error) {
      throw new Error(`Failed to retrieve account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a checkout session
   */
  async createCheckoutSession(params: {
    mode: 'payment' | 'subscription';
    lineItems: Array<{ price: string; quantity?: number }>;
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: params.mode,
        line_items: params.lineItems,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer: params.customerId,
        metadata: params.metadata,
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a checkout session
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      throw new Error(`Failed to retrieve checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 