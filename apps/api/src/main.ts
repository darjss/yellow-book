import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { app } from './app/app.js';
import { createContext } from './app/trpc/context';
import { appRouter, type AppRouter } from './app/trpc/router';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { google } from '@ai-sdk/google';
import { embed, streamText, convertToModelMessages, UIMessage } from 'ai';
import prisma from './app/lib/prisma';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = Fastify({
  logger: true,
  maxParamLength: 5000,
});

server.register(cors, {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
        : ['*']
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
        ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'x-trpc-source',
    'trpc-batch-mode',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

server.register(app);

// Simple AI Chat endpoint
server.post('/api/ai/chat', async (request, reply) => {
  const { messages } = request.body as { messages: UIMessage[] };

  if (!messages?.length) {
    return reply.status(400).send({ error: 'Messages are required' });
  }

  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
  if (!lastUserMessage) {
    return reply.status(400).send({ error: 'No user message found' });
  }

  // Extract text from message parts
  const userQuery =
    lastUserMessage.parts
      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join(' ') || '';

  if (!userQuery) {
    return reply.status(400).send({ error: 'No text content in message' });
  }

  // Get embedding and search businesses
  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004'),
    value: userQuery,
  });

  const vectorString = `[${embedding.join(',')}]`;
  const businesses = await prisma.$queryRawUnsafe<
    Array<{
      name: string;
      description: string;
      address: string;
      phone: string;
      website: string;
      timetable: string;
      categoryName: string;
    }>
  >(
    `SELECT b.name, b.description, b.address, b.phone, b.website, b.timetable, c.name as "categoryName"
     FROM "Business" b JOIN "Category" c ON b."categoryId" = c.id
     WHERE b.embedding IS NOT NULL
     ORDER BY b.embedding <=> $1::vector LIMIT 5`,
    vectorString
  );

  const context = businesses
    .map(
      (b, i) =>
        `[${i + 1}] ${b.name} (${b.categoryName}): ${b.description} | ${
          b.address
        } | ${b.phone}`
    )
    .join('\n');

  const systemPrompt = `You are a helpful assistant for the Yellow Book business directory.
Use ONLY the business information provided. Be concise and helpful.
Respond in the same language as the user.

Businesses:\n${context || 'No businesses found.'}`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  const response = result.toUIMessageStreamResponse();

  // Copy headers from the Response to Fastify reply
  response.headers.forEach((value, key) => {
    reply.header(key, value);
  });

  return reply.send(response.body);
});

server.listen({ port, host }, (err) => {
  console.log('server', server);
  console.log(process.env.DATABASE_URL);
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});
