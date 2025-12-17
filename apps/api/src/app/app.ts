import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import sensiblePlugin from './plugins/sensible';
import rootRoutes from './routes/root';

export async function app(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // Register plugins
  fastify.register(sensiblePlugin);

  // Register routes
  fastify.register(rootRoutes, { prefix: '/' });
}
