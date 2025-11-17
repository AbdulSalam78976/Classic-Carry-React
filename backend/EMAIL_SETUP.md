# Email Setup Guide - Nodemailer

Complete guide to configure email notifications for order confirmations.

## 📧 Overview

The backend now sends automatic email notifications when orders are placed:
- ✅ **Customer Email** - Order confirmation with details
- ✅ **Owner Email** - New order notification

## 🔧 Setup Options

### Option 1: Gmail (Recommended for Development)

#### Step 1: Enable App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Enable 2-Step Verification if not already enabled
5. Scroll down and click **App passwords**
6. Select app: **Mail**
7. Select device: **Other (Custom name)**
8. Enter name: **Classic Carrry Backend**
9. Click **Generate**
10. Copy the 16-character password (remove spaces)

#### Step 2: Update .env File

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Classic Carrry
OWNER_EMAIL=classiccarrry@gmail.com
```

**Example:**
```env
EMAIL_USER=classiccarrry@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=classiccarrry@gmail.com
EMAIL_FROM_NAME=Classic Carrry
OWNER_EMAIL=classiccarrry@gmail.com
```

### Option 2: Other Email Services

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## 🧪 Testing Email Configuration

### Method 1: Create a Test Order

1. Start the backend server:
```bash
npm run dev
```

2. Create an order via API or frontend
3. Check console for email status:
```
✅ Email sent: <message-id>
✅ Order confirmation emails sent successfully
```

### Method 2: Test Email Function Directly

Create a test file `backend/test-email.js`:

```javascript
import dotenv from 'dotenv';
import { sendEmail } from './config/email.js';

dotenv.config();

const testEmail = async () => {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from Classic Carrry',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
    });
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
  process.exit();
};

testEmail();
```

Run the test:
```bash
node backend/test-email.js
```

## 📋 Email Templates

### Customer Email Includes:
- ✅ Order confirmation message
- ✅ Order number and date
- ✅ Itemized list of products
- ✅ Pricing breakdown (subtotal, delivery, total)
- ✅ Delivery address
- ✅ Next steps information
- ✅ Contact information
- ✅ Professional branding

### Owner Email Includes:
- ✅ New order alert
- ✅ Order number and timestamp
- ✅ Customer contact details
- ✅ Delivery address
- ✅ Complete order items table
- ✅ Total amount
- ✅ Action items checklist
- ✅ Delivery notes (if provided)

## 🎨 Customizing Email Templates

Email templates are in `backend/utils/emailTemplates.js`

### Modify Customer Email:
```javascript
export const customerOrderConfirmation = (order) => {
  // Customize HTML template here
  return `
    <!DOCTYPE html>
    <html>
    ...
    </html>
  `;
};
```

### Modify Owner Email:
```javascript
export const ownerOrderNotification = (order) => {
  // Customize HTML template here
  return `
    <!DOCTYPE html>
    <html>
    ...
    </html>
  `;
};
```

## 🔍 Troubleshooting

### Issue: "Invalid login" Error

**Solution:**
- Verify EMAIL_USER and EMAIL_PASS are correct
- For Gmail, ensure you're using App Password, not regular password
- Check if 2-Step Verification is enabled

### Issue: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify SMTP_HOST and SMTP_PORT
- Check firewall settings
- Try different SMTP_PORT (587 or 465)

### Issue: Emails not received

**Solution:**
- Check spam/junk folder
- Verify recipient email address
- Check email service quotas
- Review email logs in console

### Issue: "self signed certificate" Error

**Solution:**
Add to email config:
```javascript
tls: {
  rejectUnauthorized: false
}
```

## 📊 Email Delivery Status

The system logs email status:

**Success:**
```
✅ Email sent: <1234567890.abcdef@gmail.com>
✅ Order confirmation emails sent successfully
```

**Failure:**
```
❌ Email sending failed: Invalid login
```

**Note:** Order creation will succeed even if email fails.

## 🚀 Production Recommendations

### 1. Use Professional Email Service

For production, use dedicated email services:
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **Amazon SES** - Pay as you go
- **Postmark** - Reliable transactional emails

### 2. Set Up Email Tracking

Monitor email delivery:
- Open rates
- Click rates
- Bounce rates
- Spam reports

### 3. Add Email Queue

For high volume, use queue system:
- **Bull** - Redis-based queue
- **RabbitMQ** - Message broker
- **AWS SQS** - Cloud queue service

### 4. Implement Email Templates

Use template engines:
- **Handlebars**
- **EJS**
- **Pug**

### 5. Add Unsubscribe Option

Include unsubscribe link in marketing emails (not required for transactional).

## 📧 Email Best Practices

### Design
- ✅ Mobile-responsive design
- ✅ Clear call-to-action
- ✅ Professional branding
- ✅ Readable fonts and colors
- ✅ Optimized images

### Content
- ✅ Clear subject lines
- ✅ Personalized greeting
- ✅ Concise information
- ✅ Contact information
- ✅ Legal compliance

### Technical
- ✅ SPF records configured
- ✅ DKIM signing enabled
- ✅ DMARC policy set
- ✅ Proper error handling
- ✅ Rate limiting

## 🔐 Security Considerations

1. **Never commit .env file** - Contains sensitive credentials
2. **Use App Passwords** - Don't use main account password
3. **Rotate credentials** - Change passwords regularly
4. **Monitor usage** - Watch for unusual activity
5. **Limit permissions** - Use service accounts with minimal access

## 📝 Environment Variables Reference

```env
# Required
EMAIL_USER=your-email@gmail.com          # Sender email address
EMAIL_PASS=your-app-password             # Email password or app password
EMAIL_FROM=your-email@gmail.com          # From address
EMAIL_FROM_NAME=Classic Carrry           # Sender name
OWNER_EMAIL=classiccarrry@gmail.com      # Owner notification email

# Optional (for custom SMTP)
SMTP_HOST=smtp.gmail.com                 # SMTP server
SMTP_PORT=587                            # SMTP port
SMTP_SECURE=false                        # Use TLS (true/false)
SMTP_USER=your-email@gmail.com           # SMTP username
SMTP_PASS=your-password                  # SMTP password
```

## 🎯 Quick Setup Checklist

- [ ] Enable 2-Step Verification on Gmail
- [ ] Generate App Password
- [ ] Update .env file with credentials
- [ ] Set OWNER_EMAIL to receive notifications
- [ ] Restart backend server
- [ ] Test with a sample order
- [ ] Check spam folder if not received
- [ ] Verify both customer and owner emails
- [ ] Customize templates if needed
- [ ] Set up production email service

## 📞 Support

If you encounter issues:
1. Check console logs for error messages
2. Verify all environment variables are set
3. Test with the test email script
4. Review Gmail security settings
5. Check email service documentation

## 🎉 Success!

Once configured, you'll automatically receive:
- Customer order confirmations
- Owner order notifications
- Professional branded emails
- Detailed order information

Happy emailing! 📧✨
