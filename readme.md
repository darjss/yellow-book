# Web ahisan lab 3

**B.Aviddaram**

**Deployed link:** https://yellow-book.darjs.dev/

---

## Tech Choices

### Frontend

- **Nextjs React 19** for client with react server components and suspense for better loading
- **Tanstack query** - Manage fetch, server side state with caching retries/ used expreminetal next package to enable easy streaming client side
- **Tailwind, Shadcn** - easy css styling customizable component library in my own code base
- **Nuqs** - Makes it easy to use search params for state management so reloading keeps state/shareable urls with good typing

### Backend

- **Fastify** - simple framework on top of node with better performance than express pretty similiar to express
- **Trpc** - end to end typesafety automatically define a function on the backend and get the typing automatically on the frontend with tanstack query integration has input validation support with zod
- **Prisma** - ORM for interacting with database with typescript support and typing

### Hosting/Extras

- **Nx** for monorepo management with prettier eslint support out of the box with plugins
- **Bun** for runtime package manager node module caching, huge multiples of performance over npm
- **Docker Compose** for containerization
- **Hosting on DigitalOcean** droplet VM because of education 200$ credits
- **Nginx** for reverse proxy management

---

## Todo

- [ ] Add realistic mongolian data
- [ ] improve ui
- [ ] add business specific page
- [ ] https with caddy on deployment
- [ ] add business?
