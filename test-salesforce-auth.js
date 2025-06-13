// test-salesforce-auth.js
import 'dotenv/config';
import { createSalesforceConnection } from './dist/utils/connection.js';

// Debug: Print environment variables with actual values
console.log('Connection Type:', process.env.SALESFORCE_CONNECTION_TYPE);
console.log('Instance URL:', process.env.SALESFORCE_INSTANCE_URL);
console.log('Client ID:', process.env.SALESFORCE_CLIENT_ID);
console.log('Client Secret:', process.env.SALESFORCE_CLIENT_SECRET);

// Debug: Print the token URL that will be used
const tokenUrl = new URL('/services/oauth2/token', process.env.SALESFORCE_INSTANCE_URL);
console.log('Token URL:', tokenUrl.toString());

(async () => {
  try {
    const conn = await createSalesforceConnection();
    const identity = await conn.identity();
    console.log('Authenticated as:', identity.username);
  } catch (e) {
    console.error('Auth failed:', e);
    // Print the full error details
    if (e.response) {
      console.error('Response data:', e.response.data);
    }
  }
})();