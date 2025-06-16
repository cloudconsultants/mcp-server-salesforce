import jsforce from 'jsforce';
import { validateFlowXML } from './validateFlowXML.js';

export interface DeployMetadataArgs {
  metadataType: string;
  metadataName: string;
  metadataContent: string;
  checkOnly?: boolean;
}

export async function handleDeployMetadata(conn: any, args: DeployMetadataArgs) {
  if (args.metadataType === 'Flow') {
    const validation = validateFlowXML(args.metadataContent);
    if (!validation.valid) {
      return {
        content: [{
          type: "text",
          text: `Flow XML validation failed:\n${validation.errors.join('\n')}`
        }],
        isError: true
      };
    }
  }
  try {
    // Prepare the zip file for deployment
    // For simplicity, we deploy a single metadata file in a package
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    let typeFolder = args.metadataType;
    let fileName = `${args.metadataName}.${args.metadataType}-meta.xml`;

    // Special case for Flow
    if (args.metadataType === 'Flow') {
      typeFolder = 'flows';
      fileName = `${args.metadataName}.flow-meta.xml`;
    }
    zip.folder(typeFolder)?.file(fileName, args.metadataContent);
    
    // Add package.xml with the same structure as the reference
    zip.file('package.xml', `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>${args.metadataName}</fullName>
    <types>
        <members>${args.metadataName}</members>
        <name>${args.metadataType}</name>
    </types>
    <version>50.0</version>
</Package>`);
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    const result = await conn.metadata.deploy(zipBuffer, {
      checkOnly: !!args.checkOnly,
      singlePackage: true
    }).complete({ details: true });

    return {
      content: [{
        type: "text",
        text: `Deployment ${args.checkOnly ? 'validation' : 'deployment'} completed with status: ${result.status}\n${result.details ? JSON.stringify(result.details, null, 2) : ''}`
      }],
      isError: result.status === 'Failed'
    };
  } catch (error: any) {
    return {
      content: [{
        type: "text",
        text: `Error deploying metadata: ${error.message}`
      }],
      isError: true
    };
  }
} 