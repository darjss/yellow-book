# AWS ECR Setup Guide

This guide walks you through setting up AWS ECR (Elastic Container Registry) for the Yellow Book project.

## Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions
- GitHub repository access

## Step 1: Create ECR Repositories

```bash
# Set your AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=ap-southeast-1

# Create API repository
aws ecr create-repository \
  --repository-name yellow-book-api \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE

# Create Web repository
aws ecr create-repository \
  --repository-name yellow-book-web \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE
```

## Step 2: Set Lifecycle Policies

Create a lifecycle policy file `lifecycle-policy.json`:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 tagged images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["main-", "latest"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    },
    {
      "rulePriority": 2,
      "description": "Remove untagged images after 1 day",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 1
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

Apply the lifecycle policy to both repositories:

```bash
# Apply to API repository
aws ecr put-lifecycle-policy \
  --repository-name yellow-book-api \
  --lifecycle-policy-text file://lifecycle-policy.json \
  --region $AWS_REGION

# Apply to Web repository
aws ecr put-lifecycle-policy \
  --repository-name yellow-book-web \
  --lifecycle-policy-text file://lifecycle-policy.json \
  --region $AWS_REGION
```

## Step 3: Create IAM User for GitHub Actions

Create an IAM user with programmatic access:

```bash
# Create IAM user
aws iam create-user --user-name yellow-book-ci

# Create policy file
cat > ecr-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:DescribeRepositories",
                "ecr:ListImages"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create and attach policy
aws iam create-policy \
  --policy-name YellowBookECRPolicy \
  --policy-document file://ecr-policy.json

aws iam attach-user-policy \
  --user-name yellow-book-ci \
  --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/YellowBookECRPolicy

# Create access keys
aws iam create-access-key --user-name yellow-book-ci
```

## Step 4: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - `AWS_ACCESS_KEY_ID` - From the access key creation output
   - `AWS_SECRET_ACCESS_KEY` - From the access key creation output
   - `AWS_ACCOUNT_ID` - Your AWS account ID

## Step 5: Verify Setup

Test the setup by pushing to your main branch:

```bash
# Test local ECR login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# List repositories
aws ecr describe-repositories --region $AWS_REGION
```

## Step 6: Monitor ECR

Check your repositories in the AWS Console:

1. Go to ECR service
2. You should see `yellow-book-api` and `yellow-book-web`
3. After CI runs, you'll see images with tags like:
   - `latest`
   - `main-abc123def`
   - `abc123def` (short SHA)

## Cost Optimization

The lifecycle policy above helps control costs by:

- Keeping only the last 10 tagged images
- Removing untagged images after 1 day
- Enabling image scanning for security

Expected monthly cost: ~$5-10 for storage with this policy.

## Troubleshooting

### Common Issues

1. **"no basic auth credentials"** - Check AWS credentials in GitHub secrets
2. **"repository does not exist"** - Verify repository names and region
3. **"access denied"** - Check IAM user permissions

### Debug Commands

```bash
# Test ECR access
aws ecr describe-repositories --repository-names yellow-book-api

# Check IAM permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::$AWS_ACCOUNT_ID:user/yellow-book-ci \
  --action-names ecr:GetAuthorizationToken ecr:PutImage \
  --resource-arns "*"
```

## Next Steps

After ECR setup is complete:

1. Push to main branch to trigger CI/CD
2. Verify images appear in ECR with proper tags
3. Test pulling images for local deployment
4. Prepare for EKS deployment (next lab)
