import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, ArrowRight, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/payment/success.css';

import logoImage from '../assets/logo/morodok-logo.png';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, tripName, amount, method } = location.state || {};

  useEffect(() => {
    if (!bookingId) navigate('/');
    window.scrollTo(0, 0);
  }, [bookingId, navigate]);

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      const brandGreen = [45, 74, 45]; 

      // --- HEADER BACKGROUND ---
      doc.setFillColor(...brandGreen);
      doc.rect(0, 0, 210, 40, 'F');

      try {
        doc.addImage(logoImage, 'PNG', 15, 8, 22, 22); 
      } catch (e) {
        console.error("Logo could not be added to PDF:", e);
      }

      // --- BRANDING TEXT ---
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Morodok Eco", 42, 25);
      doc.setFontSize(10);
      doc.text("Official Booking Receipt", 42, 32);

      // --- CUSTOMER & RECEIPT INFO ---
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("RECEIPT INFORMATION", 20, 55);

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Confirmation ID: #${bookingId}`, 20, 65);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 72);
      doc.text(`Payment Method: ${method === 'card' ? 'Credit/Debit Card' : method?.toUpperCase() || 'N/A'}`, 20, 79);

      // --- ITEM TABLE ---
      autoTable(doc, {
        startY: 90,
        head: [['Description', 'Amount']],
        body: [
          [`Reservation: ${tripName || 'Selected Trip'}`, `$${amount?.toLocaleString() || '0.00'}`],
          ['Service Fee & Taxes', '$0.00'],
        ],
        headStyles: { fillColor: brandGreen, fontSize: 11 },
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
        alternateRowStyles: { fillColor: [245, 248, 245] }
      });

      // --- TOTAL SECTION ---
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setDrawColor(...brandGreen);
      doc.setLineWidth(0.5);
      doc.line(140, finalY - 7, 190, finalY - 7);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Paid: $${amount?.toLocaleString() || '0.00'}`, 190, finalY, { align: 'right' });

      // --- FOOTER ---
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(150);
      doc.text("Thank you for choosing Morodok Eco. Please keep this for your records.", 105, 275, { align: 'center' });
      doc.text("For support, contact support@morodokeco.com", 105, 282, { align: 'center' });

      // Trigger Download
      doc.save(`Receipt_MorodokEco_${bookingId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Error generating receipt.");
    }
  };

  if (!bookingId) return null;

  return (
    <div className="success-view">
      <Header />
      <main className="success-container">
        <div className="success-card">
          <div className="success-header">
            <div className="icon-wrapper">
              <CheckCircle size={60} color="#2d4a2d" />
            </div>
            <h1>Booking Confirmed!</h1>
            <p>Thank you, your payment was processed successfully.</p>
            <span className="conf-number">Confirmation ID: #{bookingId}</span>
          </div>

          <div className="success-body">
            <div className="receipt-section">
              <h3>Reservation Details</h3>
              <div className="receipt-row">
                <div className="receipt-item">
                  <MapPin size={18} />
                  <div>
                    <label>Trip</label>
                    <p>{tripName || 'Trip details unavailable'}</p>
                  </div>
                </div>
                <div className="receipt-item">
                  <CreditCard size={18} />
                  <div>
                    <label>Payment Method</label>
                    <p>{method === 'card' ? 'Credit/Debit Card' : method?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="total-box">
              <span>Total Paid</span>
              <span className="final-amount">${amount?.toLocaleString() || '0'}</span>
            </div>
          </div>

          <div className="success-footer">
            <button className="download-btn" onClick={handleDownload}>
              <Download size={18} /> Download Receipt
            </button>
            <Link to="/account" className="dashboard-link">
              Go to My Bookings <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;