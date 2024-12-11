import { jsPDF } from 'jspdf'

export const exportToPDF = (content: string, propertyAddress: string) => {
  const doc = new jsPDF()
  
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('Property Report', 20, 20)
  
  doc.setFontSize(16)
  doc.text(propertyAddress, 20, 35)
  
  const date = new Date().toLocaleDateString()
  doc.setFontSize(10)
  doc.text(`Generated on: ${date}`, 20, 45)
  
  doc.setFontSize(12)
  const splitText = doc.splitTextToSize(content, 170)
  doc.text(splitText, 20, 60)
  
  const filename = `property-report-${propertyAddress.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
  doc.save(filename)
}
