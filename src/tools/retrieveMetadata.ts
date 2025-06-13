import jsforce from 'jsforce';

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

