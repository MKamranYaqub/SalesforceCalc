import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Format currency for email
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Generate HTML email content
const generateEmailHTML = (data) => {
  const { calculationData } = data;
  const { results, propertyValue, monthlyRent, productType, tier, propertyType, productGroup, isRetention } = calculationData;

  const resultsHTML = results
    .map(
      (result) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${result.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${result.feeColumn}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${formatCurrency(result.grossLoan)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(result.netLoan)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${result.icr}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${result.fullRate}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BTL Rate Matrix Calculation Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #008891 0%, #006b73 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">BTL Rate Matrix Calculator</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Calculation Results</p>
    </div>

    <!-- Summary Section -->
    <div style="padding: 30px; background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #0f172a;">Calculation Summary</h2>
      <div style="display: grid; gap: 15px;">
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b; font-weight: 600;">Property Value:</span>
          <span style="color: #0f172a; font-weight: 700;">${formatCurrency(propertyValue)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b; font-weight: 600;">Monthly Rent:</span>
          <span style="color: #0f172a; font-weight: 700;">${formatCurrency(monthlyRent)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b; font-weight: 600;">Property Type:</span>
          <span style="color: #0f172a; font-weight: 700;">${propertyType}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b; font-weight: 600;">Product Group:</span>
          <span style="color: #0f172a; font-weight: 700;">BTL ${productGroup}${isRetention === 'Yes' ? ' Retention' : ''}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b; font-weight: 600;">Product Type:</span>
          <span style="color: #0f172a; font-weight: 700;">${productType}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0;">
          <span style="color: #64748b; font-weight: 600;">Tier:</span>
          <span style="color: #0f172a; font-weight: 700;">${tier}</span>
        </div>
      </div>
    </div>

    <!-- Results Table -->
    <div style="padding: 30px;">
      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #0f172a;">Loan Options</h2>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 12px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">Product</th>
              <th style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">Fee %</th>
              <th style="padding: 12px; text-align: right; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">Gross Loan</th>
              <th style="padding: 12px; text-align: right; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">Net Loan</th>
              <th style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">ICR</th>
              <th style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1;">Rate</th>
            </tr>
          </thead>
          <tbody>
            ${resultsHTML}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 30px; background-color: #f8fafc; border-top: 2px solid #e2e8f0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">
        Generated by BTL Rate Matrix Calculator
      </p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        ${new Date().toLocaleString('en-GB', { 
          dateStyle: 'long', 
          timeStyle: 'short' 
        })}
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Controller function
export const sendCalculationEmail = async (req, res) => {
  try {
    const { recipientEmail, calculationData } = req.body;

    // Validation
    if (!recipientEmail || !calculationData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: {
        name: 'BTL Rate Matrix Calculator',
        address: process.env.EMAIL_FROM,
      },
      to: recipientEmail,
      subject: 'BTL Rate Matrix - Your Calculation Results',
      html: generateEmailHTML({ calculationData }),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    let errorMessage = 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your internet connection.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};