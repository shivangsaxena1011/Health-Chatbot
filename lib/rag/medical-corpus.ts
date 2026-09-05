import { TrustedSource } from '../types/health';

export interface MedicalDocument {
  id: string;
  title: string;
  sourceOrg: 'WHO' | 'CDC' | 'NIH / MedlinePlus' | 'NHS' | 'Government Health Portal';
  sourceUrl: string;
  category: string;
  condition: string;
  keywords: string[];
  content: string;
}

export const TRUSTED_MEDICAL_KNOWLEDGE_BASE: MedicalDocument[] = [
  {
    id: 'who-diabetes-01',
    title: 'WHO Factsheet on Diabetes: Types, Symptoms, and Prevention',
    sourceOrg: 'WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
    category: 'endocrine',
    condition: 'Diabetes',
    keywords: ['sugar', 'blood sugar', 'glucose', 'diabetes', 'thirst', 'frequent urination', 'insulin', 'hyperglycemia', 'sugar problem', 'sugar high'],
    content: `Diabetes is a chronic, metabolic disease characterized by elevated levels of blood glucose (or blood sugar), which leads over time to serious damage to the heart, blood vessels, eyes, kidneys and nerves.
The most common is type 2 diabetes, usually in adults, which occurs when the body becomes resistant to insulin or doesn't make enough insulin.
Common symptoms of diabetes include feeling more thirsty than usual (polydipsia), urinating often (polyuria), unintended weight loss, feeling tired and weak, blurred vision, and slow-healing sores.
Prevention and lifestyle management: A healthy diet, regular physical activity, maintaining a normal body weight and avoiding tobacco use are ways to prevent or delay the onset of type 2 diabetes.
When to seek medical advice: Anyone experiencing persistent excessive thirst, frequent urination, or unexplained weight loss should undergo laboratory blood glucose evaluation (such as fasting plasma glucose or HbA1c) conducted by a qualified doctor.`
  },
  {
    id: 'cdc-hypertension-01',
    title: 'CDC High Blood Pressure Guidelines and Awareness',
    sourceOrg: 'CDC',
    sourceUrl: 'https://www.cdc.gov/blood-pressure/about/index.html',
    category: 'cardiovascular',
    condition: 'Hypertension',
    keywords: ['bp', 'blood pressure', 'hypertension', 'high bp', 'systolic', 'diastolic', 'bp high', 'bp badha', 'headache', 'dizziness'],
    content: `High blood pressure, also called hypertension, is blood pressure that is higher than normal. Blood pressure is measured using two numbers: systolic (pressure when heart beats) and diastolic (pressure when heart rests between beats).
A normal blood pressure level is less than 120/80 mmHg. Hypertension stage 1 is defined as 130-139 systolic or 80-89 diastolic.
Hypertension is often called a 'silent killer' because it usually has no warning signs or symptoms. Many people do not know they have it.
Rarely, severe hypertension (crisis level: 180/120 mmHg or higher) may cause severe headaches, chest pain, dizziness, difficulty breathing, nausea, vomiting, blurred vision, or anxiety.
Lifestyle recommendations: Reduce sodium intake (under 2,300 mg/day, ideally 1,500 mg), engage in 150 minutes of moderate aerobic exercise weekly, limit alcohol, manage stress, and follow the DASH diet (rich in vegetables, fruits, and whole grains).`
  },
  {
    id: 'aha-chest-pain-01',
    title: 'American Heart Association / CDC Warning Signs of a Heart Attack',
    sourceOrg: 'CDC',
    sourceUrl: 'https://www.cdc.gov/heart-disease/about/heart-attack.html',
    category: 'cardiovascular',
    condition: 'Heart Attack',
    keywords: ['chest pain', 'chest heaviness', 'chest pressure', 'heart attack', 'angina', 'left arm pain', 'jaw pain', 'sweating', 'chhati me dard'],
    content: `A heart attack (myocardial infarction) happens when the flow of blood that brings oxygen to a part of your heart muscle suddenly becomes blocked.
Major signs of a heart attack include:
1. Chest discomfort: Most heart attacks involve discomfort in the center or left side of the chest that lasts more than a few minutes, or that goes away and comes back. It can feel like uncomfortable pressure, squeezing, fullness, or pain.
2. Discomfort in other areas of the upper body: Symptoms can include pain or discomfort in one or both arms, the back, neck, jaw, or stomach.
3. Shortness of breath: Often occurs with or before chest discomfort.
4. Other signs: Cold sweat, unusual fatigue, nausea, or lightheadedness.
Critical Guidance: If you or someone you are with experiences these signs, immediately call local emergency services (112 / 911 / 999). Every minute matters. Do not attempt to drive yourself to the hospital.`
  },
  {
    id: 'who-asthma-01',
    title: 'WHO Key Facts on Asthma: Symptoms, Triggers, and Management',
    sourceOrg: 'WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/asthma',
    category: 'respiratory',
    condition: 'Asthma',
    keywords: ['asthma', 'wheezing', 'shortness of breath', 'inhaler', 'chest tightness', 'cough at night', 'saans fulna', 'dama'],
    content: `Asthma is a major non-communicable disease affecting both children and adults. It is characterized by recurrent attacks of breathlessness and wheezing, which vary in severity and frequency from person to person.
Symptoms occur due to inflammation and narrowing of the small airways in the lungs. Symptoms include persistent cough (especially at night or early morning), wheezing (whistling sound when breathing out), shortness of breath, and chest tightness.
Common triggers: Dust mites, pet dander, pollen, cold air, viral respiratory infections, chemical fumes, and physical exertion.
Management: Asthma cannot be cured, but good management with inhaled medications (corticosteroids and bronchodilators) can control the disease and enable people to live a normal, active life.
Red flag: If wheezing is severe, the patient struggles to speak full sentences, or blue discoloration appears around lips or fingernails, urgent emergency medical attention is required.`
  },
  {
    id: 'cdc-cold-flu-covid-01',
    title: 'CDC Clinical Differences: Common Cold, Influenza (Flu), and COVID-19',
    sourceOrg: 'CDC',
    sourceUrl: 'https://www.cdc.gov/flu/symptoms/coldflu.htm',
    category: 'infectious',
    condition: 'Upper Respiratory Infections',
    keywords: ['cold', 'flu', 'influenza', 'fever', 'cough', 'runny nose', 'sore throat', 'body ache', 'chills', 'sardi', 'jukham', 'bukhar'],
    content: `Respiratory illnesses share many overlapping symptoms, but key differences can help identify them:
- Common Cold: Symptoms usually come on gradually. Sneezing, stuffy/runny nose, and mild sore throat are prominent. High fever and severe body aches are rare. Recovery is typically within 7-10 days.
- Influenza (Flu): Symptoms usually come on suddenly. High fever (100°F-104°F), intense chills, severe muscle and body aches, extreme exhaustion/fatigue, and dry cough are hallmark signs.
- COVID-19: Shares flu-like symptoms but can additionally cause loss of taste or smell (anosmia/ageusia) and shortness of breath.
General care for mild viral respiratory infections: Rest, adequate hydration (warm fluids, water), salt water gargles for sore throat, and paracetamol for fever if appropriate.
Warning signs: Difficulty breathing, persistent chest pain, confusion, or symptoms lasting over 10-14 days without improvement require clinical evaluation.`
  },
  {
    id: 'who-dengue-01',
    title: 'WHO Dengue and Severe Dengue Guidelines',
    sourceOrg: 'WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue',
    category: 'infectious',
    condition: 'Dengue Fever',
    keywords: ['dengue', 'mosquito fever', 'platelet', 'high fever', 'retro-orbital pain', 'bone breaking fever', 'dengu', 'rash'],
    content: `Dengue is a mosquito-borne viral infection caused by the dengue virus (DENV), transmitted by female Aedes mosquitoes.
Symptoms: High fever (104°F / 40°C) accompanied by at least two of the following: severe headache, pain behind the eyes (retro-orbital pain), severe muscle and joint pain ('breakbone fever'), nausea, vomiting, swollen glands, or rash.
Warning Signs of Severe Dengue (usually appearing 3-7 days after first symptoms as fever drops): Severe abdominal pain, persistent vomiting, mucosal bleeding (gums or nose), rapid breathing, fatigue/restlessness, and liver enlargement.
Critical Caution: Never take aspirin, ibuprofen, or other non-steroidal anti-inflammatory drugs (NSAIDs) if dengue is suspected, as they increase bleeding risks. Only paracetamol under doctor supervision should be used for fever control. Severe dengue requires urgent hospitalization and intravenous fluid therapy.`
  },
  {
    id: 'nih-thyroid-01',
    title: 'NIH / MedlinePlus Guide to Thyroid Disorders',
    sourceOrg: 'NIH / MedlinePlus',
    sourceUrl: 'https://medlineplus.gov/thyroiddiseases.html',
    category: 'endocrine',
    condition: 'Thyroid Disorders',
    keywords: ['thyroid', 'tsh', 't3', 't4', 'hypothyroidism', 'hyperthyroidism', 'weight gain', 'weight loss', 'hair loss', 'gland'],
    content: `The thyroid is a small, butterfly-shaped gland located in the front of the neck that produces hormones (T3 and T4) regulating the body's metabolism, heart rate, and temperature.
- Hypothyroidism (Underactive Thyroid): The gland produces insufficient hormone. Symptoms include fatigue, unexplained weight gain, cold intolerance, constipation, dry skin, thinning hair, and low mood. Common cause is Hashimoto's thyroiditis.
- Hyperthyroidism (Overactive Thyroid): The gland produces excessive hormone. Symptoms include unintentional weight loss, rapid or irregular heartbeat (tachycardia), heat intolerance, tremors, anxiety, and frequent bowel movements. Common cause is Graves' disease.
Diagnosis: Requires blood tests measuring Thyroid Stimulating Hormone (TSH), Free T4, and Free T3.
Treatment: Highly effective medical therapies exist (such as levothyroxine for hypothyroidism). If you notice swelling in the neck (goiter) or consistent metabolic changes, consult an endocrinologist or physician.`
  },
  {
    id: 'nhs-gerd-01',
    title: 'NHS Overview: Acid Reflux, Heartburn, and GERD',
    sourceOrg: 'NHS',
    sourceUrl: 'https://www.nhs.uk/conditions/heartburn-and-acid-reflux/',
    category: 'digestive',
    condition: 'Acid Reflux / GERD',
    keywords: ['acid reflux', 'gerd', 'heartburn', 'acidity', 'gas', 'chest burning', 'sour burps', 'pet me jalan', 'indigestion'],
    content: `Acid reflux is when stomach acid flows back up into the esophagus (food pipe). If it happens repeatedly and causes discomfort or mucosal damage, it is known as Gastroesophageal Reflux Disease (GERD).
Common symptoms: Heartburn (a burning sensation in the chest, usually after eating and worse at night or lying down), regurgitation of sour liquid or food, difficulty swallowing, feeling of a lump in the throat.
Distinction from Heart Attack: While acid reflux burning can feel similar to chest discomfort, heart attack discomfort typically feels like pressure, squeezing, or heaviness and often radiates to the arm, jaw, or neck. Never assume unexplained new chest pain is merely acid reflux.
Lifestyle measures: Eat smaller, more frequent meals; avoid lying down within 3 hours of eating; elevate the head of the bed; avoid trigger foods (caffeine, chocolate, fatty or spicy foods, citrus); maintain a healthy weight.`
  },
  {
    id: 'who-dehydration-01',
    title: 'WHO Guidelines on Dehydration, Heat Stress, and Oral Rehydration',
    sourceOrg: 'WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease',
    category: 'general_wellness',
    condition: 'Dehydration',
    keywords: ['dehydration', 'water', 'thirst', 'dry mouth', 'dark urine', 'heat exhaustion', 'ors', 'dizziness', 'headache'],
    content: `Dehydration occurs when the body loses more fluids and electrolytes than it takes in, impairing normal physiological functions.
Causes: Inadequate fluid intake, intense exercise in heat, vomiting, diarrhea, or fever.
Mild to moderate symptoms: Dry or sticky mouth, dark yellow or amber urine, reduced urination frequency, headache, muscle cramps, and dizziness upon standing.
Severe dehydration symptoms: Extreme thirst, sunken eyes, rapid heart rate, low blood pressure, lethargy, confusion, or inability to produce tears or urine.
Rehydration: Oral Rehydration Solution (ORS) containing clean water, glucose, and balanced electrolytes (sodium, potassium) is the gold standard for clinical rehydration.
Severe dehydration in infants, young children, or the elderly is a medical emergency requiring immediate intravenous fluid resuscitation.`
  },
  {
    id: 'nih-anemia-01',
    title: 'NIH MedlinePlus Guide to Iron Deficiency Anemia',
    sourceOrg: 'NIH / MedlinePlus',
    sourceUrl: 'https://medlineplus.gov/irondeficiencyanemia.html',
    category: 'hematology',
    condition: 'Iron Deficiency Anemia',
    keywords: ['anemia', 'hemoglobin', 'hb', 'iron', 'fatigue', 'pale skin', 'weakness', 'low hb', 'cold hands', 'shortness of breath on exertion'],
    content: `Iron deficiency anemia is a condition in which blood lacks adequate healthy red blood cells or hemoglobin, which carries oxygen to the body's tissues.
Causes: Insufficient dietary iron, blood loss (e.g. heavy menstrual periods, gastrointestinal bleeding), or poor absorption (e.g. celiac disease).
Common signs: Extreme fatigue, weakness, pale or yellowish skin, cold hands and feet, brittle nails, unusual cravings for non-nutritive substances (pica, such as ice or clay), and dizziness.
Laboratory confirmation: Complete Blood Count (CBC) showing low Hemoglobin (typically <12 g/dL in non-pregnant women, <13.5 g/dL in men), low Hematocrit, and low serum Ferritin.
Dietary iron sources: Lentils, beans, spinach, fortified grains, lean meats, combined with vitamin C to enhance non-heme iron absorption. Consult a doctor before taking high-dose iron supplements.`
  },
];
