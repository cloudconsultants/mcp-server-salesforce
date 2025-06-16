import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const DEPLOY_METADATA: Tool = {
  name: "salesforce_deploy_metadata",
  description: `Deploy Salesforce metadata (Flows, Apex, etc.) to the org.

Requirements for different metadata types:

1. Flow:
   - The Flow XML must have a fullName attribute on the <Flow> root element
   - Must include processMetadataValues for BuilderType and CanvasMode
   - CanvasMode should be set to AUTO_LAYOUT_CANVAS
   - Must include required elements: apiVersion, label, processType, status
   - For action calls, include name, label, locationX, locationY, actionName, actionType
   - Variables must specify dataType, isCollection, isInput, isOutput
   - Start element must have locationX, locationY, and connector with targetReference
   - To end a flow, use <flowEnd> element instead of an action call
   - Each element that can connect to the end should have a connector pointing to the flowEnd
   - For record-triggered flows, include object, recordTriggerType, and triggerType in the start element

2. ApexClass:
   - Must include class declaration with proper name
   - Must specify API version
   - Must have proper access modifiers

3. ApexTrigger:
   - Must include trigger declaration with proper name and object
   - Must specify API version
   - Must have proper event handlers

4. CustomObject:
   - Must include fullName, label, pluralLabel
   - Must specify deploymentStatus and sharingModel
   - Name field configuration is required

5. CustomField:
   - Must include fullName, label, type
   - Type-specific attributes (length, precision, scale) as needed
   - For picklists, include valueSet definition

6. Layout:
   - Must specify fullName matching the object
   - Must include layoutSections with proper field references

7. Profile:
   - Must include fullName
   - Must specify userPermissions and fieldPermissions

8. PermissionSet:
   - Must include fullName
   - Must specify userPermissions and fieldPermissions

The package.xml will be automatically generated with the correct structure:
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>[metadataName]</fullName>
    <types>
        <members>[metadataName]</members>
        <name>[metadataType]</name>
    </types>
    <version>50.0</version>
</Package>`,
  inputSchema: {
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

export interface DeployMetadataArgs {
  metadataType: string;
  metadataName: string;
  metadataContent: string;
  checkOnly?: boolean;
}

export { handleDeployMetadata } from './handleDeployMetadata.js';
