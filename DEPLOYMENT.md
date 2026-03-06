# AWS Auto-Deploy Setup (GitHub Actions)

This repo is preconfigured with a deployment workflow:

- Workflow file: `.github/workflows/deploy-website.yml`
- Trigger: push to `main` when files under `website/` change
- Manual trigger: GitHub Actions -> "Deploy Website to AWS" -> Run workflow

## What the workflow does

1. Validates required secrets exist
2. Syncs `website/` to your S3 bucket
3. Invalidates CloudFront cache (`/*`)

## Required GitHub Secrets

Add these in GitHub:

`Settings -> Secrets and variables -> Actions -> New repository secret`

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (example: `us-east-1`)
- `S3_BUCKET` (bucket name only, no `s3://`)
- `CLOUDFRONT_DISTRIBUTION_ID` (example: `E123ABC456DEF`)

## IAM permissions needed

Your AWS user/role used by the keys should allow:

- `s3:ListBucket` on the website bucket
- `s3:PutObject`, `s3:DeleteObject` on the website bucket objects
- `cloudfront:CreateInvalidation` on your distribution

## First deploy

After adding secrets:

1. Push any small change to `main`, or run the workflow manually.
2. Check Action logs for `Sync website to S3` and `Invalidate CloudFront cache`.
3. Open your CloudFront domain and hard refresh.
