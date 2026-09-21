import { jsPDF } from 'jspdf';
import { type Certificate, type StudentProfile, type Application } from './mockData';

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
  doc.text('SETU — NATIONAL ACADEMIA-INDUSTRY COLLABORATION ENGINE', pageWidth / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('All India Institute of Ayurveda (AIIA) • Smart India Hackathon SIH26044', pageWidth / 2, 30, { align: 'center' });

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
  doc.text(cert.studentName.toUpperCase(), pageWidth / 2, 78, { align: 'center' });

  // Roll Number & Institution
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Institutional Roll No: ${cert.rollNumber} • All India Institute of Ayurveda, New Delhi`, pageWidth / 2, 85, { align: 'center' });

  // Course Title
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('For successful mastery and verification in:', pageWidth / 2, 98, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(196, 92, 38);
  doc.text(`"${cert.courseTitle}"`, pageWidth / 2, 108, { align: 'center' });

  // Verified Competencies list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Assessed Skill Standards:', pageWidth / 2, 120, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 92, 75);
  doc.text(cert.skillsVerified.join('  •  '), pageWidth / 2, 126, { align: 'center' });

  // Bottom Security & Signatures
  const bottomY = 160;

  // Left: QR & Credential ID
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`CREDENTIAL ID: ${cert.credentialId}`, 25, bottomY);
  doc.text(`DATE OF ISSUANCE: ${cert.issueDate}`, 25, bottomY + 5);
  doc.text(`VERIFY AT: ${cert.verificationUrl}`, 25, bottomY + 10);
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

  // Save the PDF
  doc.save(`Setu_Certificate_${cert.credentialId}.pdf`);
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
  doc.text('All India Institute of Ayurveda (AIIA) • Verified Academic & Clinical Record', 16, 24);

  // Student Basic info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(profile.fullName || 'Scholar Name', 16, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${profile.branch || 'BAMS'} • Year ${profile.year || 3} • CGPA: ${profile.cgpa || 8.7} / 10.0`, 16, 53);
  doc.text(`Institution: ${profile.college || 'All India Institute of Ayurveda, New Delhi'}`, 16, 59);
  doc.text(`Roll Number: ${profile.rollNumber || 'AIIA2022044'} • Coding Arena Streak: ${profile.codingStreak || 5} Days`, 16, 65);

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
    profile.summary || 'Passionate BAMS undergraduate integrating classical Charaka Samhita diagnostics with modern pharmacovigilance and HPTLC standardization.',
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

  (profile.skills || []).forEach((sk) => {
    doc.text(sk.name, 16, y);
    doc.text(sk.category.toUpperCase(), 110, y);
    doc.text(`${sk.level}% (Assessed)`, 160, y);
    y += 7;
  });

  // Projects & Publications
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(13, 92, 75);
  doc.text('III. PEER-REVIEWED RESEARCH PROJECTS & ACHIEVEMENTS', 16, y);

  y += 10;
  (profile.portfolio?.projects || []).forEach((p) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text(`• ${p.title}`, 16, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const descLines = doc.splitTextToSize(p.desc, pageWidth - 32);
    doc.text(descLines, 20, y);
    y += descLines.length * 4.5 + 4;
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

  doc.save(`Setu_Dossier_${(profile.fullName || 'Scholar').replace(/\s+/g, '_')}.pdf`);
}

export function downloadOfferLetterPDF(app: Application) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Company Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(13, 92, 75);
  doc.text(app.company.toUpperCase(), 16, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Corporate Research & Development Division • In Collaboration with Setu Portal', 16, 30);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 16, 36);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 42, pageWidth - 16, 42);

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(`SUBJECT: FORMAL OFFER OF INTERNSHIP APPOINTMENT — ${app.roleTitle.toUpperCase()}`, 16, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Dear Ananya Iyer (Scholar, All India Institute of Ayurveda),', 16, 64);

  const text1 = `We are delighted to formally extend to you an offer of appointment as "${app.roleTitle}" with ${app.company}. Following your exceptional performance in the standardized domain evaluations and subsequent scientific panel interview, our leadership committee was deeply impressed by your rigorous integration of traditional health sciences with modern research protocols.`;
  const split1 = doc.splitTextToSize(text1, pageWidth - 32);
  doc.text(split1, 16, 72);

  let y = 72 + split1.length * 5 + 6;

  doc.setFont('helvetica', 'bold');
  doc.text('KEY TERMS OF APPOINTMENT:', 16, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('1. Role Title: ' + app.roleTitle, 20, y); y += 6;
  doc.text('2. Monthly Honorarium / Stipend: INR 30,000 / month (Direct Bank Transfer)', 20, y); y += 6;
  doc.text('3. Commencement Date: 15 October 2026', 20, y); y += 6;
  doc.text('4. Supervising Faculty Guide: Dr. Priyanshi Mehta (Dravyaguna Chair, AIIA)', 20, y); y += 6;
  doc.text('5. Academic Accreditation: Eligible for NCISM & NAAC Internship Credit Units', 20, y); y += 10;

  const text2 = 'Please indicate your formal acceptance of this appointment by signing the institutional MoU deed via your Setu Scholar Portal. We look forward to your impactful contributions to our ongoing collaborative research programs.';
  const split2 = doc.splitTextToSize(text2, pageWidth - 32);
  doc.text(split2, 16, y);
  y += split2.length * 5 + 16;

  doc.setFont('helvetica', 'bold');
  doc.text('Yours Sincerely,', 16, y); y += 6;
  doc.text('Director of Clinical & Talent Operations', 16, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(app.company, 16, y);

  doc.save(`Offer_Letter_${app.company.replace(/\s+/g, '_')}.pdf`);
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
  doc.text('AIIA — NIRF & NAAC CRITERION ACCREDITATION REPORT', 16, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Audited via Setu National Higher Education Portal • SIH26044', 16, 21);

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

  doc.save('Setu_NIRF_Accreditation_Report_AIIA.pdf');
}
