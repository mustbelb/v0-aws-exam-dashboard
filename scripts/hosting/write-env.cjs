// Persist only the explicitly permitted application configuration for SSR.
// AWS credentials come from Amplify's compute role, never from this file.
const fs = require('node:fs');
const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'DYNAMODB_TABLE_NAME', 'DYNAMODB_REGION', 'AUTHENTICATED_GENERATOR_URL', 'SUPABASE_SECRET_KEY'];
for (const key of keys.slice(0, 2)) {
  if (!process.env[key]) throw new Error(`Missing configuration: ${key}`);
}
if (process.env.DESIGN_PREVIEW === 'true') throw new Error('Disable DESIGN_PREVIEW for deployment');
fs.writeFileSync('.env.production', keys.filter(key => process.env[key]).map(key => `${key}=${JSON.stringify(process.env[key]).replace(/\$/g, '\\$')}`).join('\n') + '\nDESIGN_PREVIEW=false\n');
console.log('Wrote allowlisted SSR configuration; values are not logged.');
