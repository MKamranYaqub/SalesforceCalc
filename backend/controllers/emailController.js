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

// Format percentage
const formatPercentage = (value) => {
  if (!value && value !== 0) return '—';
  return `${(value * 100).toFixed(2)}%`;
};

// Generate HTML email content matching the calculator design
const generateEmailHTML = (data) => {
  const { calculationData } = data;
  const { results, propertyValue, monthlyRent, productType, tier, propertyType, productGroup, isRetention } = calculationData;

  // Find the best result (highest net loan)
  const bestResult = results.reduce((best, current) => {
    return (!best || current.netLoan > best.netLoan) ? current : best;
  }, null);

  // Generate result rows for the table
  const resultsHTML = results
    .map(
      (result) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">${result.feeColumn}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; font-size: 14px; color: #1e293b;">${formatCurrency(result.grossLoan)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 14px; color: #1e293b;">${formatCurrency(result.netLoan)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 14px; color: #1e293b;">${result.icr || '—'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 14px; color: #1e293b;">${result.fullRate || '—'}</td>
    </tr>
  `
    )
    .join('');

  // Calculate LTV percentages for best result
  const bestGrossLtv = bestResult && propertyValue ? Math.round((bestResult.grossLoan / propertyValue) * 100) : 0;
  const bestNetLtv = bestResult && propertyValue ? Math.round((bestResult.netLoan / propertyValue) * 100) : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BTL Rate Matrix Calculation Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #008891 0%, #006b73 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">BTL Rate Matrix Calculator</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Calculation Results</p>
    </div>

    <!-- Blue Info Banner -->
    <div style="background-color: #008891; color: #ffffff; padding: 16px 30px; text-align: center;">
      <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">
        Based on the inputs, the maximum gross loan is:
      </div>
      <div style="background-color: #ffffff; color: #1e293b; border-radius: 8px; padding: 16px; font-size: 20px; font-weight: 800; margin-bottom: 8px;">
        ${formatCurrency(bestResult?.grossLoan || 0)} @ ${bestGrossLtv}% LTV, ${productType}, ${tier}, ${bestResult?.feeColumn || 0}% Fee
      </div>
      <div style="background-color: #00285b; color: #ffffff; border-radius: 8px; padding: 12px; font-size: 12px;">
        <span style="font-weight: 800; text-decoration: underline;">Max net loan</span>
        <span style="opacity: 0.95;"> (amount advanced day 1) is ${formatCurrency(bestResult?.netLoan || 0)} @ ${bestNetLtv}% LTV, ${productType}, ${tier}, ${bestResult?.feeColumn || 0}% Fee</span>
      </div>
    </div>

    <!-- Calculation Summary Section -->
    <div style="padding: 30px; background-color: #ffffff;">
      <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Calculation Summary</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Property Value:</span>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">${formatCurrency(propertyValue)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Monthly Rent:</span>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">${formatCurrency(monthlyRent)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Property Type:</span>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">${propertyType}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Product Group:</span>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">BTL ${productGroup}${isRetention === 'Yes' ? ' Retention' : ''}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Product Type:</span>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">${productType}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <span style="color: #64748b; font-size: 14px; font-weight: 600;">Tier:</span>
          </td>
          <td style="padding: 12px 0; text-align: right;">
            <span style="color: #1e293b; font-size: 14px; font-weight: 700;">${tier}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Results Table - Dynamically shows all fee columns -->
    <div style="padding: 0 30px 30px 30px;">
      <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Loan Options (${results.length} Fee ${results.length === 1 ? 'Column' : 'Columns'})</h2>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 14px 12px; text-align: left; font-weight: 700; font-size: 13px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Fee %</th>
              <th style="padding: 14px 12px; text-align: right; font-weight: 700; font-size: 13px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Gross Loan</th>
              <th style="padding: 14px 12px; text-align: right; font-weight: 700; font-size: 13px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Net Loan</th>
              <th style="padding: 14px 12px; text-align: center; font-weight: 700; font-size: 13px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">ICR</th>
              <th style="padding: 14px 12px; text-align: center; font-weight: 700; font-size: 13px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Rate</th>
            </tr>
          </thead>
          <tbody>
            ${resultsHTML}
          </tbody>
        </table>
      </div>
      
      <!-- Results count indicator -->
      <div style="margin-top: 12px; text-align: center; font-size: 12px; color: #64748b;">
        Showing all ${results.length} fee column${results.length === 1 ? '' : 's'} with calculated results
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 30px; background-color: #f8fafc; border-top: 2px solid #e2e8f0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b; font-weight: 600;">
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

    // Validate results array
    if (!calculationData.results || !Array.isArray(calculationData.results) || calculationData.results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No calculation results provided',
      });
    }

    console.log(`📧 Sending email with ${calculationData.results.length} fee columns`);

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

    console.log('✅ Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
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