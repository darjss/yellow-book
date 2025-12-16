# Веб ахисан лаб 5 - CI/CD with ECR

**B.Aviddaram**

**Тавигдсан холбоос:** https://yellow-book.darjs.dev/

![CI/CD](https://github.com/darjzz/yellow-book/workflows/CI%2FCD/badge.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![AWS ECR](https://img.shields.io/badge/ECR-deployed-orange.svg)

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
- **Github Actions** — CI/CD pipeline with matrix builds and ECR integration
- **AWS ECR** — Docker registry for container images

---

## CI/CD Pipeline

### GitHub Actions Workflow

- **Matrix builds** for parallel testing of API and Web apps
- **Automated Docker builds** with multi-platform support (amd64/arm64)
- **ECR integration** for secure container storage
- **Health checks** for container validation
- **Automated tagging** with Git SHA and branch names

### AWS ECR Setup

```bash
# Create ECR repositories
aws ecr create-repository --repository-name yellow-book-api --region ap-southeast-1
aws ecr create-repository --repository-name yellow-book-web --region ap-southeast-1

# Set lifecycle policy (keep last 10 images)
aws ecr put-lifecycle-policy \
  --repository-name yellow-book-api \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "tagged",
          "tagPrefixList": ["main-", "latest"],
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {"type": "expire"}
      }
    ]
  }'
```

### Required GitHub Secrets

- `AWS_ACCESS_KEY_ID` - AWS access key with ECR permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_ACCOUNT_ID` - Your AWS account ID

### IAM Policy for ECR

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken", "ecr:InitiateLayerUpload", "ecr:UploadLayerPart", "ecr:CompleteLayerUpload", "ecr:PutImage", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability"],
      "Resource": "*"
    }
  ]
}
```

---

## Deployment

### Pull Images from ECR

```bash
# API
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com
docker pull $AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellow-book-api:latest

# Web
docker pull $AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellow-book-web:latest
```

### Run with Docker Compose

```yaml
version: '3.8'
services:
  api:
    image: $AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellow-book-api:latest
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/yellow_book

  web:
    image: $AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellow-book-web:latest
    ports:
      - '3000:3000'
    depends_on:
      - api
```

## Хийх зүйлс

- [x] CI/CD pipeline with GitHub Actions
- [x] AWS ECR integration
- [x] Matrix builds for parallel testing
- [x] Docker health checks
- [x] Automated image tagging
- [ ] Бодитой монгол өгөгдөл нэмэх
- [ ] UI-ийг сайжруулах
- [ ] Бизнесийн тусгай хуудас нэмэх
- [ ] EKS deployment (next lab)
- [ ] Бизнес нэмэх?
