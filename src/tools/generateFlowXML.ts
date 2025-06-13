import { XMLParser } from 'fast-xml-parser';

export function generateFlowXML(flowName: string, label?: string, description?: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata" fullName="TestFlow">
  <apiVersion>58.0</apiVersion>
  <description>Minimal valid flow</description>
  <label>TestFlow</label>
  <processType>Flow</processType>
  <status>Active</status>
  <processMetadataValues>
    <name>ObjectType</name>
    <value xsi:type="xsd:string" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"/>
  </processMetadataValues>
  <startElementReference>myAssignment</startElementReference>
  <assignments>
    <name>myAssignment</name>
    <label>My Assignment</label>
    <locationX>100</locationX>
    <locationY>100</locationY>
    <assignmentItems>
      <assignToReference>var1</assignToReference>
      <operator>Assign</operator>
      <value>
        <numberValue>1</numberValue>
      </value>
    </assignmentItems>
  </assignments>
  <variables>
    <name>var1</name>
    <dataType>Number</dataType>
    <scale>0</scale>
    <isCollection>false</isCollection>
    <isInput>false</isInput>
    <isOutput>false</isOutput>
  </variables>
</Flow>`;
} 