# Topic Tagging Scripts

This directory contains scripts to classify and tag exam questions with topic tags that map to the explainer components.

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp scripts/topic-tagging/.env.example scripts/topic-tagging/.env.local
   ```

2. Edit `.env.local` with your AWS credentials:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   DYNAMODB_TABLE_NAME=exam-questions
   DRY_RUN=true
   ```

3. Install dependencies (if not already installed):
   ```bash
   npm install dotenv
   ```

## Scripts

### test-classification.ts

Tests the classification logic locally without connecting to DynamoDB:

```bash
npx tsx scripts/topic-tagging/test-classification.ts
```

### classify-questions.ts

Classifies and tags all questions in DynamoDB:

```bash
# Dry run (test without writing)
DRY_RUN=true npx tsx scripts/topic-tagging/classify-questions.ts

# Actual run (writes to DynamoDB)
DRY_RUN=false npx tsx scripts/topic-tagging/classify-questions.ts
```

## How Classification Works

1. For each question, the script analyzes:
   - Question text
   - Answer explanations (for all options)
   - Exam tips
   - Answer options

2. Keywords are matched against predefined topic mappings in `topic-mappings.ts`

3. Each topic has:
   - Keywords to match
   - Priority weight (higher = more specific)

4. The topic with the highest weighted score is assigned

5. If no keywords match, a fallback topic for that service is used

## Topic Mappings

Topics are defined in `topic-mappings.ts` and correspond to the explainer components in `components/explainers/`.

Example mapping for Lambda:
- `lambda-concurrency` - Questions about concurrent executions, throttling
- `lambda-cold-starts` - Questions about initialization time, SnapStart
- `lambda-vpc-access` - Questions about VPC connectivity, ENIs
- etc.

## Output

The script generates:
- Console output with progress and summary
- JSON report file: `report-{timestamp}.json`

Report includes:
- Total questions processed
- Successfully tagged count
- Questions that used fallback topics
- Distribution by service and topic
