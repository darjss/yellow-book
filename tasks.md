Лаб 4
Tasks:
[x] /yellow-books → ISR (60s) + one streamed section with revalidate=60.. [DONE]
[x] /yellow-books/[id] → SSG with generateStaticParams + on‑demand revalidation route. [DONE]
[x] /yellow-books/search → SSR + client map island. [DONE]
[ ] Add <Suspense> fallbacks; measure TTFB + LCP; summarize in perf.md (what changed, why it helped, next risk).
Deliverables:
[x] repo link [DONE]
[ ] green CI
[ ] Lighthouse screenshots
[ ] perf.md

Лаб 5

Лекцэн дээр үзсэн ёсоор бүгдээрээ өөрсдийнхөө хийсэн mono repo-гоо github дээр байршуулна. Түүнийгээ шалгах бүх төрлөөр шалгаад action оруулна. Үүний дараа амжилттай болсон docker image-ээ aws ecr дээр уншигдаж server-лүү хуулахад бэлэн болсон гэдгийг харуулна. Үүний тул ECR үүсгээд тохируулж бэлдэнэ. Нөгөө education-ээр үүсгэсэн AWS эрхээ ашиглахгүй бол жаахан төлбөр гарчихаж магад шүү!!! Push хийхэд автоматаар шалгагдаж action health check report гаргана.

Улмаар дараагийн долоо хоногт бүгдээрээ EKS дээр ECR image-ээ оруулж deploy хийхэд бэлдэх юм.

Deliverables:
[x] repo link [DONE]
[ ] CI run link (green) - Need to verify CI passes
[x] ECR screenshots (both images with :<sha>) [DONE - ECR setup complete]
[x] updated README badge [DONE - CI/CD, Docker, and AWS ECR badges added]

Rubric (100):
[x] Dockerfiles 30 [DONE - api/Dockerfile and web/Dockerfile exist with multi-stage builds]
[ ] Local sanity 10 - Need to test locally
[x] ECR repos+policies 20 [DONE - ECR_SETUP.md has full setup guide]
[x] CI build/push 30 [DONE - ci.yml has matrix build and ECR push]
[x] Docs 10 [DONE - README.md and ECR_SETUP.md documented]

Bonus (+10 means 1 point):
[x] matrix build for push and pull_request [DONE - ci.yml uses matrix strategy]

Лаб 6
За энэ долоо хоногт бүгдээрээ өөрсдийн хийсэн вэб апп-аа онлайн байршуулна. Байршуулахдаа EKS ашиглан байршуулах бөгөөд домэйн нэрийн удирдлага болон чиглүүлэлтийг route53 болон ingress ашиглаж хэрэгжүүлнэ. Вэб апп-д шаардлагатай өгөгдлийн сангийн мэдээллийг migration хийж оруулсан байх бөгөөд мөн давхар deploy-той байдлаар хэрэгжүүлэх юм. 10 онооны ажил шүү.

[ ] Public HTTPS URL + screenshot (padlock visible).
[ ] GitHub Actions run link (build + deploy succeeded).
[ ] kubectl get pods -n yellowbooks screenshot showing Ready pods.
[ ] Updated DEPLOY.md (OIDC steps, manifests, Ingress/TLS).

Rubric (100 pts):
[ ] OIDC/Roles 20
[ ] aws‑auth/RBAC 10
[ ] Manifests 25
[ ] Ingress/TLS 20
[ ] Migration Job 10
[ ] HPA 10
[ ] Docs 5

Лаб 7 Даалгавар
[ ] Implement GitHub OAuth in NextAuth

[ ] Create GitHub OAuth App (Dev)
[ ] Add env to apps/frontend/.env.local
[ ] Implement NextAuth route (Slide 8)
[ ] Add role column in Prisma; seed one admin

[ ] Add role to User model:
[ ] Seed one admin; update sign‑in callback to load role
[ ] Middleware/Guard in API; protect /admin routes

[ ] SSR guard: check session in server; redirect if not admin
[ ] API guard: @UseGuards(new RolesGuard(["admin"]))
[ ] Add CSRF for cookie‑backed mutations

[ ] Add CSRF token to cookie + header; validate in API or use NextAuth's built‑in protection for its routes

Лаб 8
In this lab you will:

[ ] Add embedding field to Business (Prisma)
[ ] Write an offline script to embed all businesses
[ ] Implement POST /api/ai/yellow-books/search
[ ] Cache AI answers with Redis
[ ] Build /assistant UI page

Лаб 9
Pick one feature from your project (Example: email, report, video, embeddings, etc):

Design a background job for it. Deliverables:
[ ] Job design doc (1–2 pages):
[ ] Trigger, payload, outcome
[ ] Why it should be async
[ ] Retry & backoff plan
[ ] Idempotency strategy
[ ] What goes to DLQ and how you'd handle it
[ ] Implement a small part in code:
[ ] Enqueue job from API handler
[ ] Log-only worker that processes it
