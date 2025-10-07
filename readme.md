# Веб ахисан лаб 3

**B.Aviddaram**

**Тавигдсан холбоос:** https://yellow-book.darjs.dev/

---
## Суурилуулалт

1. **Хамааралтай сангуудыг суулгах**
   ```bash
   bun install
   ```

2. **Өгөгдлийн санг тохируулах**
   - `apps/api` директорт `.env` файл үүсгэнэ:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/yellow_book"
     ```

3. **Prisma миграцийг ажиллуулах**
   ```bash
   cd apps/api
   bunx prisma migrate dev    
   bunx prisma generate       
   bunx prisma db seed
   ```

4. **Хөгжүүлэлтийн сервер асаах**
   ```bash
   cd ../..                   # Root руу буцах
   bun dev                    # Frontend ба backend хоёуланг эхлүүлэх
   ```


## Технологийн сонголтууд

### Frontend   

- **Nextjs React 19** — client талд, React Server Components болон Suspense ашиглан илүү хурдан ачаалалт
- **Tanstack query** — fetch болон сервер талын state-ийг кэш, дахин оролдлогоор удирдах; client талд ssr streaming-ийг хялбар болгох experimental Next package ашигласан
- **Tailwind, Shadcn** — CSS стилинг хялбар, өөрчлөх боломжтой component library-г өөрийн кодонд ашигласан
- **Nuqs** — search params-ыг state менежментэд ашиглахыг хялбарчилж, дахин ачаалсан ч төлөв хадгалах/shareable URL, сайн typing

### Backend

- **Fastify** — Express-тэй төстэй, илүү гүйцэтгэлтэй, энгийн фрэймворк
- **Trpc** — end-to-end type safety; backend дээр function тодорхойлоход frontend талд typing автоматаар бий болно; TanStack Query интеграц; Zod ашиглан input validation
- **Prisma** — TypeScript дэмжлэгтэй ORM, өгөгдлийн сантай харилцах

### Hosting/Extras

- **Nx** — monorepo удирдлага; prettier, eslint support out of the box, plugins
- **Bun** — runtime + package manager; node module caching; npm-ээс олон дахин гүйцэтгэл
- **Docker Compose** — контейнерчлал
- **Hosting on DigitalOcean** droplet VM (education 200$ credits ашигласан)
- **Nginx** — reverse proxy удирдлага
- **Github Actions** — CI-д ашигласан, стандарт бөгөөд хямд 
---

## Хийх зүйлс

- [ ] Бодитой монгол өгөгдөл нэмэх
- [ ] UI-ийг сайжруулах
- [ ] Бизнесийн тусгай хуудас нэмэх
- [ ] Deployment дээр Caddy ашиглан HTTPS идэвхжүүлэх
- [ ] Бизнес нэмэх?
