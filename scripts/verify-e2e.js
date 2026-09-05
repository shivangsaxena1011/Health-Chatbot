async function runVerification() {
  console.log('=== SWASTH AI 2.0 END-TO-END VERIFICATION ===\n');
  const baseUrl = 'http://localhost:3000';
  let cookieHeader = '';

  // 1. Test Login
  console.log('1. Testing POST /api/auth/login (demo@swasth.ai)...');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@swasth.ai', password: 'Demo@1234' }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie');
  if (setCookie) {
    cookieHeader = setCookie.split(';')[0];
  }
  console.log('   Login Status:', loginRes.status, '| Success:', loginData.success, '| User:', loginData.user?.email);
  console.log('   HttpOnly Session Cookie Received:', Boolean(cookieHeader));
  if (!loginData.success) throw new Error('Login failed');

  // 2. Test Auth Me
  console.log('\n2. Testing GET /api/auth/me with session cookie...');
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const meData = await meRes.json();
  console.log('   Auth Me Status:', meRes.status, '| Authenticated:', meData.authenticated, '| Name:', meData.user?.name);
  if (!meData.authenticated) throw new Error('Auth verification failed');

  // 3. Test AI Health Chat with RAG Grounding
  console.log('\n3. Testing POST /api/chat ("My sugar is high and I feel thirsty all the time")...');
  const chatRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      query: 'My sugar is high and I feel thirsty all the time',
      language: 'English',
    }),
  });
  const chatData = await chatRes.json();
  console.log('   Chat Status:', chatRes.status, '| Success:', chatData.success);
  console.log('   Sources Cited:', chatData.message?.sources?.map(s => `${s.sourceOrg}: ${s.title}`));
  console.log('   Follow-up suggestions:', chatData.message?.suggestedFollowUps);
  console.log('   Response excerpt:', chatData.message?.content?.substring(0, 150) + '...');
  if (!chatData.message?.sources || chatData.message.sources.length === 0) throw new Error('No sources retrieved');

  // 4. Test Emergency / Red-Flag Detection
  console.log('\n4. Testing POST /api/chat with Emergency Red Flag ("severe crushing chest pain radiating to left arm")...');
  const emergRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      query: 'I have severe crushing chest pain radiating to my left arm',
      language: 'English',
    }),
  });
  const emergData = await emergRes.json();
  console.log('   Emergency Status:', emergRes.status);
  console.log('   Red Flag Detected:', emergData.message?.redFlagDetected);
  console.log('   Emergency Alert Reasons:', emergData.message?.emergencyInfo?.reasons);
  console.log('   Emergency Helplines:', emergData.message?.emergencyInfo?.emergencyContacts);
  if (!emergData.message?.redFlagDetected) throw new Error('Emergency was not detected!');

  // 5. Test Symptom Checker
  console.log('\n5. Testing POST /api/symptoms/assess...');
  const sympRes = await fetch(`${baseUrl}/api/symptoms/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      symptoms: ['Fever', 'Cough', 'Sore throat'],
      duration: '1-3 days',
      severity: 'mild',
      feverPresent: true,
      difficultyBreathing: false,
      chestPain: false,
    }),
  });
  const sympData = await sympRes.json();
  console.log('   Symptom Assessment Urgency:', sympData.assessment?.urgencyLevel);
  console.log('   Possible Associated Topics:', sympData.assessment?.possibleTopics?.map(t => t.condition));
  console.log('   Questions for Doctor:', sympData.assessment?.questionsForDoctor);
  if (!sympData.assessment) throw new Error('Symptom assessment failed');

  // 6. Test Lab Report Analyzer
  console.log('\n6. Testing POST /api/lab-report/analyze with preserved ranges...');
  const labText = `
  CLINICAL LABORATORY INVESTIGATION
  Hemoglobin (Hb): 10.4 g/dL (Reference: 12.0 - 16.0)
  Fasting Blood Sugar: 118 mg/dL (Reference: 70 - 99)
  Platelet Count: 130 10^3/mcL (Reference: 150 - 450)
  `;
  const labRes = await fetch(`${baseUrl}/api/lab-report/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ reportText: labText, fileName: 'CBC_Screening.pdf' }),
  });
  const labData = await labRes.json();
  console.log('   Lab Report Analyzed Markers:', labData.analysis?.results?.map(r => `${r.testName}: ${r.value} ${r.unit} [Status: ${r.status}, Ref: ${r.referenceRange}]`));
  console.log('   Confidence Score:', labData.analysis?.confidenceScore);
  if (!labData.analysis?.results || labData.analysis.results.length === 0) throw new Error('Lab analysis failed');

  // 7. Test Medicine Interaction Checker
  console.log('\n7. Testing POST /api/medicines/interactions (Aspirin + Ibuprofen)...');
  const medRes = await fetch(`${baseUrl}/api/medicines/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ medicines: ['Aspirin', 'Ibuprofen'] }),
  });
  const medData = await medRes.json();
  console.log('   Interactions Count:', medData.interactions?.length);
  console.log('   Interaction Severity:', medData.interactions?.[0]?.severity);
  console.log('   Clinical Summary:', medData.interactions?.[0]?.clinicalSummary);
  if (!medData.interactions?.[0]?.hasInteraction) throw new Error('Interaction not detected');

  // 8. Test Journal Creation
  console.log('\n8. Testing POST /api/journal (Logging BP & Glucose)...');
  const jrnlRes = await fetch(`${baseUrl}/api/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      systolicBp: 118,
      diastolicBp: 78,
      bloodGlucoseMgDl: 92,
      sleepHours: 8,
      waterIntakeLiters: 2.8,
      symptoms: 'Mild evening headache after screen time',
      notes: 'Rested well, drinking chamomile tea',
    }),
  });
  const jrnlData = await jrnlRes.json();
  console.log('   Journal Created Entry ID:', jrnlData.entry?.id, '| BP:', `${jrnlData.entry?.systolicBp}/${jrnlData.entry?.diastolicBp}`);
  if (!jrnlData.entry?.id) throw new Error('Journal creation failed');

  // 9. Test Health Summary Report Generation
  console.log('\n9. Testing GET /api/reports/generate...');
  const repRes = await fetch(`${baseUrl}/api/reports/generate`, {
    headers: { Cookie: cookieHeader },
  });
  const repData = await repRes.json();
  console.log('   Report Generated For:', repData.report?.user?.email);
  console.log('   Vitals Logs In Report:', repData.report?.healthVitalsSummary?.recentJournalCount);
  console.log('   Legal Disclaimer Included:', Boolean(repData.report?.legalDisclaimer));
  if (!repData.report) throw new Error('Report generation failed');

  console.log('\n🎉 ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
}

runVerification().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
