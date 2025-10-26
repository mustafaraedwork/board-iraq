# 🚀 دليل إعداد Vercel

## ❌ المشكلة الحالية
Build فاشل بسبب متغيرات البيئة المفقودة.

```
Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable
```

---

## ✅ الحل: إضافة متغيرات البيئة

### الخطوات:

1. **افتح إعدادات المشروع في Vercel:**
   - اذهب إلى: https://vercel.com/dashboard
   - اختر مشروع `board-iraq`
   - اضغط على `Settings`

2. **أضف متغيرات البيئة:**
   - اذهب إلى: `Settings` → `Environment Variables`
   - أضف المتغيرات التالية:

---

## 📋 المتغيرات المطلوبة

### 1️⃣ Supabase (إجباري)

```env
NEXT_PUBLIC_SUPABASE_URL=https://icqvknhbhnsllnkpajmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**أين أجدها؟**
- اذهب إلى: https://supabase.com/dashboard/project/YOUR_PROJECT
- `Settings` → `API`
- انسخ:
  - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
  - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

### 2️⃣ إعدادات الموقع (إجباري)

```env
NEXT_PUBLIC_SITE_URL=https://board-iraq.vercel.app
NEXT_PUBLIC_SHOP_URL=https://board-iraq.vercel.app/order
NEXT_PUBLIC_CONTACT_EMAIL=info@boardiraq.com
NEXT_PUBLIC_CONTACT_PHONE=+9647845663136
NEXT_PUBLIC_CARD_PRICE=15000
```

**ملاحظة:** استبدل `board-iraq.vercel.app` بالدومين الخاص بك.

---

### 3️⃣ NextAuth (إجباري)

```env
NEXTAUTH_SECRET=generate-random-secret-here
NEXTAUTH_URL=https://board-iraq.vercel.app
```

**كيف أولد NEXTAUTH_SECRET؟**
- في Terminal:
  ```bash
  openssl rand -base64 32
  ```
- أو استخدم: https://generate-secret.vercel.app/32

---

### 4️⃣ Facebook Pixel (اختياري - للتسويق)

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=724361316370707
NEXT_PUBLIC_FB_PIXEL_ENABLED=true
```

---

## 🎯 خطوات الإضافة في Vercel

### طريقة سريعة (نسخ ولصق):

1. افتح: `Settings` → `Environment Variables`
2. اضغط `Add New`
3. أضف كل متغير على حدة:
   - **Key:** اسم المتغير (مثل: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** القيمة
   - **Environment:** اختر `Production`, `Preview`, و `Development`
4. اضغط `Save`

---

## 📸 صورة توضيحية

```
┌─────────────────────────────────────────┐
│ Environment Variables                    │
├─────────────────────────────────────────┤
│ Key: NEXT_PUBLIC_SUPABASE_URL           │
│ Value: https://icqvknhbhnsllnkpajmo... │
│ ✓ Production  ✓ Preview  ✓ Development │
│                                    [Add]│
└─────────────────────────────────────────┘
```

---

## ✅ بعد إضافة المتغيرات

1. **Redeploy تلقائي:**
   - Vercel سيقوم بإعادة البناء تلقائياً
   - انتظر 2-3 دقائق

2. **تأكد من النجاح:**
   - يجب أن ترى ✅ بدلاً من ❌
   - افتح الموقع وتأكد من عمل كل شيء

---

## 🐛 استكشاف الأخطاء

### Build لا زال فاشلاً؟

1. **تأكد من إضافة جميع المتغيرات المطلوبة**
2. **تأكد من اختيار جميع البيئات** (Production, Preview, Development)
3. **تأكد من عدم وجود مسافات زائدة** في القيم
4. **جرب Redeploy يدوياً:**
   - `Deployments` → اختر آخر deployment → `Redeploy`

---

## 📝 ملاحظات مهمة

- ⚠️ **لا تشارك `SUPABASE_SERVICE_ROLE_KEY`** - هذا مفتاح خطير!
- ✅ يمكنك إضافة قيم مختلفة للـ `Production` و `Preview`
- 🔄 بعد إضافة أي متغير جديد، سيتم إعادة البناء تلقائياً

---

## 🎉 النتيجة المتوقعة

بعد إضافة جميع المتغيرات، يجب أن ترى:

```
✓ Build successful
✓ Deployment Ready
```

والموقع سيعمل على: `https://board-iraq.vercel.app` 🚀

---

## 💡 نصيحة

يمكنك نسخ ملف `.env.local` (إذا كان موجوداً) وإضافة محتوياته مباشرة في Vercel.
