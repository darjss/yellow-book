import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: "Restaurant" },
  { name: "Bar" },
  { name: "Cafe" },
  { name: "Hotel" },
  { name: "Shop" },
];

const businessData: Omit<Prisma.BusinessCreateInput, 'category'>[] = [
  {
    name: "The Golden Fork",
    description: "Upscale Italian restaurant serving handmade pasta and wood-fired pizzas in a cozy downtown setting.",
    address: "42 Maple Avenue, Springfield",
    phone: "555-123-4567",
    email: "info@goldenfork.com",
    website: "https://goldenfork.com",
    googleMapUrl: "https://maps.google.com/?q=42+Maple+Avenue+Springfield",
    facebookUrl: "https://facebook.com/goldenfork",
    instagramUrl: "https://instagram.com/goldenfork",
    timetable: "Mon–Thu 11:00–22:00, Fri–Sat 11:00–23:00, Sun 12:00–21:00",
  },
  {
    name: "Brew & Barrel",
    description: "Craft beer bar with 24 rotating taps, live music on weekends, and gourmet pub fare.",
    address: "88 River Street, Springfield",
    phone: "555-987-6543",
    email: "hello@brewandbarrel.com",
    website: "https://brewandbarrel.com",
    googleMapUrl: "https://maps.google.com/?q=88+River+Street+Springfield",
    facebookUrl: "https://facebook.com/brewandbarrel",
    instagramUrl: "https://instagram.com/brewandbarrel",
    timetable: "Mon–Thu 16:00–00:00, Fri–Sat 14:00–02:00, Sun 14:00–22:00",
  },
  {
    name: "Morning Bloom Café",
    description: "Artisan coffee roastery and café offering single-origin beans, fresh pastries, and light brunch.",
    address: "15 Oak Lane, Springfield",
    phone: "555-321-7890",
    email: "contact@morningbloomcafe.com",
    website: "https://morningbloomcafe.com",
    googleMapUrl: "https://maps.google.com/?q=15+Oak+Lane+Springfield",
    facebookUrl: "https://facebook.com/morningbloomcafe",
    instagramUrl: "https://instagram.com/morningbloomcafe",
    timetable: "Mon–Fri 07:00–18:00, Sat–Sun 08:00–19:00",
  },
  {
    name: "The Grand Plaza Hotel",
    description: "Four-star boutique hotel with rooftop pool, spa services, and award-winning concierge team.",
    address: "100 Central Boulevard, Springfield",
    phone: "555-555-0100",
    email: "reservations@grandplazahotel.com",
    website: "https://grandplazahotel.com",
    googleMapUrl: "https://maps.google.com/?q=100+Central+Boulevard+Springfield",
    facebookUrl: "https://facebook.com/grandplazahotel",
    instagramUrl: "https://instagram.com/grandplazahotel",
    timetable: "24/7",
  },
  {
    name: "Urban Outfitters Springfield",
    description: "Trendy fashion and lifestyle retailer featuring curated clothing, accessories, and home décor.",
    address: "250 Downtown Mall, Springfield",
    phone: "555-777-8888",
    email: "store@uospringfield.com",
    website: "https://uospringfield.com",
    googleMapUrl: "https://maps.google.com/?q=250+Downtown+Mall+Springfield",
    facebookUrl: "https://facebook.com/uospringfield",
    instagramUrl: "https://instagram.com/uospringfield",
    timetable: "Mon–Sat 10:00–21:00, Sun 11:00–19:00",
  },
  {
    name: "Sakura Sushi",
    description: "Authentic Japanese sushi bar with fresh daily fish flown in from Tokyo's Tsukiji market.",
    address: "7 Cherry Blossom Way, Springfield",
    phone: "555-222-3333",
    email: "info@sakurasushi.com",
    website: "https://sakurasushi.com",
    googleMapUrl: "https://maps.google.com/?q=7+Cherry+Blossom+Way+Springfield",
    facebookUrl: "https://facebook.com/sakurasushi",
    instagramUrl: "https://instagram.com/sakurasushi",
    timetable: "Tue–Sun 17:00–22:30, Closed Mon",
  },
  {
    name: "The Velvet Lounge",
    description: "Sophisticated cocktail bar specializing in craft martinis, live jazz, and small plates.",
    address: "55 Jazz Alley, Springfield",
    phone: "555-444-5566",
    email: "reservations@velvetlounge.com",
    website: "https://velvetlounge.com",
    googleMapUrl: "https://maps.google.com/?q=55+Jazz+Alley+Springfield",
    facebookUrl: "https://facebook.com/velvetlounge",
    instagramUrl: "https://instagram.com/velvetlounge",
    timetable: "Tue–Thu 18:00–01:00, Fri–Sat 18:00–02:00, Sun 19:00–00:00",
  },
  {
    name: "Bean & Leaf",
    description: "Minimalist coffee and tea house offering pour-overs, matcha lattes, and vegan pastries.",
    address: "12 Pine Street, Springfield",
    phone: "555-888-9999",
    email: "hello@beanandleaf.com",
    website: "https://beanandleaf.com",
    googleMapUrl: "https://maps.google.com/?q=12+Pine+Street+Springfield",
    facebookUrl: "https://facebook.com/beanandleaf",
    instagramUrl: "https://instagram.com/beanandleaf",
    timetable: "Mon–Fri 07:30–17:30, Sat–Sun 08:00–18:00",
  },
  {
    name: "The Heritage Inn",
    description: "Charming 19th-century inn with individually styled rooms, complimentary breakfast, and garden courtyard.",
    address: "200 Heritage Row, Springfield",
    phone: "555-666-7777",
    email: "book@heritageinn.com",
    website: "https://heritageinn.com",
    googleMapUrl: "https://maps.google.com/?q=200+Heritage+Row+Springfield",
    facebookUrl: "https://facebook.com/heritageinn",
    instagramUrl: "https://instagram.com/heritageinn",
    timetable: "24/7",
  },
  {
    name: "Bookworm Haven",
    description: "Independent bookstore with cozy reading nooks, weekly author events, and an in-store café.",
    address: "18 Library Lane, Springfield",
    phone: "555-333-2121",
    email: "hello@bookwormhaven.com",
    website: "https://bookwormhaven.com",
    googleMapUrl: "https://maps.google.com/?q=18+Library+Lane+Springfield",
    facebookUrl: "https://facebook.com/bookwormhaven",
    instagramUrl: "https://instagram.com/bookwormhaven",
    timetable: "Mon–Sat 09:00–20:00, Sun 10:00–18:00",
  },
];

async function createCategories() {
  console.log("Creating categories...");

  const createdCategories: Array<{ id: string; name: string }> = [];
  for (const category of categoryData) {
    const created = await prisma.category.create({
      data: category,
    });
    createdCategories.push(created);
  }

  console.log(`Created ${createdCategories.length} categories`);
  return createdCategories;
}

async function createBusinesses(categories: Awaited<ReturnType<typeof createCategories>>) {
  console.log("Creating businesses...");

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, string>);

  const businessesWithCategories = businessData.map((business, index) => {
    const categoryNames = ["Restaurant", "Bar", "Cafe", "Hotel", "Shop"];
    const categoryName = categoryNames[index % categoryNames.length];

    return {
      ...business,
      categoryId: categoryMap[categoryName],
    };
  });

  const createdBusinesses: Array<{ id: string; name: string }> = [];
  for (const business of businessesWithCategories) {
    const created = await prisma.business.create({
      data: business,
    });
    createdBusinesses.push(created);
  }

  console.log(`Created ${createdBusinesses.length} businesses`);
  return createdBusinesses;
}

async function clearDatabase() {
  console.log("Clearing existing data...");

  await prisma.business.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Database cleared");
}

async function main() {
  try {
    console.log("Starting database seeding...");

    
    await clearDatabase();
    const categories = await createCategories();

    await createBusinesses(categories);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

process.on('SIGINT', async () => {
  console.log("Received SIGINT, disconnecting...");
  await prisma.$disconnect();
  process.exit(0);
});

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});