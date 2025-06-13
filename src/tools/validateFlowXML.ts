import { XMLParser } from 'fast-xml-parser';

export function validateFlowXML(xml: string): { valid: boolean, errors: string[] } {
  const parser = new XMLParser({ ignoreAttributes: false });
  let obj;
  try {
    obj = parser.parse(xml);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { valid: false, errors: ['Invalid XML format: ' + message] };
  }

  const flow = obj.Flow;
  const errors: string[] = [];

  if (!flow) errors.push('Missing <Flow> root element.');
  if (!flow['@_fullName']) errors.push('Missing fullName attribute on <Flow> root element.');
  if (!flow.label) errors.push('Missing <label> element.');
  if (!flow.processType) errors.push('Missing <processType> element.');
  if (!flow.status) errors.push('Missing <status> element.');

  return { valid: errors.length === 0, errors };
}