import { describe, it, expect } from 'vitest';
import { detectEmergency } from '../lib/ai/emergency-engine';

describe('Emergency & Red-Flag Detection Engine', () => {
  it('detects acute cardiac chest pain red flags in English', () => {
    const result = detectEmergency('I have severe crushing chest pain spreading to my left arm');
    expect(result.isEmergency).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.reasons.some(r => r.includes('coronary') || r.includes('heart'))).toBe(true);
    expect(result.emergencyContacts.length).toBeGreaterThan(0);
  });

  it('detects chest pain red flags in Hindi / Hinglish', () => {
    const result = detectEmergency('meri chhati me tez dard aur dabav ho raha hai');
    expect(result.isEmergency).toBe(true);
    expect(result.severity).toBe('critical');
  });

  it('detects acute stroke FAST signs (face drooping and slurred speech)', () => {
    const result = detectEmergency('My father has sudden face drooping and slurred speech');
    expect(result.isEmergency).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.reasons.some(r => r.includes('stroke'))).toBe(true);
  });

  it('detects severe respiratory failure', () => {
    const result = detectEmergency('My child cannot breathe and has blue lips');
    expect(result.isEmergency).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.reasons.some(r => r.includes('respiratory'))).toBe(true);
  });

  it('detects crisis and suicidal thoughts', () => {
    const result = detectEmergency('I want to kill myself');
    expect(result.isEmergency).toBe(true);
    expect(result.reasons.some(r => r.includes('crisis') || r.includes('self-harm'))).toBe(true);
  });

  it('returns non-emergency for routine mild health inquiries', () => {
    const result1 = detectEmergency('What are good dietary tips for healthy digestion?');
    expect(result1.isEmergency).toBe(false);
    expect(result1.severity).toBe('none');
    expect(result1.reasons.length).toBe(0);

    const result2 = detectEmergency('I have a mild runny nose and sneezed twice today');
    expect(result2.isEmergency).toBe(false);
    expect(result2.severity).toBe('none');
  });

  it('handles empty or malformed queries safely without throwing', () => {
    const result = detectEmergency('');
    expect(result.isEmergency).toBe(false);
    expect(result.severity).toBe('none');
  });
});
