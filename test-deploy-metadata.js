import 'dotenv/config';
import { createSalesforceConnection } from './dist/utils/connection.js';
import { handleDeployMetadata } from './dist/tools/handleDeployMetadata.js';
import { generateFlowXML } from './dist/tools/generateFlowXML.js';

(async () => {
  const conn = await createSalesforceConnection();
  const flowXML = generateFlowXML('TestFlow', 'Test Flow', 'A test flow deployed via MCP');
  const result = await handleDeployMetadata(conn, {
    metadataType: 'Flow',
    metadataName: 'TestFlow',
    metadataContent: flowXML,
    checkOnly: false
  });
  console.log(result);
})();
