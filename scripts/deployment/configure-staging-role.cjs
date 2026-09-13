// Isolated staging compute role; never updates the production role or app configuration.
const {execFileSync}=require('node:child_process');
function aws(args){try{return JSON.parse(execFileSync('aws',[...args,'--profile','aws-exam-local','--region','us-east-2','--output','json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})||'{}')}catch(error){const code=String(error.stderr).match(/\(([A-Za-z]+)\)/)?.[1];throw new Error(code||'AWS staging role request failed')}}
const account=aws(['sts','get-caller-identity']).Account;
if(account!=='996068820512')throw Error('Unexpected AWS account');
const appId='d33uz7aibh12e5';
const app=aws(['amplify','get-app','--app-id',appId,'--query','app.{arn:appArn,repository:repository}']);
if(app.repository!=='https://github.com/mustbelb/v0-aws-exam-dashboard')throw Error('Unexpected repository');
const name='cert-galaxy-staging-compute';
const trust={Version:'2012-10-17',Statement:[{Effect:'Allow',Principal:{Service:'amplify.amazonaws.com'},Action:'sts:AssumeRole',Condition:{StringEquals:{'aws:SourceAccount':account},ArnLike:{'aws:SourceArn':[app.arn,app.arn+'/*']}}}]};
try{aws(['iam','get-role','--role-name',name])}catch(error){if(error.message!=='NoSuchEntity')throw error;aws(['iam','create-role','--role-name',name,'--assume-role-policy-document',JSON.stringify(trust),'--tags','Key=Environment,Value=staging','Key=Project,Value=CertGalaxy'])}
const role=aws(['iam','get-role','--role-name',name]).Role;
if(!role.Tags?.some(tag=>tag.Key==='Environment'&&tag.Value==='staging'))throw Error('Refusing to modify an untagged role');
aws(['iam','put-role-policy','--role-name',name,'--policy-name','StagingQuestionRead','--policy-document',JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Allow',Action:'dynamodb:Query',Resource:`arn:aws:dynamodb:us-east-2:${account}:table/cert-galaxy-staging-questions`}]})]);
console.log(JSON.stringify({role:role.Arn,table:'cert-galaxy-staging-questions',permission:'dynamodb:Query'}));
