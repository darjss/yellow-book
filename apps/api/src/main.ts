import Fastify from 'fastify';
import cors from '@fastify/cors';
import { app } from './app/app';
import { createContext } from './app/trpc/context';
import { appRouter, type AppRouter } from './app/trpc/router';
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = Fastify({
  logger: true,
  maxParamLength: 5000,
});

server.register(cors, {
  origin:
    process.env.NODE_ENV === 'production'
      ? (process.env.CORS_ORIGINS
          ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
          : ['*'])
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
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
