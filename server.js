import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ מאפשר ל־Express לזהות IP אמיתי מאחורי פרוקסי (כמו Render)
app.set('trust proxy', 1);

// Security Middleware - Helmet
app.use(helmet());

// CORS - מאפשר גם ל-Netlify וגם ל-localhost
const allowedOrigins = [
  'http://localhost:5173',
  'https://deluxepools.netlify.app',
  'https://deluxepools.pro',
  'https://www.deluxepools.pro'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting - Prevent spam
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: {
    success: false,
    error: 'יותר מדי בקשות. אנא נסה שוב בעוד דקה.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/send', limiter);

// Twilio Configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🔍 בדיקת טעינת משתני סביבה
console.log("🔐 SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("🔐 TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");

// Helper function to format phone number
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '972' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  } else {
    cleaned = '+' + cleaned.replace(/^\+/, '');
  }
  return cleaned;
};

// API Route - Send Messages with Validation and Logs
app.post('/api/send',
  [
    body('name').notEmpty().trim().withMessage('שם הוא שדה חובה'),
    body('phone').matches(/^(\+972|0)[0-9]{8,9}$/).withMessage('מספר טלפון לא תקין'),
    body('email').optional().isEmail().withMessage('כתובת אימייל לא תקינה'),
    body('message').optional().trim(),
    body('service').optional().trim()
  ],
  async (req, res) => {
    console.log("📨 בקשה חדשה ל־/api/send התקבלה");
    console.log("📦 תוכן הבקשה:", req.body);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.warn("⚠️ שגיאות ולידציה:", errors.array());
        return res.status(400).json({
          success: false,
          error: 'נתונים לא תקינים',
          details: errors.array()
        });
      }

      const { name, phone, email, service, message } = req.body;

      const customerPhone = formatPhoneNumber(phone);
      const businessPhone = formatPhoneNumber(process.env.MY_PHONE_NUMBER);
      const partnerWhatsApp = process.env.PARTNER_WHATSAPP;

      console.log("📞 טלפון לקוח (מעובד):", customerPhone);
      console.log("🏢 טלפון עסק (מעובד):", businessPhone);
      console.log("💬 WhatsApp שותף:", partnerWhatsApp);

      const customerMessage = `שלום רב,

תודה על פנייתך ל-LuxePool Projects.

פרטייך נקלטו במערכת בהצלחה.
נציג יצור איתך קשר תוך 24 שעות.

לשירות מיידי: 054-877-5052

בכבוד רב,
צוות LuxePool Projects`;

      const businessMessage = `פנייה חדשה מהאתר - LuxePool Projects

שם מלא: ${name}
טלפון: ${phone}
דוא"ל: ${email || 'לא צוין'}
סוג שירות: ${service || 'לא צוין'}

הודעה:
${message || 'לא צוינה הודעה'}

---
נא לטפל בפנייה תוך 24 שעות.`;

      const whatsappMessage = `🔔 פנייה חדשה - LuxePool

👤 ${name}
📱 ${phone}
🏊 ${service || 'ללא שירות מוגדר'}

📝 ${message || 'ללא הודעה'}

⏰ ${new Date().toLocaleString('he-IL')}`;

      console.log("✉️ תוכן הודעת SMS ללקוח:", customerMessage);
      console.log("✉️ תוכן הודעת SMS לעסק:", businessMessage);
      console.log("✉️ תוכן הודעת WhatsApp לשותף:", whatsappMessage);

      // שליחת SMS ללקוח
      console.log("📤 שולח SMS ללקוח...");
      const smsToCustomer = await twilioClient.messages.create({
        body: customerMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customerPhone
      });
      console.log("✅ נשלח SMS ללקוח. SID:", smsToCustomer.sid);

      // שליחת SMS לעסק
      console.log("📤 שולח SMS לעסק...");
      const smsToBusiness = await twilioClient.messages.create({
        body: businessMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: businessPhone
      });
      console.log("✅ נשלח SMS לעסק. SID:", smsToBusiness.sid);

     // שליחת WhatsApp לשותף
console.log("📤 שולח WhatsApp לשותף...");
console.log("📨 תוכן הודעת WhatsApp בתבנית:", {
  '1': name,
  '2': phone,
  '3': email || 'לא צוין',
  '4': service || 'לא צוין',
  '5': message || 'לא צוינה הודעה'
});

const whatsappToPartner = await twilioClient.messages.create({
  from: process.env.WHATSAPP_FROM || 'whatsapp:+14788186590',
  to: partnerWhatsApp,
  contentSid: 'HXbdd1aad7d75c015ae7f71ca80ede3fec',
  contentVariables: JSON.stringify({
    '1': name,
    '2': phone,
    '3': email || 'לא צוין',
    '4': service || 'לא צוין',
    '5': message || 'לא צוינה הודעה'
  })
});

console.log("✅ נשלח WhatsApp לשותף. SID:", whatsappToPartner.sid);

      res.status(200).json({
        success: true,
        message: 'ההודעות נשלחו בהצלחה!',
        data: {
          customerSms: smsToCustomer.sid,
          businessSms: smsToBusiness.sid,
          partnerWhatsApp: whatsappToPartner.sid
        }
      });

    } catch (error) {
      console.error('❌ שגיאה בשליחה דרך Twilio:', error.message);
      console.error('🔢 קוד שגיאה:', error.code);
      console.error('🧵 Stack:', error.stack);

      let errorMessage = 'שגיאה בשליחת ההודעות';

      if (error.code === 21211) {
        errorMessage = 'מספר הטלפון אינו תקין. אנא בדוק ונסה שוב.';
      } else if (error.code === 21614) {
        errorMessage = 'מספר הטלפון אינו יכול לקבל SMS. אנא נסה מספר אחר.';
      } else if (error.code === 20003) {
        errorMessage = 'שגיאה באימות מול Twilio. בדוק את SID וה־Token שלך.';
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Ping endpoint for monitoring
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is alive',
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('🌊 LuxePool Server is running!');
});

// Start server and store in variable
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Twilio configured: ${process.env.TWILIO_PHONE_NUMBER}`);
  console.log(`📱 Business phone: ${process.env.MY_PHONE_NUMBER}`);
  console.log(`💬 Partner WhatsApp: ${process.env.PARTNER_WHATSAPP}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});