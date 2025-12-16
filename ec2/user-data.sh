#!/bin/bash
# EC2 User Data Script for Yellow Book Application
# This script runs on first boot to set up the EC2 instance

set -e

# Variables (these will be replaced or set via environment)
AWS_REGION="ap-southeast-1"
APP_DIR="/opt/yellow-book"

# Update system
yum update -y

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install AWS CLI (should be pre-installed on Amazon Linux 2)
yum install -y aws-cli jq

# Create application directory
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Create the fetch-secrets script
cat > ${APP_DIR}/fetch-secrets.sh << 'FETCHSCRIPT'
#!/bin/bash
set -e

AWS_REGION="ap-southeast-1"
ENV_FILE="/opt/yellow-book/.env.prod"

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

# Public URL (update this to your domain)
NEXT_PUBLIC_BACKEND_URL=https://yellow-book.darjs.dev
EOF

chmod 600 ${ENV_FILE}
echo "Secrets written to ${ENV_FILE}"
FETCHSCRIPT

chmod +x ${APP_DIR}/fetch-secrets.sh

# Create the deploy script
cat > ${APP_DIR}/deploy.sh << 'DEPLOYSCRIPT'
#!/bin/bash
set -e

AWS_REGION="ap-southeast-1"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
APP_DIR="/opt/yellow-book"
IMAGE_TAG="${1:-latest}"

cd ${APP_DIR}

echo "Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo "Pulling latest images..."
export ECR_REGISTRY=${ECR_REGISTRY}
export IMAGE_TAG=${IMAGE_TAG}

docker-compose -f docker-compose.prod.yml pull

echo "Fetching secrets..."
./fetch-secrets.sh

echo "Deploying application..."
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

echo "Cleaning up old images..."
docker image prune -f

echo "Deployment complete!"
docker-compose -f docker-compose.prod.yml ps
DEPLOYSCRIPT

chmod +x ${APP_DIR}/deploy.sh

# Create systemd service for auto-start
cat > /etc/systemd/system/yellow-book.service << 'SERVICEUNIT'
[Unit]
Description=Yellow Book Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/yellow-book
ExecStart=/opt/yellow-book/deploy.sh
ExecStop=/usr/local/bin/docker-compose -f /opt/yellow-book/docker-compose.prod.yml down

[Install]
WantedBy=multi-user.target
SERVICEUNIT

systemctl daemon-reload
systemctl enable yellow-book.service

echo "EC2 setup complete! Run /opt/yellow-book/deploy.sh to deploy the application."
