# BTL Calculator Backend

## Setup Instructions

1. **Install Dependencies**
```bash
   cd backend
   npm install
```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with your email credentials:
```env
     EMAIL_USER=your-email@outlook.com
     EMAIL_PASS=your-app-password
```

3. **Get Outlook App Password** (Recommended)
   - Go to https://account.microsoft.com/security
   - Create an app password for "Mail"
   - Use this password in `EMAIL_PASS`

4. **Start the Server**
```bash
   npm start
   # or for development with auto-reload:
   npm run dev
```

5. **Test the API**
```bash
   curl http://localhost:3001/health
```

## API Endpoints

### POST /api/send-email
Send calculation results via email.

**Request Body:**
```json
{
  "recipientEmail": "recipient@example.com",
  "calculationData": {
    "propertyValue": 1000000,
    "monthlyRent": 3000,
    "productType": "2yr Fix",
    "tier": "Tier 1",
    "propertyType": "Residential",
    "productGroup": "Specialist",
    "isRetention": "No",
    "results": [...]
  }
}
```

## Troubleshooting

- **Authentication Error**: Check your email credentials
- **Connection Error**: Verify SMTP settings
- **Port Already in Use**: Change PORT in .env file