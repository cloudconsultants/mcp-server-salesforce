import { XMLParser } from 'fast-xml-parser';

export function generateFlowXML(flowName: string, description: string = '', label: string = ''): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata" fullName="${flowName}">
  <apiVersion>58.0</apiVersion>
  <description>${description || 'Flow created via MCP'}</description>
  <label>${label || flowName}</label>
  <processMetadataValues>
    <name>BuilderType</name>
    <value>
      <stringValue>LightningFlowBuilder</stringValue>
    </value>
  </processMetadataValues>
  <processMetadataValues>
    <name>CanvasMode</name>
    <value>
      <stringValue>AUTO_LAYOUT_CANVAS</stringValue>
    </value>
  </processMetadataValues>
  <processType>AutoLaunchedFlow</processType>
  <start>
    <locationX>176</locationX>
    <locationY>0</locationY>
    <connector>
      <targetReference>myAssignment</targetReference>
    </connector>
  </start>
  <status>Active</status>
  <variables>
    <name>myVariable</name>
    <dataType>String</dataType>
    <isCollection>false</isCollection>
    <isInput>false</isInput>
    <isOutput>false</isOutput>
  </variables>
  <assignments>
    <name>myAssignment</name>
    <label>Assignment</label>
    <locationX>176</locationX>
    <locationY>134</locationY>
    <assignmentItems>
      <assignToReference>myVariable</assignToReference>
      <operator>Assign</operator>
      <value>
        <stringValue>Hello World</stringValue>
      </value>
    </assignmentItems>
    <connector>
      <targetReference>myFlowEnd</targetReference>
    </connector>
  </assignments>
  <flowEnd>
    <name>myFlowEnd</name>
    <label>End</label>
    <locationX>176</locationX>
    <locationY>268</locationY>
  </flowEnd>
</Flow>`;
} 