import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    emailVerified: true,
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m", // password123
    role: "admin",
  },
  {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    emailVerified: true,
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m", // password123
    role: "user",
  },
  {
    firstName: "Demo",
    lastName: "User",
    email: "demo@example.com",
    emailVerified: true,
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m", // password123
    role: "user",
  },
];

const tenantData = [
  {
    subdomain: "tech-blog",
    name: "Tech Insights",
    favicon: "💻",
    description: "A technology blog focused on the latest trends and insights",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    logoUrl: null,
  },
  {
    subdomain: "lifestyle",
    name: "Lifestyle & Wellness",
    favicon: "🌿",
    description: "Tips and advice for a healthy lifestyle",
    primaryColor: "#10b981",
    secondaryColor: "#6b7280",
    logoUrl: null,
  },
  {
    subdomain: "demo-site",
    name: "Demo Site",
    favicon: "🚀",
    description: "A demo site for testing purposes",
    primaryColor: "#8b5cf6",
    secondaryColor: "#a855f7",
    logoUrl: null,
  },
];

export async function main() {
  console.log("Starting seed...");
  
  // Create users (or get existing ones)
  const users = [];
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    users.push(user);
    console.log(`User: ${user.firstName} ${user.lastName} (${user.email})`);
  }

  // Create one tenant per user
  for (let i = 0; i < users.length; i++) {
    const tenant = await prisma.tenant.upsert({
      where: { subdomain: tenantData[i].subdomain },
      update: {},
      create: {
        subdomain: tenantData[i].subdomain,
        name: tenantData[i].name,
        favicon: tenantData[i].favicon,
        description: tenantData[i].description,
        userId: users[i].id,
        isActive: true,
        theme: 'default',
        defaultLanguage: 'en',
        primaryColor: tenantData[i].primaryColor,
        secondaryColor: tenantData[i].secondaryColor,
        logoUrl: tenantData[i].logoUrl,
      }
    });
    console.log(`Tenant: ${tenant.name} (${tenant.subdomain})`);
  }

  // Create sample checkout configurations for each tenant
  for (let i = 0; i < users.length; i++) {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain: tenantData[i].subdomain }
    });
    
    if (tenant) {
      await prisma.checkoutConfig.upsert({
        where: { tenantId: tenant.id },
        update: {},
        create: {
          tenantId: tenant.id,
          title: `${tenant.name} Checkout`,
          description: `Complete your purchase on ${tenant.name}`,
          fields: {
            customerInfo: {
              firstName: { required: true, label: "First Name" },
              lastName: { required: true, label: "Last Name" },
              email: { required: true, label: "Email" },
              phone: { required: false, label: "Phone" },
            },
            shipping: {
              address: { required: true, label: "Address" },
              city: { required: true, label: "City" },
              country: { required: true, label: "Country" },
            }
          },
          showLogo: true,
          logoUrl: tenant.logoUrl,
          primaryColor: tenant.primaryColor || "#3b82f6",
          buttonText: "Complete Purchase",
          successMessage: "Thank you for your purchase!",
        }
      });
      console.log(`Checkout config created for: ${tenant.name}`);
    }
  }

  console.log("Seed completed!");
  console.log(`Processed ${users.length} users and ${users.length} tenants`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });