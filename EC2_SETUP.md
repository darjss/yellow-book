# EC2 Deployment Setup Guide

This guide walks you through setting up an EC2 instance to deploy the Yellow Book application directly from ECR.

## Architecture Overview

```
[Cloudflare] → [EC2 Instance (t3.medium)]
                    ├── Nginx (port 80)
                    ├── Web (Next.js, port 3000)
                    └── API (Fastify, port 3001)
```

## Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions
- Existing ECR repositories (see ECR_SETUP.md)
- Domain configured in Cloudflare

## Step 1: Create IAM Role for EC2

Create an IAM role that allows EC2 to pull from ECR and read secrets:

```bash
# Create trust policy
cat > ec2-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name YellowBookEC2Role \
  --assume-role-policy-document file://ec2-trust-policy.json

# Create policy for ECR and Secrets Manager access
cat > ec2-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-1:*:secret:yellow-book/*"
      ]
    }
  ]
}
EOF

# Create and attach the policy
aws iam create-policy \
  --policy-name YellowBookEC2Policy \
  --policy-document file://ec2-policy.json

export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws iam attach-role-policy \
  --role-name YellowBookEC2Role \
  --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/YellowBookEC2Policy

# Create instance profile
aws iam create-instance-profile --instance-profile-name YellowBookEC2Profile
aws iam add-role-to-instance-profile \
  --instance-profile-name YellowBookEC2Profile \
  --role-name YellowBookEC2Role
```

## Step 2: Create Security Group

```bash
# Create security group
aws ec2 create-security-group \
  --group-name yellow-book-sg \
  --description "Security group for Yellow Book EC2" \
  --vpc-id <your-vpc-id>

# Get the security group ID
SG_ID=$(aws ec2 describe-security-groups \
  --filters Name=group-name,Values=yellow-book-sg \
  --query 'SecurityGroups[0].GroupId' --output text)

# Allow SSH (restrict to your IP in production)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS (for Cloudflare)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

## Step 3: Create SSH Key Pair

```bash
# Create key pair for SSH access
aws ec2 create-key-pair \
  --key-name yellow-book-key \
  --query 'KeyMaterial' \
  --output text > yellow-book-key.pem

chmod 400 yellow-book-key.pem
```

## Step 4: Launch EC2 Instance

```bash
# Get latest Amazon Linux 2 AMI
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" \
            "Name=state,Values=available" \
  --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
  --output text)

# Launch instance with user-data script
aws ec2 run-instances \
  --image-id $AMI_ID \
  --instance-type t3.medium \
  --key-name yellow-book-key \
  --security-group-ids $SG_ID \
  --iam-instance-profile Name=YellowBookEC2Profile \
  --user-data file://ec2/user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=yellow-book}]' \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]'
```

## Step 5: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret                  | Description                           |
| ----------------------- | ------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key for CI user            |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for CI user            |
| `AWS_ACCOUNT_ID`        | Your AWS account ID                   |
| `EC2_HOST`              | Public IP or DNS of your EC2 instance |
| `EC2_SSH_KEY`           | Contents of `yellow-book-key.pem`     |

## Step 6: Configure Cloudflare

1. Go to your Cloudflare dashboard
2. Add an A record:
   - Name: `yellow-book` (or your subdomain)
   - Content: Your EC2 public IP
   - Proxy status: Proxied (orange cloud)
3. SSL/TLS settings:
   - Set encryption mode to "Flexible" or "Full"

## Step 7: First Deployment

After the EC2 instance is running:

```bash
# SSH into the instance
ssh -i yellow-book-key.pem ec2-user@<EC2_PUBLIC_IP>

# Check if user-data completed successfully
sudo cat /var/log/cloud-init-output.log

# Verify Docker is running
docker --version
docker-compose --version

# Copy deployment files (or push to main to trigger CI/CD)
# The CI/CD pipeline will automatically deploy on push to main
```

## Manual Deployment

If you need to deploy manually:

```bash
ssh -i yellow-book-key.pem ec2-user@<EC2_PUBLIC_IP>

cd /opt/yellow-book
sudo AWS_ACCOUNT_ID=<your-account-id> ./deploy.sh latest
```

## Monitoring & Troubleshooting

### View logs

```bash
# View all container logs
docker-compose -f /opt/yellow-book/docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f /opt/yellow-book/docker-compose.prod.yml logs -f api
docker-compose -f /opt/yellow-book/docker-compose.prod.yml logs -f web
```

### Check container status

```bash
docker-compose -f /opt/yellow-book/docker-compose.prod.yml ps
```

### Restart services

```bash
cd /opt/yellow-book
docker-compose -f docker-compose.prod.yml restart
```

### View secrets (debugging)

```bash
# Check if secrets are loaded correctly
cat /opt/yellow-book/.env.prod
```

## Cost Comparison

| Component           | EKS Cost        | EC2 Cost        |
| ------------------- | --------------- | --------------- |
| Control Plane       | $72/month       | $0              |
| Compute (t3.medium) | ~$30/month      | ~$30/month      |
| Load Balancer       | $16/month       | $0 (Cloudflare) |
| **Total**           | **~$118/month** | **~$30/month**  |

**Estimated savings: ~$88/month**

## Security Considerations

1. **SSH Access**: Restrict SSH to your IP range in the security group
2. **Secrets**: All secrets are fetched from AWS Secrets Manager at deploy time
3. **SSL/TLS**: Handled by Cloudflare (free SSL)
4. **Updates**: Regularly update the EC2 instance: `sudo yum update -y`

## Rollback

To rollback to a previous version:

```bash
# Deploy a specific image tag
sudo AWS_ACCOUNT_ID=<your-account-id> ./deploy.sh <previous-commit-sha>
```

## Next Steps

- Set up CloudWatch for monitoring and alerts
- Configure automated backups
- Set up log aggregation (CloudWatch Logs or similar)
