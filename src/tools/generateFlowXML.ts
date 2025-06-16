import { XMLParser } from 'fast-xml-parser';

export function generateFlowXML(flowName: string, label?: string, description?: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>58.0</apiVersion>
  <assignments>
    <name>myAssignment</name>
    <label>My Assignment</label>
    <locationX>176</locationX>
    <locationY>134</locationY>
    <assignmentItems>
      <assignToReference>var1</assignToReference>
      <operator>Assign</operator>
      <value>
        <numberValue>1.0</numberValue>
      </value>
    </assignmentItems>
  </assignments>
  <description>${description || 'Minimal valid flow'}</description>
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
  <processType>Flow</processType>
  <start>
    <locationX>50</locationX>
    <locationY>0</locationY>
    <connector>
      <targetReference>myAssignment</targetReference>
    </connector>
  </start>
  <status>Active</status>
  <variables>
    <name>var1</name>
    <dataType>Number</dataType>
    <isCollection>false</isCollection>
    <isInput>false</isInput>
    <isOutput>false</isOutput>
    <scale>0</scale>
  </variables>
</Flow>`;
} 