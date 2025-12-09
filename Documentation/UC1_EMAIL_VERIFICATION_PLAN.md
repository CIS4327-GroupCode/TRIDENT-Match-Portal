# UC1 Email Verification Implementation Plan

**Document Created:** December 1, 2025  
**Project:** TRIDENT Match Portal  
**Purpose:** Complete UC1 by adding email verification functionality

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Email Verification Requirements](#email-verification-requirements)
3. [Email Service Providers Comparison](#email-service-providers-comparison)
4. [Recommended Solution](#recommended-solution)
5. [Implementation Plan](#implementation-plan)
6. [Code Examples](#code-examples)
7. [Security Considerations](#security-considerations)
8. [Testing Strategy](#testing-strategy)

---

## Current State Analysis

### What's Complete ✅

**Authentication Core**
- ✅ User registration (POST /auth/register)
- ✅ User login (POST /auth/login)
- ✅ JWT token generation (7-day expiration)
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Role-based registration (researcher, nonprofit, admin)
- ✅ Profile creation during registration
- ✅ Account status system (active, pending, suspended)
- ✅ Email normalization (lowercase, trimmed)
- ✅ Duplicate email prevention

**Current Registration Flow**
```
User fills form → POST /auth/register → User created with account_status='active' → JWT token returned → User immediately logged in ✅
```

### What's Missing ❌

**Email Verification**
- ❌ Email verification tokens
- ❌ Email sending service
- ❌ Verification email templates
- ❌ Verify email endpoint (GET /auth/verify-email/:token)
- ❌ Resend verification email endpoint
- ❌ Frontend verification success/error pages
- ❌ Block login for unverified accounts
- ❌ Email verification expiration (24-48 hours)

**Security Gap**
```
Current: Anyone can register with any email (even fake ones) and immediately access the platform
Risk: Spam accounts, fake registrations, no way to recover account if typo in email
```

---

## Email Verification Requirements

### User Flow (Desired)

```
1. User submits registration form
   ↓
2. Backend creates user with account_status='pending'
   ↓
3. Backend generates verification token (JWT or random UUID)
   ↓
4. Backend sends verification email with link
   ↓
5. User receives email: "Click here to verify your email"
   ↓
6. User clicks link → GET /auth/verify-email/:token
   ↓
7. Backend validates token:
   - Token exists ✓
   - Token not expired ✓
   - Token matches user ✓
   ↓
8. Backend updates user: account_status='active', email_verified=true, email_verified_at=NOW()
   ↓
9. User redirected to login page with success message
   ↓
10. User logs in successfully
```

### Database Schema Changes

**User Table - Add Fields**
```sql
ALTER TABLE _user ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE _user ADD COLUMN email_verified_at TIMESTAMP NULL;
ALTER TABLE _user ADD COLUMN verification_token VARCHAR(255) NULL;
ALTER TABLE _user ADD COLUMN verification_token_expires TIMESTAMP NULL;
```

**Alternative: Separate Verification Tokens Table**
```sql
CREATE TABLE email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES _user(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Modified Login Flow

**Current (Insecure)**
```javascript
POST /auth/login → Check password → Return token ✅
```

**New (Secure)**
```javascript
POST /auth/login
  → Check password ✓
  → Check email_verified ✓
  → If not verified: Return 403 "Please verify your email first"
  → If verified: Return token ✅
```

---

## Email Service Providers Comparison

### 1. **Nodemailer + Gmail SMTP** (Quick Start)

**Pros:**
- ✅ Free for small volume (<100 emails/day)
- ✅ Quick setup (5 minutes)
- ✅ No API keys needed (use app password)
- ✅ Good for development/MVP
- ✅ Reliable delivery via Gmail infrastructure

**Cons:**
- ❌ Daily sending limits (100/day for free Gmail)
- ❌ Less professional (emails from gmail.com)
- ❌ Not scalable for production
- ❌ Gmail may flag as spam if volume increases
- ❌ Requires 2FA + App Password setup

**Cost:** FREE (Gmail account)

**Setup Complexity:** ⭐⭐☆☆☆ (Easy)

**Use Case:** Development, early MVP, <50 users/day

**Code Example:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trident.portal@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD  // App-specific password
  }
});

await transporter.sendMail({
  from: '"TRIDENT Portal" <trident.portal@gmail.com>',
  to: user.email,
  subject: 'Verify Your Email',
  html: `<p>Click <a href="${verificationLink}">here</a> to verify</p>`
});
```

---

### 2. **SendGrid** (Recommended for Production)

**Pros:**
- ✅ **FREE tier: 100 emails/day forever**
- ✅ Professional email delivery
- ✅ Excellent deliverability rates (99%+)
- ✅ Email templates with drag-and-drop editor
- ✅ Analytics dashboard (open rates, click rates)
- ✅ Official Node.js SDK
- ✅ Domain verification for custom sender
- ✅ Easy to scale (paid plans if needed)
- ✅ Webhook support for tracking
- ✅ Comprehensive documentation

**Cons:**
- ❌ Requires API key management
- ❌ Need to verify domain for best deliverability
- ❌ Slight learning curve (but well-documented)

**Cost:** 
- FREE: 100 emails/day (3,000/month)
- Essentials: $19.95/month (50,000/month)
- Pro: $89.95/month (150,000/month)

**Setup Complexity:** ⭐⭐⭐☆☆ (Moderate)

**Use Case:** Production-ready, scalable, professional

**Code Example:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: 'noreply@trident-portal.com',  // Verified sender
  subject: 'Verify Your Email - TRIDENT Portal',
  templateId: 'd-1234567890abcdef',  // SendGrid template
  dynamicTemplateData: {
    name: user.name,
    verificationLink: verificationLink,
    expiresIn: '48 hours'
  }
});
```

---

### 3. **Mailgun**

**Pros:**
- ✅ FREE tier: 5,000 emails/month (first 3 months)
- ✅ Great API and documentation
- ✅ Email validation API (check if email exists)
- ✅ Email tracking and analytics
- ✅ Webhooks for events
- ✅ Template engine

**Cons:**
- ❌ Free tier limited to 3 months trial
- ❌ After trial: Starts at $35/month
- ❌ Domain verification required
- ❌ More expensive than SendGrid

**Cost:**
- Trial: 5,000 emails/month (3 months)
- Foundation: $35/month (50,000 emails)
- Growth: $80/month (100,000 emails)

**Setup Complexity:** ⭐⭐⭐☆☆ (Moderate)

**Use Case:** If you need email validation API, enterprise features

**Code Example:**
```javascript
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

await mg.messages.create('mg.trident-portal.com', {
  from: 'TRIDENT Portal <noreply@mg.trident-portal.com>',
  to: [user.email],
  subject: 'Verify Your Email',
  template: 'email-verification',
  'h:X-Mailgun-Variables': JSON.stringify({
    name: user.name,
    verificationLink: verificationLink
  })
});
```

---

### 4. **AWS SES (Simple Email Service)**

**Pros:**
- ✅ Extremely cheap ($0.10 per 1,000 emails)
- ✅ Unlimited scalability
- ✅ High reliability (AWS infrastructure)
- ✅ Integrates with other AWS services
- ✅ No free tier limits (just pay per use)

**Cons:**
- ❌ Starts in "Sandbox" mode (only send to verified emails)
- ❌ Must request production access (can take 24-48 hours)
- ❌ More complex setup (AWS console)
- ❌ No built-in templates (need to build your own)
- ❌ Requires AWS account
- ❌ Steeper learning curve

**Cost:**
- $0.10 per 1,000 emails (cheapest)
- First 62,000 emails/month FREE (if using EC2)

**Setup Complexity:** ⭐⭐⭐⭐☆ (Complex)

**Use Case:** Large-scale production, already using AWS infrastructure

**Code Example:**
```javascript
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const command = new SendEmailCommand({
  Source: 'noreply@trident-portal.com',
  Destination: { ToAddresses: [user.email] },
  Message: {
    Subject: { Data: 'Verify Your Email' },
    Body: {
      Html: { Data: `<p>Click <a href="${verificationLink}">here</a></p>` }
    }
  }
});

await sesClient.send(command);
```

---

### 5. **Resend** (Modern Alternative)

**Pros:**
- ✅ FREE tier: 3,000 emails/month
- ✅ Modern, developer-friendly API
- ✅ React Email integration (write emails as React components)
- ✅ Beautiful default templates
- ✅ Simple setup (5 minutes)
- ✅ Great documentation
- ✅ No domain verification required for testing

**Cons:**
- ❌ Newer service (less proven track record)
- ❌ Smaller community than SendGrid
- ❌ Fewer advanced features

**Cost:**
- FREE: 3,000 emails/month
- Pro: $20/month (50,000 emails)

**Setup Complexity:** ⭐⭐☆☆☆ (Easy)

**Use Case:** Modern stack, React developers, quick setup

**Code Example:**
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'TRIDENT Portal <noreply@trident-portal.com>',
  to: user.email,
  subject: 'Verify Your Email',
  react: EmailVerificationTemplate({
    name: user.name,
    verificationLink: verificationLink
  })
});
```

---

### 6. **Postmark**

**Pros:**
- ✅ FREE tier: 100 emails/month
- ✅ Excellent deliverability (98%+)
- ✅ Fast email delivery (<30 seconds)
- ✅ Beautiful templates
- ✅ Detailed analytics
- ✅ Great for transactional emails

**Cons:**
- ❌ Free tier very limited (100/month)
- ❌ More expensive than competitors ($15/month for 10,000 emails)
- ❌ Not ideal for newsletters/bulk sending

**Cost:**
- FREE: 100 emails/month
- $15/month: 10,000 emails
- $50/month: 50,000 emails

**Setup Complexity:** ⭐⭐⭐☆☆ (Moderate)

**Use Case:** High-priority transactional emails, need guaranteed delivery

---

## Recommended Solution

### **For Development/MVP: Nodemailer + Gmail**
- Get started in 5 minutes
- Free
- Perfect for testing
- Easy to switch later

### **For Production: SendGrid**
**Why SendGrid?**
1. ✅ **Best balance** of features, cost, and ease of use
2. ✅ **Free tier is generous** (100 emails/day = 3,000/month)
3. ✅ **Professional deliverability** (99%+ inbox rate)
4. ✅ **Excellent documentation** and Node.js SDK
5. ✅ **Template editor** for beautiful emails without HTML coding
6. ✅ **Analytics dashboard** to track email performance
7. ✅ **Scalable** - Easy to upgrade if needed
8. ✅ **Industry standard** - Used by Netflix, Uber, Spotify

**Decision Matrix:**

| Feature | Gmail SMTP | SendGrid | Mailgun | AWS SES | Resend | Postmark |
|---------|------------|----------|---------|---------|--------|----------|
| Free Tier | 100/day | 100/day | 5k/3mo | Pay/use | 3k/mo | 100/mo |
| Setup Time | 5 min | 15 min | 20 min | 45 min | 10 min | 15 min |
| Templates | No | Yes ✅ | Yes | No | Yes | Yes |
| Analytics | No | Yes ✅ | Yes | No | Basic | Yes |
| Deliverability | Good | Excellent ✅ | Excellent | Excellent | Good | Excellent |
| Scalability | Low | High ✅ | High | Very High | Medium | Medium |
| Cost (50k/mo) | N/A | $20 | $35 | $5 | $20 | $50 |
| **SCORE** | 6/10 | **9.5/10** ✅ | 8/10 | 7/10 | 8/10 | 7/10 |

**Winner: SendGrid** 🏆

---

## Implementation Plan

### Phase 1: Database Schema (30 minutes)

**Create Migration**
```bash
cd backend
npx sequelize-cli migration:generate --name add-email-verification-to-user
```

**Migration File:**
```javascript
// backend/src/database/migrations/XXXXXX-add-email-verification-to-user.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('_user', 'email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('_user', 'email_verified_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('_user', 'verification_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('_user', 'verification_token_expires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('_user', 'email_verified');
    await queryInterface.removeColumn('_user', 'email_verified_at');
    await queryInterface.removeColumn('_user', 'verification_token');
    await queryInterface.removeColumn('_user', 'verification_token_expires');
  }
};
```

**Update User Model:**
```javascript
// backend/src/database/models/User.js
// Add to User.init():

email_verified: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
},
email_verified_at: {
  type: DataTypes.DATE,
  allowNull: true
},
verification_token: {
  type: DataTypes.STRING(255),
  allowNull: true,
  unique: true
},
verification_token_expires: {
  type: DataTypes.DATE,
  allowNull: true
}
```

---

### Phase 2: Email Service Setup (1 hour)

#### Option A: Gmail (Development)

**Install:**
```bash
npm install nodemailer
```

**Create Service:**
```javascript
// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: `"TRIDENT Portal" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your Email - TRIDENT Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background: #007bff; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TRIDENT Portal</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}!</h2>
              <p>Thank you for registering with TRIDENT Portal. Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
              <p><strong>This link will expire in 48 hours.</strong></p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 TRIDENT Portal. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(user, token) {
    // Future: password reset emails
  }

  async sendWelcomeEmail(user) {
    // Future: welcome email after verification
  }
}

module.exports = new EmailService();
```

**Environment Variables:**
```bash
# .env
GMAIL_USER=trident.portal@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:5173
```

---

#### Option B: SendGrid (Production)

**Install:**
```bash
npm install @sendgrid/mail
```

**Create Service:**
```javascript
// backend/src/services/emailService.js
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const msg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'TRIDENT Portal'
      },
      subject: 'Verify Your Email - TRIDENT Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background: #007bff; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TRIDENT Portal</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}!</h2>
              <p>Thank you for registering with TRIDENT Portal. Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
              <p><strong>This link will expire in 48 hours.</strong></p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 TRIDENT Portal. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Verification email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ SendGrid error:', error.response?.body || error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(user, token) {
    // Future implementation
  }

  async sendWelcomeEmail(user) {
    // Future implementation
  }
}

module.exports = new EmailService();
```

**Environment Variables:**
```bash
# .env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@trident-portal.com
FRONTEND_URL=http://localhost:5173
```

---

### Phase 3: Update Auth Controller (1 hour)

```javascript
// backend/src/controllers/authController.js
const authModels = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../services/emailService");

// Generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Register controller (UPDATED)
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      mfa_enabled,
      organizationData,
      researcherData 
    } = req.body || {};
    
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "name, email and password are required" });

    // Validate role
    const validRoles = ['researcher', 'nonprofit', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: "invalid role. Must be one of: researcher, nonprofit, admin" 
      });
    }

    // Validate nonprofit-specific requirements
    if (role === 'nonprofit' && !organizationData) {
      return res.status(400).json({ 
        error: "organizationData is required for nonprofit role",
        required: ["name"]
      });
    }

    // Validate researcher-specific requirements
    if (role === 'researcher' && researcherData) {
      if (researcherData.rate_min && researcherData.rate_max) {
        if (researcherData.rate_min > researcherData.rate_max) {
          return res.status(400).json({ 
            error: "rate_min must be less than rate_max" 
          });
        }
      }
    }

    const normEmail = String(email).trim().toLowerCase();

    // Check existing
    const exists = await authModels.findUserByEmail(normEmail);
    if (exists)
      return res.status(409).json({ error: "email already in use" });

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 48); // 48 hours expiry

    // Create user with pending status
    const user = await authModels.createUser(
      name, 
      normEmail, 
      password_hash, 
      role, 
      mfa_enabled,
      organizationData,
      researcherData,
      {
        account_status: 'pending',  // Changed from 'active'
        email_verified: false,
        verification_token: verificationToken,
        verification_token_expires: tokenExpires
      }
    );

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed, but user created:', emailError);
      // Don't fail registration if email fails
    }

    // Return user but WITHOUT token (user can't login until verified)
    return res.status(201).json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        email_verified: false
      },
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ error: "internal error" });
  }
};

// Verify Email Endpoint (NEW)
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Find user by token
    const user = await authModels.findUserByVerificationToken(token);

    if (!user) {
      return res.status(404).json({ 
        error: 'Invalid verification token',
        message: 'This verification link is invalid or has already been used.'
      });
    }

    // Check if token expired
    if (new Date() > new Date(user.verification_token_expires)) {
      return res.status(400).json({ 
        error: 'Verification token expired',
        message: 'This verification link has expired. Please request a new one.'
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(200).json({ 
        message: 'Email already verified. You can log in now.',
        alreadyVerified: true
      });
    }

    // Update user
    await authModels.verifyUserEmail(user.id);

    return res.status(200).json({ 
      message: 'Email verified successfully! You can now log in.',
      verified: true
    });
  } catch (err) {
    console.error('verify email error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

// Resend Verification Email (NEW)
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normEmail = String(email).trim().toLowerCase();
    const user = await authModels.getUserByEmail(normEmail);

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({ 
        message: 'If the email exists, a verification link has been sent.'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({ 
        error: 'Email already verified',
        message: 'This email is already verified. You can log in.'
      });
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 48);

    await authModels.updateVerificationToken(user.id, verificationToken, tokenExpires);

    // Send email
    await emailService.sendVerificationEmail(user, verificationToken);

    return res.status(200).json({ 
      message: 'Verification email sent! Please check your inbox.'
    });
  } catch (err) {
    console.error('resend verification error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

// Login controller (UPDATED - check email verification)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const normEmail = String(email).trim().toLowerCase();
    const found = await authModels.getUserByEmail(normEmail);
    
    if (!found)
      return res.status(401).json({ error: "invalid email" });
    
    // Check if email is verified
    if (!found.email_verified) {
      return res.status(403).json({ 
        error: "Email not verified",
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
        email_verified: false
      });
    }

    // Check password
    const ok = await bcrypt.compare(password, found.password_hash || "");
    if (!ok)
      return res.status(401).json({ error: "invalid password" });

    // Build safe user object
    const user = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      email_verified: found.email_verified,
      created_at: found.created_at,
    };

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    return res.json({ user, token });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ error: "internal error" });
  }
};
```

---

### Phase 4: Update Auth Model (30 minutes)

```javascript
// backend/src/models/authModel.js

// Add new functions

async function findUserByVerificationToken(token) {
  const { User } = require('../database/models');
  return await User.findOne({ 
    where: { verification_token: token }
  });
}

async function verifyUserEmail(userId) {
  const { User } = require('../database/models');
  return await User.update(
    {
      email_verified: true,
      email_verified_at: new Date(),
      verification_token: null,
      verification_token_expires: null,
      account_status: 'active'
    },
    { where: { id: userId } }
  );
}

async function updateVerificationToken(userId, token, expires) {
  const { User } = require('../database/models');
  return await User.update(
    {
      verification_token: token,
      verification_token_expires: expires
    },
    { where: { id: userId } }
  );
}

module.exports = {
  // ... existing exports
  findUserByVerificationToken,
  verifyUserEmail,
  updateVerificationToken
};
```

---

### Phase 5: Update Routes (15 minutes)

```javascript
// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW ROUTES
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

module.exports = router;
```

---

### Phase 6: Frontend Implementation (2 hours)

**Email Verification Page:**
```jsx
// frontend/src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    }

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center p-5">
              {status === 'verifying' && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h3>Verifying your email...</h3>
                </>
              )}

              {status === 'success' && (
                <>
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                  <h3 className="mt-3">Email Verified!</h3>
                  <p className="text-muted">{message}</p>
                  <p>Redirecting to login...</p>
                </>
              )}

              {status === 'error' && (
                <>
                  <i className="bi bi-x-circle text-danger" style={{ fontSize: '4rem' }}></i>
                  <h3 className="mt-3">Verification Failed</h3>
                  <p className="text-danger">{message}</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Update App.jsx:**
```jsx
import VerifyEmail from './pages/VerifyEmail';

// Add route:
<Route path="/verify-email/:token" element={<VerifyEmail />} />
```

**Update SignupModal.jsx:**
```jsx
// After successful registration:
if (response.ok) {
  setSuccess('Registration successful! Please check your email to verify your account.');
  // Don't auto-login anymore
  setTimeout(() => {
    onClose();
    // Optionally show message to check email
  }, 3000);
}

// Handle login attempt without verification
if (response.status === 403) {
  const data = await response.json();
  setError(data.message || 'Please verify your email first');
}
```

---

## Security Considerations

### 1. Token Security
- Use crypto.randomBytes() for unpredictable tokens
- 48-hour expiration
- One-time use (clear after verification)
- Store as plain text (not hashed) in database

### 2. Rate Limiting
```javascript
// Add to authRoutes.js
const rateLimit = require('express-rate-limit');

const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many verification requests. Please try again later.'
});

router.post('/resend-verification', verificationLimiter, authController.resendVerification);
```

### 3. Email Enumeration Protection
- Don't reveal if email exists in resend endpoint
- Same response for existing/non-existing emails

### 4. HTTPS Only
- Always use HTTPS in production
- Verification links contain sensitive tokens

---

## Testing Strategy

### Manual Testing Checklist

```
✅ Register new user → Check email received
✅ Click verification link → User verified
✅ Try to login before verification → Blocked with message
✅ Login after verification → Success
✅ Click expired verification link → Error message
✅ Click already-used verification link → Already verified message
✅ Request resend verification → New email received
✅ Try invalid token → Error message
```

### Automated Tests

```javascript
// tests/integration/email-verification.test.js
describe('Email Verification', () => {
  test('should create user with pending status', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email_verified).toBe(false);
    expect(response.body.token).toBeUndefined(); // No token yet

    const user = await User.findByPk(response.body.user.id);
    expect(user.account_status).toBe('pending');
    expect(user.verification_token).not.toBeNull();
  });

  test('should verify email with valid token', async () => {
    // Create user
    const user = await createTestUser({ email_verified: false });

    // Verify
    const response = await request(app)
      .get(`/auth/verify-email/${user.verification_token}`);

    expect(response.status).toBe(200);
    expect(response.body.verified).toBe(true);

    // Check database
    const verified = await User.findByPk(user.id);
    expect(verified.email_verified).toBe(true);
    expect(verified.account_status).toBe('active');
  });

  test('should block login for unverified email', async () => {
    const user = await createTestUser({ 
      email_verified: false,
      account_status: 'pending'
    });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'Test123!'
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('Email not verified');
  });
});
```

---

## Timeline & Effort Estimate

| Phase | Task | Time | Difficulty |
|-------|------|------|------------|
| 1 | Database migration | 30 min | ⭐☆☆ Easy |
| 2 | Email service setup | 1 hour | ⭐⭐☆ Medium |
| 3 | Update auth controller | 1 hour | ⭐⭐☆ Medium |
| 4 | Update auth model | 30 min | ⭐☆☆ Easy |
| 5 | Update routes | 15 min | ⭐☆☆ Easy |
| 6 | Frontend pages | 2 hours | ⭐⭐☆ Medium |
| 7 | Testing | 1 hour | ⭐⭐☆ Medium |
| 8 | Documentation | 30 min | ⭐☆☆ Easy |
| **TOTAL** | | **6.75 hours** | |

**Recommendation:** Start with Gmail for development (1 hour setup), switch to SendGrid before production (add 1 hour for migration).

---

## Summary

### Immediate Actions

1. **Choose Email Service:**
   - Development: Gmail SMTP (free, 5 min setup)
   - Production: SendGrid (free tier, 15 min setup)

2. **Run Migration:**
   ```bash
   cd backend
   npm run db:migrate
   ```

3. **Install Dependencies:**
   ```bash
   # For Gmail:
   npm install nodemailer

   # For SendGrid:
   npm install @sendgrid/mail
   ```

4. **Add Environment Variables:**
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   # OR
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

5. **Implement Code:**
   - Email service
   - Updated auth controller
   - New routes
   - Frontend verification page

6. **Test Flow:**
   - Register → Check email → Click link → Login

### Long-term Considerations

- **Analytics:** Track verification rates (SendGrid dashboard)
- **Reminders:** Send reminder email after 24 hours if not verified
- **Cleanup:** Delete unverified accounts after 7 days
- **Branding:** Custom email templates with logo
- **Monitoring:** Alert if email sending fails

---

**Status:** Ready for implementation  
**Recommended Service:** SendGrid (Production) or Gmail (Development)  
**Estimated Completion:** 1-2 days  
**Priority:** HIGH (Security requirement)
