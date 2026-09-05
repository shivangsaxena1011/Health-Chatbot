const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('--- Swasth AI 2.0 Database Seeder ---');
  const dataDir = path.join(__dirname, '..', 'data');
  const dataFile = path.join(dataDir, 'local-db.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let db = {
    users: [],
    profiles: [],
    conversations: [],
    messages: [],
    journals: [],
    symptomAssessments: [],
    labReports: [],
    auditLogs: [],
  };

  if (fs.existsSync(dataFile)) {
    try {
      db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      console.warn('Initializing new database store');
    }
  }

  // Create demo user if not existing
  const demoEmail = 'demo@swasth.ai';
  let demoUser = db.users.find(u => u.email === demoEmail);

  if (!demoUser) {
    const passwordHash = await bcrypt.hash('Demo@1234', 12);
    demoUser = {
      id: 'user_demo_swasth_001',
      email: demoEmail,
      passwordHash,
      name: 'Dr. Swasth Demo User',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.users.push(demoUser);
    console.log('Created demo user: demo@swasth.ai / Demo@1234');
  } else {
    console.log('Demo user already present.');
  }

  // Ensure demo profile
  let demoProfile = db.profiles.find(p => p.userId === demoUser.id);
  if (!demoProfile) {
    demoProfile = {
      id: 'prof_demo_001',
      userId: demoUser.id,
      age: 34,
      sex: 'Male',
      heightCm: 175,
      weightKg: 72,
      bloodType: 'B+',
      allergies: 'Penicillin, Dust mites',
      chronicConditions: 'Mild Seasonal Asthma',
      currentMedications: 'Salbutamol Inhaler (as needed)',
      emergencyContactName: 'Dr. Anita Sharma',
      emergencyContactPhone: '+91 98765 43210',
      updatedAt: new Date(),
    };
    db.profiles.push(demoProfile);
    console.log('Seeded demo health profile.');
  }

  // Ensure sample health journal entries
  if (db.journals.filter(j => j.userId === demoUser.id).length === 0) {
    const sampleEntries = [
      {
        id: 'jrnl_demo_001',
        userId: demoUser.id,
        date: new Date(Date.now() - 3 * 86400000),
        symptoms: 'Mild morning cough and sneezing',
        painLevel: 1,
        mood: 'good',
        sleepHours: 7.5,
        waterIntakeLiters: 2.5,
        systolicBp: 118,
        diastolicBp: 78,
        bloodGlucoseMgDl: 92,
        weightKg: 72.2,
        notes: 'Felt well, routine morning walk completed.',
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        id: 'jrnl_demo_002',
        userId: demoUser.id,
        date: new Date(Date.now() - 2 * 86400000),
        symptoms: 'Slight fatigue after exercise',
        painLevel: 2,
        mood: 'neutral',
        sleepHours: 6.8,
        waterIntakeLiters: 2.2,
        systolicBp: 122,
        diastolicBp: 80,
        bloodGlucoseMgDl: 95,
        weightKg: 72.0,
        notes: 'Hydrated well after workout.',
        createdAt: new Date(Date.now() - 2 * 86400000),
      },
      {
        id: 'jrnl_demo_003',
        userId: demoUser.id,
        date: new Date(Date.now() - 86400000),
        symptoms: 'None, feeling energetic',
        painLevel: 0,
        mood: 'good',
        sleepHours: 8.0,
        waterIntakeLiters: 3.0,
        systolicBp: 116,
        diastolicBp: 76,
        bloodGlucoseMgDl: 89,
        weightKg: 71.9,
        notes: 'Great sleep quality, healthy balanced diet.',
        createdAt: new Date(Date.now() - 86400000),
      },
    ];
    db.journals.push(...sampleEntries);
    console.log('Seeded 3 sample health journal entries with vitals and trends.');
  }

  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), 'utf8');
  console.log('Seeding completed successfully! Demo credentials:');
  console.log('  Email: demo@swasth.ai');
  console.log('  Password: Demo@1234');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
