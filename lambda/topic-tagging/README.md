# Topic Tagging Lambda Function

Lambda function that classifies and tags exam questions in DynamoDB with topic tags based on keyword matching.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DYNAMODB_TABLE_NAME` | `exam-questions` | Name of the DynamoDB table |
| `DRY_RUN` | `true` | Set to `false` to actually update DynamoDB |
| `AWS_REGION` | `us-east-1` | AWS region |

### Lambda Settings

- **Runtime**: Node.js 22.x
- **Timeout**: 15 minutes (900 seconds)
- **Memory**: 512 MB (adjustable)

## Deployment

### Using AWS SAM

```bash
# Build and deploy
cd lambda/topic-tagging
npm install
sam build
sam deploy --guided
```

### Manual Deployment

```bash
# Install dependencies and build
cd lambda/topic-tagging
npm install
npm run build

# Package the function
cd dist
zip -r ../function.zip .
cd ..
zip -ur function.zip node_modules

# Create or update the Lambda function
aws lambda create-function \
  --function-name topic-tagging \
  --runtime nodejs22.x \
  --handler index.handler \
  --timeout 900 \
  --memory-size 512 \
  --role arn:aws:iam::ACCOUNT_ID:role/topic-tagging-role \
  --zip-file fileb://function.zip \
  --environment "Variables={DYNAMODB_TABLE_NAME=exam-questions,DRY_RUN=true}"
```

## Required IAM Permissions

The Lambda function requires the following permissions on the DynamoDB table:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/exam-questions",
        "arn:aws:dynamodb:*:*:table/exam-questions/index/*"
      ]
    }
  ]
}
```

## Invocation

### Manual Invocation

```bash
# Invoke the function
aws lambda invoke \
  --function-name topic-tagging \
  --payload '{}' \
  response.json

# View the response
cat response.json | jq .
```

### Scheduled Invocation (EventBridge)

You can schedule this function to run periodically using EventBridge:

```yaml
# Add to template.yaml
TopicTaggingSchedule:
  Type: AWS::Events::Rule
  Properties:
    ScheduleExpression: rate(1 day)
    Targets:
      - Arn: !GetAtt TopicTaggingFunction.Arn
        Id: TopicTaggingTarget
```

## Response Format

The function returns a JSON report with topic distribution per service:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Topic tagging completed successfully",
    "report": {
      "dryRun": false,
      "tableName": "exam-questions",
      "executionTime": 45.2,
      "totalProcessed": 1500,
      "successfullyTagged": 1200,
      "alreadyTagged": 250,
      "fallbackToGeneral": 50,
      "errors": 0,
      "byService": {
        "lambda": {
          "total": 150,
          "tagged": 120,
          "topicDistribution": {
            "lambda-concurrency": 25,
            "lambda-cold-starts": 20,
            "lambda-vpc-access": 15,
            "lambda-layers": 12
          }
        }
      },
      "byCertification": {
        "DVA-C02": {
          "total": 800,
          "tagged": 650
        },
        "SAA-C03": {
          "total": 700,
          "tagged": 550
        }
      }
    }
  }
}
```

## Testing

### Dry Run (Default)

By default, `DRY_RUN=true`, so the function will analyze questions but not update DynamoDB:

```bash
aws lambda invoke \
  --function-name topic-tagging \
  response.json
```

### Live Run

To actually update DynamoDB, set `DRY_RUN=false`:

```bash
aws lambda update-function-configuration \
  --function-name topic-tagging \
  --environment "Variables={DYNAMODB_TABLE_NAME=exam-questions,DRY_RUN=false}"

aws lambda invoke \
  --function-name topic-tagging \
  response.json
```
