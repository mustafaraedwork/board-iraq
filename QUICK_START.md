# 🚀 Board Iraq - دليل التشغيل السريع

هذا الملف لتشغيل المشروع بسرعة في أي وقت أو على أي جهاز.

---

## ⚡ التشغيل السريع (5 دقائق)

### 1. استنساخ/تنزيل المشروع
```bash
# إذا كان على GitHub
git clone [URL]
cd board-iraq

# أو إذا كان ملف مضغوط، فك الضغط وادخل للمجلد
```

### 2. تثبيت التبعيات
```bash
npm install
# أو
yarn install
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://icqvknhbhnsllnkpajmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXZrbmhiaG5zbGxua3Bham1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDY2OTcsImV4cCI6MjA2NDgyMjY5N30.d0hsO7su0LrxFQQ_JkNy2q3mUxNSdI4dfejyO4gCznk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXZrbmhiaG5zbGxua3Bham1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI0NjY5NywiZXhwIjoyMDY0ODIyNjk3fQ.YXroA6A3VTqElt0a97Int91YTd-YU44_rxjKXi4Ahe4

# إعدادات الموقع
NEXT_PUBLIC_SITE_URL=https://boardiraq.com
NEXT_PUBLIC_SITE_NAME=Board Iraq

# معلومات التواصل
NEXT_PUBLIC_CONTACT_PHONE=+9647845663136
NEXT_PUBLIC_CONTACT_EMAIL=info@boardiraq.com
NEXT_PUBLIC_SHOP_URL=https://board.thewayl.com/

# سعر البطاقة
NEXT_PUBLIC_CARD_PRICE=15000

# إعدادات أخرى
NEXTAUTH_SECRET=random123secret456key789
NEXTAUTH_URL=http://localhost:3000
```

### 4. تشغيل المشروع
```bash
npm run dev
```

### 5. فتح المتصفح
اذهب إلى: **http://localhost:3000**

---

## 🧪 بيانات الاختبار

### المستخدم التجريبي:
- **اسم المستخدم**: `demo123`
- **كلمة المرور**: [محددة في قاعدة البيانات]
- **رابط الملف الشخصي**: `http://localhost:3000/demo123`

### روابط الاختبار المهمة:
```
الصفحة الرئيسية:     http://localhost:3000/
تسجيل الدخول:        http://localhost:3000/login
لوحة التحكم:         http://localhost:3000/dashboard
لوحة الإدارة:        http://localhost:3000/admin
اختبار قاعدة البيانات: http://localhost:3000/test-db
الملف التجريبي:      http://localhost:3000/demo123
```

---

## 📁 الملفات المهمة للمراجعة

### ملفات التطوير الأساسية:
```
📁 src/app/
  ├── 📄 page.tsx                    # الصفحة الرئيسية
  ├── 📄 layout.tsx                  # التخطيط العام
  ├── 📁 (auth)/login/page.tsx       # صفحة تسجيل الدخول
  ├── 📄 dashboard/page.tsx          # لوحة التحكم ⭐
  ├── 📄 admin/page.tsx              # لوحة الإدارة
  ├── 📄 test-db/page.tsx            # اختبار قاعدة البيانات
  └── 📄 [username]/page.tsx         # الملفات الشخصية العامة

📁 src/components/
  ├── 📁 ui/                         # مكونات واجهة المستخدم
  ├── 📁 dashboard/                  # مكونات لوحة التحكم
  │   ├── 📄 AddLinkForm.tsx         # إضافة روابط
  │   ├── 📄 EditProfileForm.tsx     # تعديل الملف الشخصي
  │   └── 📄 ImageEditor.tsx         # محرر الصور
  └── 📁 profile/
      └── 📄 PublicProfile.tsx       # صفحة العرض العامة ⭐

📁 src/lib/
  ├── 📁 supabase/
  │   ├── 📄 client.ts               # عميل Supabase
  │   └── 📄 server.ts               # خدمات الخادم ⭐
  ├── 📄 types.ts                    # تعريفات TypeScript
  └── 📄 utils.ts                    # دوال مساعدة
```

### ملفات الإعداد:
```
📄 .env.local                       # متغيرات البيئة ⚠️ مهم
📄 package.json                     # التبعيات
📄 next.config.ts                   # إعدادات Next.js
📄 tailwind.config.js               # إعدادات Tailwind
📄 tsconfig.json                    # إعدادات TypeScript
```

---

## 🔧 أوامر مفيدة

### تطوير:
```bash
npm run dev          # تشغيل وضع التطوير
npm run build        # بناء الإنتاج
npm run start        # تشغيل الإنتاج
npm run lint         # فحص الكود
```

### Git (إذا كان متاحاً):
```bash
git status           # حالة الملفات
git add .            # إضافة جميع التغييرات
git commit -m "msg"  # حفظ التغييرات
git log --oneline    # عرض التاريخ
```

---

## 🐛 حل المشاكل الشائعة

### 1. خطأ في تثبيت التبعيات:
```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

### 2. خطأ في الاتصال بـ Supabase:
- تأكد من ملف `.env.local`
- اذهب إلى `/test-db` للفحص
- تأكد من أن مفاتيح Supabase صحيحة

### 3. خطأ في TypeScript:
```bash
# تنظيف الكاش
rm -rf .next
npm run dev
```

### 4. مشكلة في المنفذ:
```bash
# إذا كان المنفذ 3000 مستخدم
npm run dev -- -p 3001
```

---

## 📊 فحص سريع للحالة

### ✅ علامات أن كل شيء يعمل:
- [ ] الصفحة الرئيسية تحمل بدون أخطاء
- [ ] صفحة `/test-db` تظهر "تم الاتصال بـ Supabase بنجاح"
- [ ] صفحة `/dashboard` تحمل ويمكن سحب الروابط
- [ ] صفحة `/demo123` تظهر الملف الشخصي التجريبي
- [ ] لا توجد أخطاء في console المتصفح

### 🚨 علامات وجود مشكلة:
- [ ] صفحة بيضاء أو خطأ 500
- [ ] خطأ "Cannot connect to Supabase"
- [ ] أخطاء TypeScript في terminal
- [ ] مكونات لا تحمل أو تظهر

---

## 💡 نصائح للتطوير

### عند بدء جلسة عمل جديدة:
1. افتح `CURRENT_STATUS.md` لمعرفة آخر الأحداث
2. تشغيل `npm run dev`
3. افتح `/test-db` للتأكد من عمل قاعدة البيانات
4. ابدأ العمل من آخر نقطة توقف

### عند إنهاء جلسة العمل:
1. حدّث `CURRENT_STATUS.md`
2. اعمل Git commit (إذا كان متاحاً)
3. احفظ نسخة من الملفات المهمة

---

## 🆘 في حالة الطوارئ

### إذا لم يعمل شيء:
1. **تأكد من `.env.local`** - هذا السبب الأكثر شيوعاً
2. **اعمل `npm install`** - ربما تبعية مفقودة
3. **امسح `.next/`** - مشكلة في الكاش
4. **اعد تشغيل terminal** - أحياناً يحل المشكلة

### للحصول على مساعدة:
- راجع `PROJECT_SUMMARY.md` للفهم العام
- راجع `CURRENT_STATUS.md` لآخر المشاكل
- تحقق من ملفات log في terminal

---

**⏱️ الوقت المتوقع للتشغيل**: 5-10 دقائق  
**📋 المتطلبات**: Node.js 18+, npm, terminal  
**🎯 الهدف**: الوصول لـ localhost:3000 بدون أخطاء



test