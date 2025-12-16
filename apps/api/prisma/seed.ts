import { PrismaClient, Prisma } from '../app/generated/prisma';

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: 'Restaurant' },
  { name: 'Bar' },
  { name: 'Cafe' },
  { name: 'Hotel' },
  { name: 'Shop' },
];

const businessData: Omit<Prisma.BusinessCreateInput, 'category'>[] = [
  // Restaurants
  {
    name: 'Modern Nomads',
    description:
      'Award-winning restaurant serving reinvented Mongolian cuisine with a contemporary twist. Famous for their khorkhog, buuz, and fermented mare milk cocktails.',
    address: 'Jamiyan Gun Street 5/1, Sukhbaatar District, Ulaanbaatar',
    phone: '+976 7711 8899',
    email: 'info@modernnomads.mn',
    website: 'https://modernnomads.mn',
    googleMapUrl: 'https://maps.google.com/?q=Modern+Nomads+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/modernnomadsmn',
    instagramUrl: 'https://instagram.com/modernnomads_ub',
    timetable: 'Mon–Sun 11:00–23:00',
  },
  // Bars
  {
    name: 'Grand Khaan Irish Pub',
    description:
      "Ulaanbaatar's most popular Irish pub featuring live music, craft beers, hearty pub food, and a vibrant expat community atmosphere.",
    address: 'Seoul Street 20, Sukhbaatar District, Ulaanbaatar',
    phone: '+976 7012 3456',
    email: 'info@grandkhaanpub.mn',
    website: 'https://grandkhaanpub.mn',
    googleMapUrl:
      'https://maps.google.com/?q=Grand+Khaan+Irish+Pub+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/grandkhaanpub',
    instagramUrl: 'https://instagram.com/grandkhaanpub',
    timetable: 'Mon–Thu 12:00–00:00, Fri–Sat 12:00–02:00, Sun 14:00–23:00',
  },
  // Cafes
  {
    name: 'Cafe Amsterdam',
    description:
      'Cozy European-style cafe known for exceptional specialty coffee, homemade pastries, and a relaxed atmosphere perfect for remote work or catching up with friends.',
    address: 'Peace Avenue 15, Chingeltei District, Ulaanbaatar',
    phone: '+976 9911 2233',
    email: 'hello@cafeamsterdam.mn',
    website: 'https://cafeamsterdam.mn',
    googleMapUrl: 'https://maps.google.com/?q=Cafe+Amsterdam+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/cafeamsterdamub',
    instagramUrl: 'https://instagram.com/cafeamsterdam_ub',
    timetable: 'Mon–Fri 08:00–22:00, Sat–Sun 09:00–23:00',
  },
  // Hotels
  {
    name: 'Shangri-La Ulaanbaatar',
    description:
      'Five-star luxury hotel in the heart of the city offering world-class amenities, multiple dining options, a spa, and stunning views of Sukhbaatar Square.',
    address: 'Olympic Street 19, Sukhbaatar District, Ulaanbaatar 14241',
    phone: '+976 7702 9999',
    email: 'reservations.slub@shangri-la.com',
    website: 'https://www.shangri-la.com/ulaanbaatar',
    googleMapUrl: 'https://maps.google.com/?q=Shangri-La+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/ShangriLaUlaanbaatar',
    instagramUrl: 'https://instagram.com/shangrilaulaanbaatar',
    timetable: '24/7',
  },
  // Shops
  {
    name: 'Mary & Martha Mongolia',
    description:
      'Fair-trade shop featuring handcrafted Mongolian cashmere products, traditional felt crafts, and artisan goods supporting local women entrepreneurs.',
    address: 'Baga Toiruu 24, Sukhbaatar District, Ulaanbaatar',
    phone: '+976 7011 5566',
    email: 'shop@marymartha.mn',
    website: 'https://marymartha.mn',
    googleMapUrl: 'https://maps.google.com/?q=Mary+Martha+Mongolia+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/marymarthamongolia',
    instagramUrl: 'https://instagram.com/marymartha_mongolia',
    timetable: 'Mon–Sat 10:00–19:00, Sun 11:00–17:00',
  },
  // Restaurant
  {
    name: 'Rosewood Kitchen + Enoteca',
    description:
      'Upscale Italian-Mediterranean restaurant with an extensive wine cellar, wood-fired pizzas, fresh pasta, and elegant ambiance in central Ulaanbaatar.',
    address: 'Seoul Street 4, Sukhbaatar District, Ulaanbaatar',
    phone: '+976 7710 5050',
    email: 'reservations@rosewood.mn',
    website: 'https://rosewood.mn',
    googleMapUrl:
      'https://maps.google.com/?q=Rosewood+Kitchen+Enoteca+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/rosewoodub',
    instagramUrl: 'https://instagram.com/rosewood_ub',
    timetable: 'Mon–Sun 12:00–23:00',
  },
  // Bar
  {
    name: 'Hu Bar',
    description:
      'Trendy rooftop bar with panoramic city views, craft cocktails, and a vibrant nightlife scene. Named after the famous Mongolian rock band "The Hu".',
    address: 'Prime Minister Amar Street 8, Sukhbaatar District, Ulaanbaatar',
    phone: '+976 8811 4455',
    email: 'info@hubar.mn',
    website: 'https://hubar.mn',
    googleMapUrl: 'https://maps.google.com/?q=Hu+Bar+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/hubarub',
    instagramUrl: 'https://instagram.com/hubar_ulaanbaatar',
    timetable:
      'Tue–Thu 18:00–01:00, Fri–Sat 18:00–03:00, Sun 17:00–00:00, Closed Mon',
  },
  // Cafe
  {
    name: "Millie's Espresso",
    description:
      'Specialty coffee shop serving single-origin beans, artisan espresso drinks, and delicious brunch items in a modern, Instagram-worthy space.',
    address: 'Ikh Toiruu 44, Khan-Uul District, Ulaanbaatar',
    phone: '+976 9900 7788',
    email: 'hello@millies.mn',
    website: 'https://millies.mn',
    googleMapUrl: 'https://maps.google.com/?q=Millies+Espresso+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/milliesespresso',
    instagramUrl: 'https://instagram.com/millies_ub',
    timetable: 'Mon–Fri 07:30–20:00, Sat–Sun 09:00–21:00',
  },
  // Hotel
  {
    name: 'The Blue Sky Hotel & Tower',
    description:
      'Iconic 25-story landmark hotel with distinctive blue glass architecture, luxury rooms, multiple restaurants, and breathtaking views of the city and mountains.',
    address: 'Peace Avenue 17, Sukhbaatar District, Ulaanbaatar 14240',
    phone: '+976 7010 0505',
    email: 'reservations@blueskytower.mn',
    website: 'https://blueskytower.mn',
    googleMapUrl: 'https://maps.google.com/?q=Blue+Sky+Hotel+Tower+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/blueskytower',
    instagramUrl: 'https://instagram.com/blueskyhotel_ub',
    timetable: '24/7',
  },
  // Shop
  {
    name: 'Gobi Cashmere Factory Store',
    description:
      'Premium Mongolian cashmere brand offering luxurious sweaters, scarves, and accessories directly from the factory at competitive prices.',
    address: 'Peace Avenue 5, Bayanzurkh District, Ulaanbaatar',
    phone: '+976 7011 8888',
    email: 'store@gobicashmere.mn',
    website: 'https://gobicashmere.com',
    googleMapUrl: 'https://maps.google.com/?q=Gobi+Cashmere+Ulaanbaatar',
    facebookUrl: 'https://facebook.com/gobicashmere',
    instagramUrl: 'https://instagram.com/gobicashmere',
    timetable: 'Mon–Sat 09:00–20:00, Sun 10:00–18:00',
  },
];

async function createCategories() {
  console.log('Creating categories...');

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

async function createBusinesses(
  categories: Awaited<ReturnType<typeof createCategories>>
) {
  console.log('Creating businesses...');

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, string>);

  const businessesWithCategories = businessData.map((business, index) => {
    const categoryNames = ['Restaurant', 'Bar', 'Cafe', 'Hotel', 'Shop'];
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
  console.log('Clearing existing data...');

  await prisma.business.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Database cleared');
}

async function main() {
  try {
    console.log('Starting database seeding...');

    await clearDatabase();
    const categories = await createCategories();

    await createBusinesses(categories);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT, disconnecting...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
