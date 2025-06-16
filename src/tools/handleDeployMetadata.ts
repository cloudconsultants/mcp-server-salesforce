import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import { validateFlowXML } from "./validateFlowXML.js";
import JSZip from "jszip";

const execAsync = promisify(exec);

export interface DeployMetadataArgs {
    metadataType: string;
    metadataName: string;
    metadataContent: string;
    checkOnly?: boolean;
}

export async function handleDeployMetadata(args: DeployMetadataArgs) {
    try {
        // Create a temporary directory for the deployment
        const tempDir = path.join(process.cwd(), "temp_deploy");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // For Flows, validate the XML content
        if (args.metadataType === 'Flow') {
            const validationResult = validateFlowXML(args.metadataContent);
            if (!validationResult.valid) {
                return {
                    content: [{
                        type: "text",
                        text: `Flow XML validation failed: ${validationResult.errors.join(', ')}`
                    }],
                    isError: true
                };
            }

            // Handle flow versioning
            const flowName = args.metadataName;
            const versionMatch = flowName.match(/_v(\d+)$/);
            const baseName = versionMatch ? flowName.slice(0, -versionMatch[0].length) : flowName;
            
            // Check if flow exists and get latest version
            try {
                const { stdout } = await execAsync(`sfdx force:data:soql:query -q "SELECT Id, FullName, VersionNumber FROM Flow WHERE FullName LIKE '${baseName}%' ORDER BY VersionNumber DESC LIMIT 1" --json`);
                const result = JSON.parse(stdout);
                
                if (result.result.records.length > 0) {
                    const latestVersion = result.result.records[0].VersionNumber;
                    const newVersion = latestVersion + 1;
                    args.metadataName = `${baseName}_v${newVersion}`;
                } else {
                    args.metadataName = `${baseName}_v1`;
                }
            } catch (error) {
                // If query fails, assume it's a new flow
                args.metadataName = `${baseName}_v1`;
            }
        }

        // Create the package.xml file
        const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>${args.metadataName}</fullName>
    <types>
        <members>${args.metadataName}</members>
        <name>${args.metadataType}</name>
    </types>
    <version>50.0</version>
</Package>`;

        // Create the metadata file
        const metadataDir = path.join(tempDir, args.metadataType.toLowerCase() + 's');
        if (!fs.existsSync(metadataDir)) {
            fs.mkdirSync(metadataDir, { recursive: true });
        }

        const metadataFile = path.join(metadataDir, `${args.metadataName}.${args.metadataType.toLowerCase()}-meta.xml`);
        fs.writeFileSync(metadataFile, args.metadataContent);

        // Create the package.xml file
        const packageXmlFile = path.join(tempDir, 'package.xml');
        fs.writeFileSync(packageXmlFile, packageXml);

        // Create the zip file using JSZip
        const zip = new JSZip();
        
        // Add package.xml to the root
        zip.file('package.xml', packageXml);
        
        // Add the metadata file to the appropriate folder
        const metadataFolder = args.metadataType.toLowerCase() + 's';
        zip.folder(metadataFolder)?.file(
            `${args.metadataName}.${args.metadataType.toLowerCase()}-meta.xml`,
            args.metadataContent
        );

        // Generate the zip file
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const zipFile = path.join(tempDir, 'deploy.zip');
        fs.writeFileSync(zipFile, zipBuffer);

        // Deploy the metadata
        const checkOnlyFlag = args.checkOnly ? '--checkonly' : '';
        const { stdout, stderr } = await execAsync(`sfdx force:mdapi:deploy -f "${zipFile}" ${checkOnlyFlag} --json`);

        // Clean up
        fs.rmSync(tempDir, { recursive: true, force: true });

        if (stderr) {
            console.error('Deployment stderr:', stderr);
        }

        return {
            content: [{
                type: "text",
                text: `Deployment deployment completed with status: ${stdout}`
            }]
        };
    } catch (error: unknown) {
        console.error('Deployment error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [{
                type: "text",
                text: `Deployment failed: ${errorMessage}`
            }],
            isError: true
        };
    }
} 