import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const downloadUserReceipt = (booking) => {
  const doc = new jsPDF();
  
  // Set Brand Green
  const brandGreen = [45, 74, 45]; 

  // --- 1. Branding Header ---
  doc.setFillColor(...brandGreen);
  doc.rect(0, 0, 210, 40, 'F'); // Green bar at top
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("HIDDEN TRAVEL", 20, 25);
  
  doc.setFontSize(10);
  doc.text("Official Booking Receipt", 20, 32);

  // --- 2. Booking Details Section ---
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("BOOKING DETAILS", 20, 55);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Confirmation #: ${booking.id}`, 20, 65);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 70);
  doc.text(`Status: ${booking.status || 'Confirmed'}`, 20, 75);

  // --- 3. Guest Info ---
  doc.setFont(undefined, 'bold');
  doc.text("GUEST INFORMATION", 120, 55);
  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${booking.full_name}`, 120, 65);
  doc.text(`Email: ${booking.email}`, 120, 70);
  doc.text(`Contact: ${booking.contact_phone}`, 120, 75);

  // --- 4. The Receipt Table ---
  doc.autoTable({
    startY: 85,
    head: [['Description', 'Trip Date', 'Qty', 'Amount']],
    body: [
      [
        booking.trip_name || 'Travel Package', 
        new Date(booking.started_date).toLocaleDateString(),
        `${booking.num_people} Guests`,
        `$${Number(booking.total_price).toLocaleString()}`
      ]
    ],
    headStyles: { fillColor: brandGreen },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 3: { halign: 'right' } }
  });

  // --- 5. Total ---
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`TOTAL PAID: $${Number(booking.total_price).toLocaleString()}`, 190, finalY, { align: 'right' });

  // --- 6. Footer Note ---
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(120);
  doc.text("Please present this receipt at the meeting point. For support, contact support@hiddentravel.com", 105, 280, { align: 'center' });

  // Trigger Download
  doc.save(`HiddenTravel_Receipt_${booking.id}.pdf`);
};