#!/bin/bash
# Fetch secrets from AWS Secrets Manager and write to .env.prod
set -e

AWS_REGION="${AWS_REGION:-ap-southeast-1}"
ENV_FILE="${ENV_FILE:-/opt/yellow-book/.env.prod}"

echo "Fetching secrets from AWS Secrets Manager..."

# Fetch API secrets
API_SECRETS=$(aws secretsmanager get-secret-value --secret-id "yellow-book/api" --region ${AWS_REGION} --query SecretString --output text)

# Fetch Web secrets
WEB_SECRETS=$(aws secretsmanager get-secret-value --secret-id "yellow-book/web" --region ${AWS_REGION} --query SecretString --output text)

# Parse and write to .env.prod
cat > ${ENV_FILE} << EOF
# API Secrets
DATABASE_URL=$(echo ${API_SECRETS} | jq -r '.DATABASE_URL')
GOOGLE_GENERATIVE_AI_API_KEY=$(echo ${API_SECRETS} | jq -r '.GOOGLE_GENERATIVE_AI_API_KEY')
UPSTASH_REDIS_TOKEN=$(echo ${API_SECRETS} | jq -r '.UPSTASH_REDIS_TOKEN // empty')
UPSTASH_REDIS_URL=$(echo ${API_SECRETS} | jq -r '.UPSTASH_REDIS_URL // empty')

# Web Secrets
AUTH_SECRET=$(echo ${WEB_SECRETS} | jq -r '.AUTH_SECRET')
AUTH_GITHUB_ID=$(echo ${WEB_SECRETS} | jq -r '.AUTH_GITHUB_ID')
AUTH_GITHUB_SECRET=$(echo ${WEB_SECRETS} | jq -r '.AUTH_GITHUB_SECRET')

# Public URL
NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-https://yellow-book.darjs.dev}
EOF

chmod 600 ${ENV_FILE}
echo "Secrets written to ${ENV_FILE}"
