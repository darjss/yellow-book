/**
 * Offline script to generate embeddings for all businesses
 * Run with: npx tsx scripts/embed-businesses.ts
 */

import 'dotenv/config';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create text representation of a business for embedding
function createBusinessText(business: {
  name: string;
  description: string;
  address: string;
  category: { name: string };
  timetable: string;
}): string {
  return `Business: ${business.name}
Category: ${business.category.name}
Description: ${business.description}
Address: ${business.address}
Hours: ${business.timetable}`;
}

async function embedBusinesses() {
  console.log('Starting embedding process...');

  // Fetch all businesses with their categories
  const businesses = await prisma.business.findMany({
    include: {
      category: true,
    },
  });

  console.log(`Found ${businesses.length} businesses to embed`);

  if (businesses.length === 0) {
    console.log('No businesses found. Please seed the database first.');
    return;
  }

  // Create text representations
  const texts = businesses.map(createBusinessText);

  console.log('Generating embeddings with Google text-embedding-004...');

  // Generate embeddings in batches (Google allows up to 100 per request)
  const BATCH_SIZE = 50;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        texts.length / BATCH_SIZE
      )}`
    );

    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('text-embedding-004'),
      values: batch,
    });

    allEmbeddings.push(...embeddings);
  }

  console.log(`Generated ${allEmbeddings.length} embeddings`);

  // Update each business with its embedding using raw SQL
  console.log('Updating businesses with embeddings...');

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];
    const embedding = allEmbeddings[i];

    // Convert embedding array to PostgreSQL vector format
    const vectorString = `[${embedding.join(',')}]`;

    await prisma.$executeRawUnsafe(
      `UPDATE "Business" SET embedding = $1::vector WHERE id = $2`,
      vectorString,
      business.id
    );

    if ((i + 1) % 10 === 0) {
      console.log(`Updated ${i + 1}/${businesses.length} businesses`);
    }
  }

  console.log('Embedding process completed successfully!');
}

embedBusinesses()
  .catch((error) => {
    console.error('Error during embedding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
