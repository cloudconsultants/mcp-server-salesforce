import { Tool } from "@modelcontextprotocol/sdk/types.js";
import jsforce from 'jsforce';

export const RETRIEVE_METADATA: Tool = {
  name: "salesforce_retrieve_metadata",
  description: "Retrieve Salesforce metadata (Flows, Apex, etc.) from the org",
  inputSchema: {
    type: "object",
    properties: {
      metadataType: {
        type: "string",
        description: "Type of metadata to retrieve (e.g., 'Flow', 'ApexClass', 'CustomObject')",
        enum: ["Flow", "ApexClass", "ApexTrigger", "CustomObject", "CustomField", "Layout", "Profile", "PermissionSet"]
      },
      metadataName: {
        type: "string",
        description: "Name of the metadata component"
      }
    },
    required: ["metadataType", "metadataName"]
  }
};

export interface RetrieveMetadataArgs {
  metadataType: string; // e.g., 'Flow'
  metadataName: string; // e.g., 'TestFlow'
}

export async function handleRetrieveMetadata(conn: any, args: RetrieveMetadataArgs) {
  try {
    const result = await conn.metadata.read(args.metadataType, [args.metadataName]);
    return {
      content: [{
        type: "text",
        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
      }],
      isError: false
    };
  } catch (error: any) {
    return {
      content: [{
        type: "text",
        text: `Error retrieving metadata: ${error.message}`
      }],
      isError: true
    };
  }
}

