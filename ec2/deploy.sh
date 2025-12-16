#!/bin/bash
# Deploy script - runs on EC2 to pull and deploy latest images
set -e

AWS_REGION="${AWS_REGION:-ap-southeast-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
APP_DIR="${APP_DIR:-/opt/yellow-book}"
IMAGE_TAG="${1:-latest}"

cd ${APP_DIR}

echo "=== Yellow Book Deployment ==="
echo "Image tag: ${IMAGE_TAG}"
echo "ECR Registry: ${ECR_REGISTRY}"

echo ""
echo "Step 1: Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo ""
echo "Step 2: Pulling latest images..."
export ECR_REGISTRY=${ECR_REGISTRY}
export IMAGE_TAG=${IMAGE_TAG}

docker-compose -f docker-compose.prod.yml pull

echo ""
echo "Step 3: Fetching secrets..."
./fetch-secrets.sh

echo ""
echo "Step 4: Deploying application..."
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

echo ""
echo "Step 5: Cleaning up old images..."
docker image prune -f

echo ""
echo "=== Deployment complete! ==="
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "Health check URLs:"
echo "  - Web: http://localhost:80"
echo "  - API: http://localhost:80/trpc"
