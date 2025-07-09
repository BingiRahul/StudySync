// src/pages/context/pdfUtils.js
import { jsPDF } from "jspdf";

export const generateSummaryPDF = (note) => {
  if (!note.aiSummary || note.aiSummary.length === 0) {
    alert("No AI summary available.");
    return;
  }

  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Summary for "${note.title}"`, 10, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 30;
  note.aiSummary.forEach((point, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${point}`, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`${note.title.replace(/\s+/g, "_")}_Summary.pdf`);
};
