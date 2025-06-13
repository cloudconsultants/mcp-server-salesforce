// New tool definition
const DEPLOY_METADATA = {
  name: "salesforce_deploy_metadata",
  description: "Deploy Salesforce metadata (Flows, Apex, etc.) to the org",
  parameters: {
    type: "object",
    properties: {
      metadataType: {
        type: "string",
        description: "Type of metadata to deploy (e.g., 'Flow', 'ApexClass', 'CustomObject')",
        enum: ["Flow", "ApexClass", "ApexTrigger", "CustomObject", "CustomField", "Layout", "Profile", "PermissionSet"]
      },
      metadataName: {
        type: "string",
        description: "Name of the metadata component"
      },
      metadataContent: {
        type: "string",
        description: "XML or source content of the metadata"
      },
      checkOnly: {
        type: "boolean",
        description: "If true, only validate the deployment without making changes",
        default: false
      }
    },
    required: ["metadataType", "metadataName", "metadataContent"]
  }
};
