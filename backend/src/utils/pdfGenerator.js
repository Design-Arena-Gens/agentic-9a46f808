import PDFDocument from 'pdfkit';

export const generatePrescriptionPdf = (prescription, stream) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);

  doc
    .fontSize(20)
    .text('EHR Demo - Prescription', { align: 'center' })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Prescription ID: ${prescription._id}`)
    .text(`Issued At: ${new Date(prescription.issuedAt).toLocaleString()}`)
    .moveDown();

  doc.text(`Doctor: ${prescription.doctorId?.name || 'N/A'}`);
  doc.text(`Patient: ${prescription.patientId?.name || 'N/A'}`);
  doc.moveDown();

  doc.fontSize(14).text('Medications:', { underline: true }).moveDown(0.5);
  prescription.medications.forEach((med, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. ${med.name}`)
      .text(`   Dose: ${med.dose || 'N/A'}`)
      .text(`   Frequency: ${med.frequency || 'N/A'}`)
      .text(`   Duration: ${med.duration || 'N/A'}`)
      .text(`   Instructions: ${med.instructions || 'N/A'}`)
      .moveDown(0.5);
  });

  if (prescription.notes) {
    doc.moveDown();
    doc.fontSize(12).text(`Notes: ${prescription.notes}`);
  }

  doc.end();
};
