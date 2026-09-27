import { jsPDF } from 'jspdf';
import { type Certificate, type StudentProfile, type Application } from './mockData';

function cleanText(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[\u2014\u2013]/g, ' - ')
    .replace(/[\u2022\u25CF\u2023]/g, ' * ')
    .replace(/[\u2713\u2714\u221A]/g, '[VERIFIED]')
    .replace(/[₹]/g, 'INR ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\t\n\r]/g, ' ');
}

function savePdfDocument(doc: jsPDF, filename: string) {
  try {
    const cleanFilename = cleanText(filename).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const blob = doc.output('blob');
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = cleanFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 1500);
  } catch {
    doc.save(cleanText(filename).replace(/[^a-zA-Z0-9_.-]/g, '_'));
  }
}

export function downloadCertificatePDF(cert: Certificate) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Outer border (Forest Green)
  doc.setDrawColor(13, 92, 75);
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner subtle gold border
  doc.setDrawColor(196, 92, 38);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Government / Institutional Seal Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 92, 75);
  doc.text('SETU - NATIONAL ACADEMIA-INDUSTRY COLLABORATION ENGINE', pageWidth / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('All India Institute of Ayurveda (AIIA) | Smart India Hackathon SIH26044', pageWidth / 2, 30, { align: 'center' });

  // Decorative divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(35, 35, pageWidth - 35, 35);

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39);
  doc.text('CERTIFICATE OF VERIFIED COMPETENCY', pageWidth / 2, 48, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('This is to officially certify that the scholar named below has fulfilled all clinical, laboratory,', pageWidth / 2, 58, { align: 'center' });
  doc.text('and standardized assessment benchmarks under institutional oversight:', pageWidth / 2, 64, { align: 'center' });

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(13, 92, 75);
  doc.text(cleanText(cert.studentName).toUpperCase(), pageWidth / 2, 78, { align: 'center' });

  // Roll Number & Institution
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Institutional Roll No: ${cleanText(cert.rollNumber)} | All India Institute of Ayurveda, New Delhi`, pageWidth / 2, 85, { align: 'center' });

  // Course Title
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('For successful mastery and verification in:', pageWidth / 2, 98, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(196, 92, 38);
  doc.text(`"${cleanText(cert.courseTitle)}"`, pageWidth / 2, 108, { align: 'center' });

  // Verified Competencies list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Assessed Skill Standards:', pageWidth / 2, 120, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 92, 75);
  doc.text(cert.skillsVerified.map(cleanText).join('  |  '), pageWidth / 2, 126, { align: 'center' });

  // Bottom Security & Signatures
  const bottomY = 160;

  // Left: QR & Credential ID
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`CREDENTIAL ID: ${cleanText(cert.credentialId)}`, 25, bottomY);
  doc.text(`DATE OF ISSUANCE: ${cleanText(cert.issueDate)}`, 25, bottomY + 5);
  doc.text(`VERIFY AT: ${cleanText(cert.verificationUrl)}`, 25, bottomY + 10);
  doc.text(`ABC CREDIT ID: IND-AIIA-2026-REG`, 25, bottomY + 15);

  // Center: Official Stamp Box
  doc.setDrawColor(13, 92, 75);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth / 2 - 22, bottomY - 6, 44, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 92, 75);
  doc.text('VERIFIED & SEALED', pageWidth / 2, bottomY + 3, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('MINISTRY OF AYUSH / AIIA', pageWidth / 2, bottomY + 9, { align: 'center' });
  doc.text('BLOCKCHAIN HASH VALID', pageWidth / 2, bottomY + 14, { align: 'center' });

  // Right: Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text('Dr. Karthik Reddy', pageWidth - 70, bottomY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Dean of Academic Affairs', pageWidth - 70, bottomY + 9);
  doc.text('All India Institute of Ayurveda', pageWidth - 70, bottomY + 14);

  savePdfDocument(doc, `Setu_Certificate_${cleanText(cert.credentialId)}.pdf`);
}

export function downloadStudentDossierPDF(profile: Partial<StudentProfile>) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header banner
  doc.setFillColor(13, 92, 75);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(240, 253, 249);
  doc.text('SETU OFFICIAL SCHOLAR DOSSIER', 16, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('All India Institute of Ayurveda (AIIA) | Verified Academic & Clinical Record', 16, 24);

  // Student Basic info
  const fullName = cleanText(profile.fullName || 'Scholar Name');
  const branch = cleanText(profile.branch || 'BAMS');
  const rollNumber = cleanText(profile.rollNumber || 'AIIA2022044');
  const college = cleanText(profile.college || 'All India Institute of Ayurveda, New Delhi');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(fullName, 16, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${branch} | Year ${profile.year || 3} | CGPA: ${profile.cgpa || 8.7} / 10.0`, 16, 53);
  doc.text(`Institution: ${college}`, 16, 59);
  doc.text(`Roll Number: ${rollNumber} | Coding Streak: ${profile.codingStreak || 5} Days`, 16, 65);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 72, pageWidth - 16, 72);

  // Curriculum & Clinical Focus
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(13, 92, 75);
  doc.text('I. CURRICULUM STATEMENT & RESEARCH FOCUS', 16, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(
    cleanText(
      profile.summary ||
        'Passionate BAMS undergraduate integrating classical Charaka Samhita diagnostics with modern pharmacovigilance and HPTLC standardization.'
    ),
    pageWidth - 32
  );
  doc.text(summaryLines, 16, 90);

  // Verified Competencies Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(13, 92, 75);
  doc.text('II. VERIFIED CLINICAL & TECHNICAL COMPETENCIES', 16, 115);

  let y = 125;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('COMPETENCY NAME', 16, y);
  doc.text('CATEGORY', 110, y);
  doc.text('PROFICIENCY', 160, y);

  doc.setDrawColor(203, 213, 225);
  doc.line(16, y + 2, pageWidth - 16, y + 2);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  (profile.skills || []).forEach((sk: any) => {
    const sName = cleanText(typeof sk === 'string' ? sk : sk?.name || 'Pharmacology');
    const sCategory = cleanText(typeof sk === 'object' && sk?.category ? sk.category : 'Clinical');
    const sLevel = typeof sk === 'object' && sk?.level ? sk.level : 85;

    doc.text(sName, 16, y);
    doc.text(sCategory.toUpperCase(), 110, y);
    doc.text(`${sLevel}% (Assessed)`, 160, y);
    y += 7;
  });

  // Verification footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 20, pageWidth - 16, pageHeight - 20);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`OFFICIAL DOSSIER GENERATED ON: ${new Date().toLocaleDateString('en-IN')}`, 16, pageHeight - 14);
  doc.text('AUTHENTICATED VIA SETU NATIONAL SKILL REGISTRY (SIH26044)', 16, pageHeight - 10);
  doc.text('PAGE 1 OF 1', pageWidth - 35, pageHeight - 14);

  savePdfDocument(doc, `Setu_Dossier_${fullName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadOfferLetterPDF(app: Application) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const company = cleanText(app.company || 'Practo HealthTech');
  const roleTitle = cleanText(app.roleTitle || 'Research Associate');

  // Company Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(13, 92, 75);
  doc.text(company.toUpperCase(), 16, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Corporate Research & Development Division | In Collaboration with Setu Portal', 16, 30);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 16, 36);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 42, pageWidth - 16, 42);

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(`SUBJECT: FORMAL OFFER OF INTERNSHIP APPOINTMENT - ${roleTitle.toUpperCase()}`, 16, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Dear Scholar (All India Institute of Ayurveda),', 16, 64);

  const text1 = `We are delighted to formally extend to you an offer of appointment as "${roleTitle}" with ${company}. Following your exceptional performance in standardized evaluations, our leadership committee was deeply impressed by your rigorous integration of traditional health sciences with modern research protocols.`;
  const split1 = doc.splitTextToSize(cleanText(text1), pageWidth - 32);
  doc.text(split1, 16, 72);

  let y = 72 + split1.length * 5 + 6;

  doc.setFont('helvetica', 'bold');
  doc.text('KEY TERMS OF APPOINTMENT:', 16, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`1. Role Title: ${roleTitle}`, 20, y); y += 6;
  doc.text('2. Monthly Honorarium / Stipend: INR 30,000 / month (Direct Bank Transfer)', 20, y); y += 6;
  doc.text('3. Commencement Date: 15 October 2026', 20, y); y += 6;
  doc.text('4. Supervising Faculty Guide: Dr. Priyanshi Mehta (Dravyaguna Chair, AIIA)', 20, y); y += 6;
  doc.text('5. Academic Accreditation: Eligible for NCISM & NAAC Internship Credit Units', 20, y); y += 10;

  const text2 = 'Please indicate your formal acceptance of this appointment by signing the institutional MoU deed via your Setu Scholar Portal. We look forward to your impactful contributions to our ongoing collaborative research programs.';
  const split2 = doc.splitTextToSize(cleanText(text2), pageWidth - 32);
  doc.text(split2, 16, y);
  y += split2.length * 5 + 16;

  doc.setFont('helvetica', 'bold');
  doc.text('Yours Sincerely,', 16, y); y += 6;
  doc.text('Director of Clinical & Talent Operations', 16, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(company, 16, y);

  savePdfDocument(doc, `Offer_Letter_${company.replace(/\s+/g, '_')}.pdf`);
}

export function downloadNIRFReportPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(13, 92, 75);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(240, 253, 249);
  doc.text('AIIA - NIRF & NAAC CRITERION ACCREDITATION REPORT', 16, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Audited via Setu National Higher Education Portal | SIH26044', 16, 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('INSTITUTIONAL METRICS SUMMARY (ACADEMIC YEAR 2025-2026)', 16, 40);

  let y = 48;
  const rows = [
    ['Total Enrolled Scholars', '42 Scholars (38 Verified on ABC Ledger)'],
    ['Partner Healthcare Enterprises', '12 Active Corporate Partners (8 Formal MoUs)'],
    ['Internship Placement Conversion Rate', '86.4% (Highest in Ayush Category)'],
    ['Average Monthly Scholar Stipend', 'INR 26,500 / month'],
    ['Sponsored Corporate Research Grants', 'INR 86.5 Lakhs (Dabur, Himalaya, Patanjali)'],
    ['NAAC Criterion 3 & 5 Compliance Score', '98.4% (Audit Ready)'],
  ];

  doc.setFontSize(9);
  rows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(val, 95, y);
    y += 7;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(16, y + 2, pageWidth - 16, y + 2);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DEPARTMENTAL PLACEMENT CONVERSION (%):', 16, y);
  y += 8;

  const depts = [
    ['Dravyaguna Vigyan', '94%'],
    ['Panchakarma', '90%'],
    ['Kayachikitsa', '88%'],
    ['Shalya Tantra', '85%'],
    ['Rasashastra & Bhaishajya Kalpana', '82%'],
    ['Swasthavritta', '76%'],
  ];

  depts.forEach(([d, p]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(d, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 92, 75);
    doc.text(p, 110, y);
    doc.setTextColor(17, 24, 39);
    y += 6;
  });

  savePdfDocument(doc, 'Setu_NIRF_Accreditation_Report_AIIA.pdf');
}

export function downloadFacultyNAACReportPDF(facultyProfile?: Partial<any>) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(240, 249, 255);
  doc.text('AIIA - NAAC CRITERION 3: RESEARCH & INNOVATION DOSSIER', 16, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Faculty Directorate | Department of Dravyaguna Vigyan | SIH26044', 16, 24);

  const name = cleanText(facultyProfile?.fullName || 'Dr. Priyanshi Mehta');
  const designation = cleanText(facultyProfile?.designation || 'Associate Professor & Research Chair');
  const college = cleanText(facultyProfile?.college || 'All India Institute of Ayurveda, New Delhi');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);
  doc.text(name, 16, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${designation} | ${college}`, 16, 53);
  doc.text('Specialization: Medicinal Plants, Chromatography Standards, Pharmacopoeia', 16, 59);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 66, pageWidth - 16, 66);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('1. ACCREDITATION BENCHMARKS (ACADEMIC YEAR 2025-2026)', 16, 76);

  let y = 84;
  const metrics = [
    ['Key Metric', 'Annual Value', 'Status'],
    ['Postgraduate & BAMS Scholar Mentees', '18 Active Scholars', 'Verified [OK]'],
    ['Sponsored Corporate Research Grants', 'INR 48.5 Lakhs (Dabur, Himalaya)', 'Audited [OK]'],
    ['Peer-Reviewed Scopus / PubMed Publications', '14 Clinical Papers', 'Indexed [OK]'],
    ['Institutional Ethics Committee (IEC) Clearances', '9 Protocols Ratified', 'Approved [OK]'],
    ['Student Internship Placement Rate', '94.2% Conversion', 'Exceeds Goal [OK]'],
  ];

  metrics.forEach(([col1, col2, col3], idx) => {
    if (idx === 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(col1, 16, y);
      doc.text(col2, 110, y);
      doc.text(col3, 165, y);
      doc.line(16, y + 2, pageWidth - 16, y + 2);
      y += 8;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(col1, 16, y);
      doc.setFont('helvetica', 'bold');
      doc.text(col2, 110, y);
      doc.setTextColor(13, 92, 75);
      doc.text(col3, 165, y);
      y += 7;
    }
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 25, pageWidth - 16, pageHeight - 25);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`DOCUMENT ID: NAAC-CRIT3-AIIA-2026`, 16, pageHeight - 18);
  doc.text('CERTIFIED FOR INSTITUTIONAL INTERNAL QUALITY ASSURANCE CELL (IQAC)', 16, pageHeight - 13);

  savePdfDocument(doc, `Setu_NAAC_Criterion3_Faculty_Report_${name.replace(/\s+/g, '_')}.pdf`);
}

export function downloadMentorshipLogPDF(mentees: any[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(13, 92, 75);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(240, 253, 249);
  doc.text('AIIA - OFFICIAL CLINICAL ADVISORY & MENTORSHIP LOG', 16, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Verified under Ayush Academic Collaboration Framework | SIH26044', 16, 21);

  let y = 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('ACTIVE SCHOLAR MENTORSHIP ROSTER & SYNC LOGS:', 16, y);

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('SCHOLAR NAME & ROLL', 16, y);
  doc.text('RESEARCH THESIS / PROJECT', 75, y);
  doc.text('ADVISORY HRS', 165, y);

  doc.setDrawColor(203, 213, 225);
  doc.line(16, y + 2, pageWidth - 16, y + 2);

  y += 8;

  mentees.forEach((m) => {
    const sName = cleanText(m.name || 'Scholar');
    const sRoll = cleanText(m.roll || 'AIIA2026');
    const sProject = cleanText(m.project || 'Clinical Research');
    const sHours = m.hoursLogged || 24;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(sName, 16, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(sRoll, 16, y + 4);

    const projectLines = doc.splitTextToSize(sProject, 85);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.text(projectLines, 75, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 92, 75);
    doc.text(`${sHours} Hours`, 165, y);

    y += Math.max(projectLines.length * 4.5, 10) + 4;
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`LOG REPORT GENERATED ON: ${new Date().toLocaleDateString('en-IN')}`, 16, pageHeight - 15);
  doc.text('ALL INDIA INSTITUTE OF AYURVEDA - MENTORSHIP LEDGER', 16, pageHeight - 10);

  savePdfDocument(doc, 'Setu_Scholar_Mentorship_Logbook.pdf');
}

export function downloadMentorshipLogCSV(mentees: any[]) {
  const headers = ['Scholar Name', 'Roll Number', 'Branch', 'Thesis Project', 'Advisory Hours Logged', 'Next Sync Scheduled'];
  const rows = (mentees || []).map((m) => [
    `"${cleanText(m.name)}"`,
    `"${cleanText(m.roll)}"`,
    `"${cleanText(m.branch || 'BAMS')}"`,
    `"${cleanText(m.project).replace(/"/g, '""')}"`,
    m.hoursLogged || 24,
    `"${cleanText(m.nextSync || 'Scheduled')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Setu_Mentorship_Logs.csv');
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadAdminAnalyticsCSV() {
  const headers = ['Metric Category', 'Parameter', 'Measured Value', 'Audit Status', 'Accreditation Body'];
  const data = [
    ['Enrollment', 'Total Registered Scholars', '42 Scholars', 'Verified', 'ABC India'],
    ['Enrollment', 'Scholars with Active Digital Portfolios', '38 Scholars', 'Verified', 'AIIA IQAC'],
    ['Partnerships', 'Active Corporate Enterprise MoUs', '12 Enterprises', 'Active MoU', 'Ministry of Ayush'],
    ['Placements', 'Clinical Internship Fill Rate', '86.4%', 'Optimal', 'NAAC Criterion 5'],
    ['Placements', 'Average Monthly Stipend', 'INR 26,500', 'Audited', 'DBT Compliance'],
    ['Curriculum', 'HPTLC Chemical Profiling Benchmark', '89%', 'Aligned', 'NCISM'],
    ['Curriculum', 'Good Clinical Practice (GCP) Compliance', '86%', 'Aligned', 'CDSCO'],
    ['Curriculum', 'Healthcare Informatics & AI Competency', '68%', 'Bridge Cohort', 'SIH26044'],
  ];

  const csvContent = [headers.join(','), ...data.map((r) => r.map((c) => `"${cleanText(c)}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Setu_Institutional_Audit_Dataset.csv');
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadStudentTranscriptPDF(profile: Partial<StudentProfile>, tasks: any[] = []) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Institutional Header
  doc.setFillColor(13, 92, 75);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(240, 253, 249);
  doc.text('ALL INDIA INSTITUTE OF AYURVEDA - OFFICIAL TRANSCRIPT', 16, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Ayush Academia-Industry Integrated Portal | Setu SIH26044', 16, 20);

  // Student Info
  const studentName = cleanText(profile?.fullName || 'Scholar Student');
  const rollNumber = cleanText(profile?.rollNumber || 'AIIA2026108');
  const department = cleanText(profile?.department || 'Dravyaguna Vigyan');
  const branch = cleanText(profile?.branch || 'BAMS 3rd Year');
  const cgpa = profile?.cgpa ? Number(profile.cgpa).toFixed(1) : '8.7';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(17, 24, 39);
  doc.text(studentName, 16, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Roll No: ${rollNumber} | Branch: ${branch} | Dept: ${department} | CGPA: ${cgpa}/10.0`, 16, 48);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 54, pageWidth - 16, 54);

  // Section 1: 5 Tasks Checklist
  let y = 64;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 92, 75);
  doc.text('I. ACTIONABLE CURRICULAR MILESTONES & TASKS:', 16, y);

  y += 8;
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  safeTasks.forEach((t, idx) => {
    if (y > pageHeight - 45) return;
    const statusText = t.completed ? '[COMPLETED]' : '[PENDING]';
    const taskTitle = cleanText(t.title || `Task #${idx + 1}`);
    const taskCategory = cleanText(t.category || 'Curriculum');
    const taskDueDate = cleanText(t.dueDate || 'Academic Year');
    const taskPoints = t.points || 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(`${statusText} ${taskTitle}`, 16, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${taskCategory} | Points: +${taskPoints} Credits | Due: ${taskDueDate}`, 20, y + 4);
    y += 10;
  });

  // Section 2: Verified Skills
  y += 4;
  if (y < pageHeight - 55) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 92, 75);
    doc.text('II. VERIFIED CLINICAL & TECHNICAL SKILLS:', 16, y);

    y += 8;
    const safeSkills = Array.isArray(profile?.skills) ? profile.skills : [];
    safeSkills.forEach((sk: any) => {
      if (y > pageHeight - 35) return;
      const skName = cleanText(typeof sk === 'string' ? sk : sk?.name || 'Ayurvedic Pharmacology');
      const skCategory = cleanText(typeof sk === 'object' && sk?.category ? sk.category : 'Clinical');
      const skLevel = typeof sk === 'object' && sk?.level ? sk.level : 85;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`- ${skName} (${skCategory}) - Assessed Proficiency: ${skLevel}%`, 20, y);
      y += 6;
    });
  }

  // Footer & Institutional Verification
  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 20, pageWidth - 16, pageHeight - 20);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`TRANSCRIPT GENERATED ON: ${new Date().toLocaleDateString('en-IN')}`, 16, pageHeight - 14);
  doc.text('OFFICIAL DOCUMENT SECURED WITH DIGITAL HASH (SIH26044)', 16, pageHeight - 10);
  doc.text('ALL INDIA INSTITUTE OF AYURVEDA', pageWidth - 70, pageHeight - 10);

  savePdfDocument(doc, `Setu_Student_Transcript_${studentName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadMoUDeedPDF(mou: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(13, 92, 75);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(240, 253, 249);
  doc.text('MEMORANDUM OF UNDERSTANDING (MoU) DEED', 16, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Ministry of Ayush & All India Institute of Ayurveda | SIH26044', 16, 21);

  const title = cleanText(mou?.title || 'Academic-Industry Partnership');
  const code = cleanText(mou?.code || 'MOU-AIIA-2024');
  const tenure = cleanText(mou?.tenure || '2024 - 2029');
  const scope = cleanText(mou?.scope || 'Joint research fellowship and analytical laboratory access.');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text(title, 16, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Registration Code: ${code} | Tenure: ${tenure}`, 16, 48);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 54, pageWidth - 16, 54);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 92, 75);
  doc.text('I. SCOPE OF COLLABORATIVE ACTIVITIES:', 16, 64);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  const scopeLines = doc.splitTextToSize(scope, pageWidth - 32);
  doc.text(scopeLines, 16, 72);

  let y = 72 + scopeLines.length * 6 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 92, 75);
  doc.text('II. STATUTORY COVENANTS & INTELLECTUAL PROPERTY:', 16, y);

  y += 8;
  const terms = [
    '1. All student research data shall be deposited in the National Ayush Academic Bank of Credits.',
    '2. Industry partner shall provide direct monthly honorarium to scholars under DBT mandates.',
    '3. Co-patenting and publication rights shall strictly abide by NCISM statutory guidelines.',
    '4. Periodic milestone audits shall be overseen by AIIA Institutional Quality Cell (IQAC).',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  terms.forEach((t) => {
    doc.text(t, 20, y);
    y += 7;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 25, pageWidth - 16, pageHeight - 25);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`MoU RATIFIED ON: ${new Date().toLocaleDateString('en-IN')}`, 16, pageHeight - 18);
  doc.text('CRYPTOGRAPHICALLY SECURED UNDER NATIONAL SETU FRAMEWORK', 16, pageHeight - 13);

  savePdfDocument(doc, `Setu_MoU_Deed_${code.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
