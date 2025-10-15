/**
 * Email Results Modal Component
 */
import React, { useState } from 'react';

export const EmailResultsModal = ({ 
  isOpen, 
  onClose, 
  calculationData,
  allColumnData 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSendEmail = async () => {
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Prepare results data
      const results = allColumnData.map(data => ({
        productName: data.productName,
        feeColumn: data.colKey,
        grossLoan: data.gross,
        netLoan: data.net,
        icr: data.icr ? `${data.icr.toFixed(2)}x (${(data.icr * 100).toFixed(0)}%)` : 'N/A',
        fullRate: data.fullRateText,
      }));

      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: email,
          calculationData: {
            ...calculationData,
            results,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ 
          type: 'success', 
          message: 'Email sent successfully! Check your inbox.' 
        });
        setTimeout(() => {
          onClose();
          setEmail('');
          setStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setStatus({ 
          type: 'error', 
          message: data.message || 'Failed to send email' 
        });
      }
    } catch (error) {
      console.error('Email error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Network error. Please ensure the backend server is running.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            color: '#0f172a',
          }}>
            📧 Email Results
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            color: '#64748b',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            Enter the email address where you'd like to receive the calculation results.
          </p>

          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '8px',
          }}>
            Email Address
          </label>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendEmail();
            }}
          />
        </div>

        {/* Status Message */}
        {status.message && (
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: status.type === 'success' ? '#166534' : '#991b1b',
            fontSize: '14px',
          }}>
            {status.type === 'success' ? '✅ ' : '⚠️ '}
            {status.message}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#f1f5f9',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSendEmail}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#64748b' : '#008891',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}></span>
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};