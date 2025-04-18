import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToWord = (htmlContent, fileName = 'CurriculumGenie.docx') => {
  const converted = htmlDocx.asBlob(htmlContent);
  saveAs(converted, fileName);
};

export const exportToPDF = async (elementId, fileName = 'CurriculumGenie.pdf') => {
  const input = document.getElementById(elementId);
  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const width = 210;
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(fileName);
};