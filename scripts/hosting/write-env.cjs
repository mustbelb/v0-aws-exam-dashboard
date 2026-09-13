// Persist only the explicitly permitted application configuration for SSR.
// AWS credentials come from Amplify's compute role, never from this file.
const fs = require('node:fs');
const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'DYNAMODB_TABLE_NAME', 'DYNAMODB_REGION', 'AUTHENTICATED_GENERATOR_URL', 'SUPABASE_SECRET_KEY', 'APP_ENVIRONMENT'];
for (const key of keys.slice(0, 2)) {
  if (!process.env[key]) throw new Error(`Missing configuration: ${key}`);
}
if (process.env.DESIGN_PREVIEW === 'true') throw new Error('Disable DESIGN_PREVIEW for deployment');
if (process.env.APP_ENVIRONMENT === 'staging') {
  const stagingUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!/^https:\/\/[a-z]{20}\.supabase\.co$/.test(stagingUrl || '')
      || ['rbquwmbthcuvxmowtwej', 'rerlbckqpphqhukasotw'].some(id => stagingUrl.includes(id))
      || process.env.DYNAMODB_TABLE_NAME !== 'cert-galaxy-staging-questions'
      || (process.env.AUTHENTICATED_GENERATOR_URL && process.env.AUTHENTICATED_GENERATOR_URL !== 'disabled')) {
    throw new Error('Staging must use its isolated database/table and disable generation');
  }
  if (!process.env.SUPABASE_SECRET_KEY) throw new Error('Staging issuance key is missing');
}
fs.writeFileSync('.env.production', keys.filter(key => process.env[key]).map(key => `${key}=${JSON.stringify(process.env[key]).replace(/\$/g, '\\$')}`).join('\n') + '\nDESIGN_PREVIEW=false\n');
console.log('Wrote allowlisted SSR configuration; values are not logged.');
