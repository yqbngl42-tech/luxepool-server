# 🚀 LuxePool Projects - Server

שרת Node.js + Express לטיפול בהודעות SMS ו-WhatsApp דרך Twilio - **צד שרת**

## 📦 טכנולוגיות

- **Node.js** - סביבת ריצה
- **Express** - שרת HTTP
- **Twilio** - שליחת SMS ו-WhatsApp
- **Helmet** - אבטחת HTTP headers
- **express-rate-limit** - מניעת spam
- **express-validator** - ולידציה של נתונים

## 🔒 תכונות אבטחה

- ✅ Helmet - הגנה על headers
- ✅ Rate Limiting - 6 בקשות לדקה
- ✅ CORS מוגדר
- ✅ Validation מלאה
- ✅ Error handling מקצועי

## 🚀 התקנה והרצה

### 1. התקן תלויות
```bash
npm install
```

### 2. הגדר משתני סביבה
```bash
cp .env.example .env
```

ערוך את `.env` והזן את הפרטים שלך:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15673235958

# WhatsApp Configuration
WHATSAPP_FROM=whatsapp:+14155238886

# Business Contact Information
MY_PHONE_NUMBER=+972548775052
PARTNER_WHATSAPP=whatsapp:+972533356817

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### 3. הרץ את השרת
```bash
npm start
```

השרת ירוץ על: **http://localhost:5000**

### 4. מצב פיתוח (auto-restart)
```bash
npm run dev
```

## 📨 הודעות SMS/WhatsApp

### סוגי הודעות:

#### 1. SMS ללקוח
הודעה פורמלית עם מספר טלפון לשירות מיידי:
```
שלום רב,

תודה על פנייתך ל-LuxePool Projects.

פרטייך נקלטו במערכת בהצלחה.
נציג יצור איתך קשר תוך 24 שעות.

לשירות מיידי: 054-877-5052

בכבוד רב,
צוות LuxePool Projects
```

#### 2. SMS לבעל העסק
הודעה מסודרת עם כל הפרטים:
```
פנייה חדשה מהאתר - LuxePool Projects

שם מלא: [שם]
טלפון: [טלפון]
דוא"ל: [מייל]
סוג שירות: [שירות]

הודעה:
[ההודעה]

---
נא לטפל בפנייה תוך 24 שעות.
```

#### 3. WhatsApp לשותף
הודעה קצרה עם תאריך ושעה:
```
🔔 פנייה חדשה - LuxePool

👤 [שם]
📱 [טלפון]
🏊 [שירות]

📝 [הודעה]

⏰ [תאריך ושעה]
```

## 🔌 API Endpoints

### POST `/api/send`
שליחת הודעות SMS ו-WhatsApp

**Request Body:**
```json
{
  "name": "יוסי כהן",
  "phone": "0501234567",
  "email": "yossi@example.com",
  "service": "בריכות שחייה",
  "message": "רוצה לבנות בריכה"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "ההודעות נשלחו בהצלחה!",
  "data": {
    "customerSms": "SM...",
    "businessSms": "SM...",
    "partnerWhatsApp": "SM..."
  }
}
```

**Response Error (400/500):**
```json
{
  "success": false,
  "error": "שגיאה בשליחת ההודעות",
  "details": "..."
}
```

### GET `/api/health`
בדיקת health של השרת

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-11-05T17:00:00.000Z"
}
```

### GET `/api/ping`
בדיקת uptime

**Response:**
```json
{
  "success": true,
  "message": "Server is alive",
  "uptime": 3600
}
```

## 📞 הגדרת Twilio

### 1. צור חשבון Twilio
1. היכנס ל-[Twilio Console](https://www.twilio.com/console)
2. צור חשבון חדש (יש trial חינמי)

### 2. קבל פרטים
- **Account SID** - מזהה החשבון
- **Auth Token** - טוקן אימות
- **Phone Number** - מספר טלפון שקנית

### 3. WhatsApp Sandbox
1. עבור ל-[WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. שלח את ההודעה המוצגת למספר ה-Sandbox
3. אשר את מספר השותף

### 4. הזן ב-.env
```env
TWILIO_ACCOUNT_SID=AC123...
TWILIO_AUTH_TOKEN=abc123...
TWILIO_PHONE_NUMBER=+15673235958
WHATSAPP_FROM=whatsapp:+14155238886
```

## 🔧 Validation Rules

### שדות חובה:
- ✅ `name` - לפחות 2 תווים
- ✅ `phone` - פורמט ישראלי תקין

### שדות אופציונליים:
- `email` - אם מוזן, חייב להיות תקין
- `service` - סוג השירות
- `message` - הודעה חופשית

### פורמטים נתמכים לטלפון:
- `050-1234567`
- `0501234567`
- `+972501234567`

## ⚠️ טיפול בשגיאות

השרת מטפל בשגיאות Twilio נפוצות:

| קוד | משמעות | הודעה למשתמש |
|-----|--------|---------------|
| 21211 | מספר לא תקין | "מספר הטלפון אינו תקין" |
| 21614 | לא יכול לקבל SMS | "מספר הטלפון אינו יכול לקבל SMS" |
| 20003 | בעיית חיבור | "שגיאה בחיבור לשירות SMS" |

## 🌐 פריסה

### Render
1. התחבר ל-[Render.com](https://render.com)
2. New → Web Service
3. Connect Repository
4. הגדרות:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. הוסף משתני סביבה מ-`.env`

### Railway
```bash
railway up
```

**⚠️ חשוב:**
- העתק את כל משתני ה-`.env`
- עדכן את `CLIENT_URL` לכתובת הצד לקוח
- שנה `NODE_ENV` ל-`production`

## 🔍 בדיקות

### בדיקה מקומית:
```bash
# Terminal 1 - Server
npm start

# Terminal 2 - Test
curl http://localhost:5000/api/health
```

### בדיקה עם Postman:
```bash
POST http://localhost:5000/api/send
Content-Type: application/json

{
  "name": "יוסי כהן",
  "phone": "0501234567",
  "email": "yossi@example.com",
  "service": "בריכות שחייה",
  "message": "רוצה לבנות בריכה"
}
```

## 🛡️ Rate Limiting

- **מגבלה:** 6 בקשות לדקה ל-`/api/send`
- **מטרה:** מניעת spam ו-abuse
- **הודעה:** "יותר מדי בקשות. אנא נסה שוב בעוד דקה."

## 📝 Logs

השרת מדפיס logs שימושיים:
```
🚀 Server is running on port 5000
📧 Twilio configured: +15673235958
📱 Business phone: +972548775052
💬 Partner WhatsApp: whatsapp:+972533356817
```

כל בקשה מדפיסה:
```
📨 Sending messages...
👤 Customer: +972501234567
💼 Business: +972548775052
💬 Partner WhatsApp: whatsapp:+972533356817
✅ SMS to customer sent: SM...
✅ SMS to business sent: SM...
✅ WhatsApp to partner sent: SM...
```

## 🐛 בעיות נפוצות

### שגיאת CORS
**פתרון:** ודא ש-`CLIENT_URL=http://localhost:5173` ב-.env

### שגיאת Twilio 20003
**פתרון:** בדוק את ACCOUNT_SID ו-AUTH_TOKEN

### WhatsApp לא נשלח
**פתרון:** 
1. אשר במספר ב-WhatsApp Sandbox
2. ודא `WHATSAPP_FROM=whatsapp:+14155238886`

### Port 5000 תפוס
**פתרון:**
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📁 מבנה הפרויקט

```
luxepool-server/
├── server.js           ← הקוד הראשי
├── package.json        ← תלויות
├── .env.example        ← דוגמה למשתני סביבה
├── .gitignore         ← קבצים להתעלמות
└── README.md          ← זה!
```

## 🔐 אבטחה

**⚠️ חשוב מאוד:**
- **אל תשתף את `.env`** עם אף אחד
- **אל תעלה `.env` ל-Git** (כבר ב-.gitignore)
- **השתמש ב-secrets** בפריסה לפרודקשן
- **שמור את Twilio credentials** במקום בטוח

## 📞 תמיכה

יש בעיה? בדוק:
1. ✅ כל משתני ה-`.env` מוגדרים
2. ✅ Twilio credentials תקינים
3. ✅ השרת רץ על Port 5000
4. ✅ CORS מוגדר נכון

---

**© 2025 LuxePool Projects • בס״ד**
