import { describe, it, expect } from 'vitest';
import { parseLabReportText } from '../lib/lab/lab-parser';

describe('Lab Report Analyzer & Parser', () => {
  it('correctly extracts test parameters and flags abnormal low/high values', () => {
    const sampleText = `
    TEST REPORT
    Hemoglobin (Hb): 10.5 g/dL (Reference: 12.0 - 16.0)
    Fasting Blood Sugar: 128 mg/dL (Reference: 70 - 99)
    Serum Creatinine: 0.9 mg/dL (Reference: 0.6 - 1.2)
    `;

    const result = parseLabReportText(sampleText);
    expect(result.results.length).toBe(3);

    const hb = result.results.find(r => r.testName.includes('Hemoglobin'));
    expect(hb).toBeDefined();
    expect(hb?.value).toBe(10.5);
    expect(hb?.status).toBe('low');
    expect(hb?.referenceRange).toContain('12');

    const fbs = result.results.find(r => r.testName.includes('Fasting Blood Sugar'));
    expect(fbs).toBeDefined();
    expect(fbs?.value).toBe(128);
    expect(fbs?.status).toBe('high');

    const creat = result.results.find(r => r.testName.includes('Creatinine'));
    expect(creat).toBeDefined();
    expect(creat?.value).toBe(0.9);
    expect(creat?.status).toBe('normal');

    expect(result.questionsForDoctor.length).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0.8);
  });

  it('handles empty or unrecognized lab text gracefully', () => {
    const result = parseLabReportText('This is just arbitrary text with no blood markers');
    expect(result.results.length).toBe(0);
    expect(result.overallSummary).toContain('Could not automatically identify');
  });
});
