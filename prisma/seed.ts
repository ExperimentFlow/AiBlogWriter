import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    emailVerified: true,
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m", // password123
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    emailVerified: true,
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m", // password123
  },
];

const tenantData = [
  {
    subdomain: "tech-blog",
    name: "Tech Insights",
    emoji: "💻",
    description: "Latest technology trends and insights",
    isActive: true,
    theme: "modern",
  },
  {
    subdomain: "lifestyle",
    name: "Lifestyle & Wellness",
    emoji: "🌿",
    description: "Healthy living tips and lifestyle advice",
    isActive: true,
    theme: "nature",
  },
  {
    subdomain: "business",
    name: "Business Growth",
    emoji: "📈",
    description: "Business strategies and growth tips",
    isActive: true,
    theme: "professional",
  },
];

const blogPostData = [
  {
    title: "The Future of Artificial Intelligence in 2024",
    slug: "future-of-ai-2024",
    excerpt: "Exploring the latest developments in AI and what to expect in the coming year.",
    content: "# The Future of Artificial Intelligence in 2024\n\nArtificial Intelligence continues to evolve at an unprecedented pace. In 2024, we're seeing remarkable advancements in several key areas that are reshaping how we interact with technology.\n\n## Key Trends\n\n### 1. Generative AI\nGenerative AI has moved beyond simple text generation. We're now seeing sophisticated image, video, and audio generation capabilities.\n\n### 2. AI in Healthcare\nThe healthcare industry is embracing AI for diagnosis, drug discovery, and personalized treatment plans.\n\n### 3. Autonomous Systems\nSelf-driving cars, drones, and robots are becoming more sophisticated and reliable.",
    status: "published",
    publishedAt: new Date("2024-01-15"),
    category: "Technology",
    tags: "AI, Machine Learning, Future Tech",
    views: 1250,
  },
  {
    title: "Getting Started with React 18: New Features and Best Practices",
    slug: "react-18-getting-started",
    excerpt: "A comprehensive guide to React 18's new features including concurrent rendering and automatic batching.",
    content: "# Getting Started with React 18: New Features and Best Practices\n\nReact 18 brings exciting new features that improve performance and user experience. Let's explore the key changes and how to implement them in your projects.\n\n## New Features\n\n### Concurrent Rendering\nConcurrent rendering allows React to work on multiple versions of your UI simultaneously.\n\n### Automatic Batching\nReact 18 automatically batches all state updates, regardless of where they originate from.\n\n### Suspense for Data Fetching\nYou can now use Suspense for data fetching, making it easier to handle loading states.",
    status: "published",
    publishedAt: new Date("2024-01-20"),
    category: "Development",
    tags: "React, JavaScript, Frontend",
    views: 890,
  },
  {
    title: "10 Simple Habits for a Healthier Lifestyle",
    slug: "10-healthy-habits",
    excerpt: "Small changes that can make a big difference in your overall health and wellbeing.",
    content: "# 10 Simple Habits for a Healthier Lifestyle\n\nCreating a healthier lifestyle doesn't require drastic changes. Small, consistent habits can lead to significant improvements in your health and wellbeing.\n\n## 1. Start Your Day with Water\nDrinking a glass of water first thing in the morning helps hydrate your body and kickstart your metabolism.\n\n## 2. Move More Throughout the Day\nIncorporate movement into your daily routine. Take the stairs, walk during phone calls, or do some stretching every hour.\n\n## 3. Eat Mindfully\nPay attention to what you're eating and how it makes you feel. Avoid distractions while eating and savor your food.",
    status: "published",
    publishedAt: new Date("2024-01-18"),
    category: "Wellness",
    tags: "Health, Habits, Lifestyle",
    views: 1120,
  },
  {
    title: "The Art of Mindful Eating: Transform Your Relationship with Food",
    slug: "mindful-eating-guide",
    excerpt: "Learn how mindful eating can help you develop a healthier relationship with food and improve your overall wellbeing.",
    content: "# The Art of Mindful Eating: Transform Your Relationship with Food\n\nMindful eating is about being present and aware during the eating experience. It's not just about what you eat, but how you eat.\n\n## What is Mindful Eating?\n\nMindful eating involves paying full attention to the experience of eating and drinking, both inside and outside the body. It includes observing the colors, smells, flavors, textures, temperatures, and sounds of your food.\n\n## Benefits\n\n### 1. Better Digestion\nWhen you eat mindfully, you're more likely to chew thoroughly and eat at a slower pace, which aids digestion.\n\n### 2. Weight Management\nMindful eating helps you recognize hunger and fullness cues, preventing overeating.\n\n### 3. Reduced Stress\nTaking time to enjoy your food can reduce stress and improve your relationship with eating.",
    status: "published",
    publishedAt: new Date("2024-01-22"),
    category: "Nutrition",
    tags: "Mindful Eating, Health, Wellness",
    views: 945,
  },
  {
    title: "5 Strategies for Building a Strong Company Culture",
    slug: "building-company-culture",
    excerpt: "Discover proven strategies for creating a positive and productive company culture that attracts and retains top talent.",
    content: "# 5 Strategies for Building a Strong Company Culture\n\nCompany culture is more than just office perks and team events. It's the foundation that shapes how employees work together and how your organization operates.\n\n## 1. Define Your Values\nStart by clearly defining your company's core values. These should reflect what's important to your organization and guide decision-making at all levels.\n\n## 2. Lead by Example\nLeadership sets the tone for company culture. Leaders must embody the values and behaviors they want to see in their teams.\n\n## 3. Foster Open Communication\nCreate an environment where employees feel comfortable sharing ideas, concerns, and feedback.",
    status: "published",
    publishedAt: new Date("2024-01-16"),
    category: "Leadership",
    tags: "Company Culture, Leadership, HR",
    views: 678,
  },
  {
    title: "Digital Marketing Trends That Will Dominate 2024",
    slug: "digital-marketing-trends-2024",
    excerpt: "Stay ahead of the curve with these key digital marketing trends that will shape the industry in 2024.",
    content: "# Digital Marketing Trends That Will Dominate 2024\n\nThe digital marketing landscape is constantly evolving. Here are the key trends that will dominate 2024 and how to prepare for them.\n\n## 1. AI-Powered Marketing\nArtificial intelligence is transforming how we approach marketing. From personalized content to automated campaigns, AI is making marketing more efficient and effective.\n\n## 2. Voice Search Optimization\nWith the growing popularity of voice assistants, optimizing for voice search is becoming increasingly important.\n\n## 3. Video Content Dominance\nVideo continues to be the most engaging content format. Short-form videos, live streaming, and interactive video content will be key to success.",
    status: "published",
    publishedAt: new Date("2024-01-19"),
    category: "Marketing",
    tags: "Digital Marketing, Trends, Strategy",
    views: 823,
  },
  {
    title: "Remote Work Best Practices for Teams",
    slug: "remote-work-best-practices",
    excerpt: "Essential strategies for managing remote teams effectively and maintaining productivity in a distributed work environment.",
    content: "# Remote Work Best Practices for Teams\n\nRemote work has become the new normal for many organizations. Here are proven strategies for managing remote teams effectively.\n\n## Communication is Key\n\n### 1. Over-communicate\nIn remote environments, it's better to over-communicate than under-communicate. Use multiple channels to ensure important information reaches everyone.\n\n### 2. Set Clear Expectations\nDefine work hours, response times, and communication protocols. Make sure everyone understands what's expected of them.\n\n### 3. Use the Right Tools\nChoose tools that facilitate collaboration: video conferencing, project management platforms, instant messaging, and document sharing.",
    status: "published",
    publishedAt: new Date("2024-01-23"),
    category: "Management",
    tags: "Remote Work, Team Management, Productivity",
    views: 567,
  },
  {
    title: "The Rise of Edge Computing: What You Need to Know",
    slug: "rise-of-edge-computing",
    excerpt: "Understanding edge computing and its impact on modern applications and infrastructure.",
    content: "# The Rise of Edge Computing: What You Need to Know\n\nEdge computing is revolutionizing how we process and store data. By bringing computation closer to the data source, we're seeing significant improvements in performance and reliability.\n\n## What is Edge Computing?\n\nEdge computing refers to processing data near the source where it's generated, rather than in a centralized cloud location. This approach reduces latency and bandwidth usage while improving security.\n\n## Benefits\n\n### 1. Reduced Latency\nBy processing data closer to users, edge computing significantly reduces response times, making applications feel faster and more responsive.\n\n### 2. Improved Security\nData can be processed locally, reducing the need to transmit sensitive information over networks.\n\n### 3. Cost Efficiency\nEdge computing can reduce bandwidth costs and improve resource utilization.",
    status: "published",
    publishedAt: new Date("2024-01-25"),
    category: "Technology",
    tags: "Edge Computing, Cloud, Infrastructure",
    views: 756,
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
    console.log(`User: ${user.name} (${user.email})`);
  }

  // Create tenants (or get existing ones)
  const tenants = [];
  for (let i = 0; i < tenantData.length; i++) {
    const tenant = await prisma.tenant.upsert({
      where: { subdomain: tenantData[i].subdomain },
      update: {},
      create: {
        ...tenantData[i],
        userId: users[i % users.length].id,
      }
    });
    tenants.push(tenant);
    console.log(`Tenant: ${tenant.name} (${tenant.subdomain})`);
  }

  // Create blog posts (or get existing ones)
  for (let i = 0; i < blogPostData.length; i++) {
    const blogPost = await prisma.blogPost.upsert({
      where: { slug: blogPostData[i].slug },
      update: {},
      create: {
        ...blogPostData[i],
        authorId: users[i % users.length].id,
        tenantId: tenants[Math.floor(i / 3) % tenants.length].id, // Distribute posts across tenants
      }
    });
    console.log(`Blog post: ${blogPost.title}`);
  }
  
  console.log("Seed completed!");
  console.log(`Processed ${users.length} users, ${tenants.length} tenants, and ${blogPostData.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });