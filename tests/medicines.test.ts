import { describe, it, expect } from 'vitest';
import { searchMedicines, checkDrugInteractions } from '../lib/medicines/medicine-service';

describe('Medicine Information & Drug Interaction Checker', () => {
  it('searches medicines by generic or brand name', () => {
    const paracetamolResults = searchMedicines('paracetamol');
    expect(paracetamolResults.length).toBeGreaterThan(0);
    expect(paracetamolResults[0].genericName).toContain('Paracetamol');

    const brandResults = searchMedicines('Dolo');
    expect(brandResults.length).toBeGreaterThan(0);
    expect(brandResults[0].brandNames).toContain('Dolo 650');
  });

  it('detects major clinical interaction between Aspirin and Ibuprofen', () => {
    const interactions = checkDrugInteractions(['Aspirin', 'Ibuprofen']);
    expect(interactions.length).toBe(1);
    expect(interactions[0].hasInteraction).toBe(true);
    expect(interactions[0].severity).toBe('major');
    expect(interactions[0].clinicalSummary).toContain('gastrointestinal');
  });

  it('detects major clinical interaction between Metformin and Alcohol', () => {
    const interactions = checkDrugInteractions(['Metformin', 'Alcohol']);
    expect(interactions.length).toBe(1);
    expect(interactions[0].hasInteraction).toBe(true);
    expect(interactions[0].severity).toBe('major');
    expect(interactions[0].clinicalSummary).toContain('lactic acidosis');
  });

  it('returns safe confirmation when no severe documented interaction exists', () => {
    const interactions = checkDrugInteractions(['Paracetamol', 'Cetirizine']);
    expect(interactions.length).toBe(1);
    expect(interactions[0].hasInteraction).toBe(false);
    expect(interactions[0].severity).toBe('none');
  });
});
