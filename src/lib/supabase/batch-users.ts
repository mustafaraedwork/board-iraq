// src/lib/supabase/batch-users.ts
import { supabase } from './client';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface BatchUser {
  username: string;
  password: string;
  full_name: string;
  qr_code: string;
}

export interface BatchResult {
  success: boolean;
  users: BatchUser[];
  errors: string[];
  successCount: number;
  errorCount: number;
  csvData: string;
}

// توليد كلمة مرور عشوائية
function generateRandomPassword(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// توليد اسم مستخدم عشوائي
function generateRandomUsername(prefix: string = 'user'): string {
  const randomNum = Math.floor(Math.random() * 9999) + 1000;
  return `${prefix}${randomNum}`;
}

// توليد QR Code
async function generateQRCode(username: string): Promise<string> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://boardiraq.com'}/${username}`;
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('خطأ في توليد QR Code:', error);
    return '';
  }
}

// فحص إذا كان اسم المستخدم موجود
async function isUsernameExists(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();
    
    return !!data && !error;
  } catch {
    return false;
  }
}

// إنشاء مستخدم واحد
async function createSingleUser(prefix: string): Promise<BatchUser | null> {
  try {
    // توليد اسم مستخدم فريد
    let username = generateRandomUsername(prefix);
    let attempts = 0;
    
    while (await isUsernameExists(username) && attempts < 10) {
      username = generateRandomUsername(prefix);
      attempts++;
    }
    
    if (attempts >= 10) {
      throw new Error('فشل في توليد اسم مستخدم فريد');
    }
    
    const password = generateRandomPassword();
    const full_name = `مستخدم ${username}`;
    
    // إنشاء المستخدم في قاعدة البيانات بالألوان الجديدة
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: password, // نص بسيط كما طلب العميل
        full_name,
        is_active: true,
        is_batch_generated: true,
        is_admin: false,
        background_color: '#F0EEE6', // ✅ اللون الكريمي الجديد
        text_color: '#141413',       // ✅ النص الأسود الداكن
        button_color: '#D97757',     // ✅ البرتقالي الدافئ
        total_visits: 0,
        total_clicks: 0
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // توليد QR Code
    const qr_code = await generateQRCode(username);
    
    return {
      username,
      password,
      full_name,
      qr_code
    };
  } catch (error) {
    console.error('خطأ في إنشاء مستخدم:', error);
    return null;
  }
}

// إنشاء حسابات بالجملة
export async function createBatchUsers(
  count: number,
  prefix: string = 'user'
): Promise<BatchResult> {
  const users: BatchUser[] = [];
  const errors: string[] = [];
  
  // التحقق من صحة المدخلات
  if (count < 1 || count > 10000) {
    return {
      success: false,
      users: [],
      errors: ['عدد الحسابات يجب أن يكون بين 1 و 10,000'],
      successCount: 0,
      errorCount: 1,
      csvData: ''
    };
  }
  
  // إنشاء الحسابات
  for (let i = 0; i < count; i++) {
    try {
      const user = await createSingleUser(prefix);
      if (user) {
        users.push(user);
      } else {
        errors.push(`فشل في إنشاء المستخدم رقم ${i + 1}`);
      }
    } catch (error) {
      errors.push(`خطأ في المستخدم رقم ${i + 1}: ${error}`);
    }
  }
  
  // تحضير بيانات CSV
  const csvData = generateCSV(users);
  
  return {
    success: users.length > 0,
    users,
    errors,
    successCount: users.length,
    errorCount: errors.length,
    csvData
  };
}

// تحضير بيانات CSV
function generateCSV(users: BatchUser[]): string {
  const headers = ['اسم المستخدم', 'كلمة المرور', 'الاسم الكامل', 'رابط الملف الشخصي'];
  const csvRows = [headers.join(',')];
  
  users.forEach(user => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://boardiraq.com'}/${user.username}`;
    const row = [
      user.username,
      user.password,
      user.full_name,
      profileUrl
    ].join(',');
    csvRows.push(row);
  });
  
  return csvRows.join('\n');
}

// تصدير CSV
export function downloadCSV(csvData: string, filename: string = 'batch_users'): void {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  saveAs(blob, `${filename}_${timestamp}.csv`);
}

// ✅ جديد: تحميل QR Code منفرد
export function downloadSingleQR(qrCode: string, username: string): void {
  // تحويل data URL إلى Blob
  const byteCharacters = atob(qrCode.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  saveAs(blob, `qr_${username}.png`);
}

// ✅ جديد: ضغط جميع QR Codes في ملف ZIP
export async function downloadQRCodesZip(users: BatchUser[], filename: string = 'qr_codes'): Promise<void> {
  try {
    const zip = new JSZip();
    
    // إضافة كل QR Code للـ ZIP
    users.forEach(user => {
      if (user.qr_code) {
        // تحويل data URL إلى binary data
        const base64Data = user.qr_code.split(',')[1];
        zip.file(`${user.username}_qr.png`, base64Data, { base64: true });
      }
    });
    
    // إضافة ملف CSV مع البيانات
    const csvData = generateCSV(users);
    zip.file('users_data.csv', csvData);
    
    // إضافة ملف README
    const readmeContent = `# Board Iraq - بطاقات QR

## معلومات الحزمة:
- عدد البطاقات: ${users.length}
- تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-IQ')}
- الموقع: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://boardiraq.com'}

## محتويات الملف:
- ${users.length} ملف PNG (أكواد QR)
- ملف CSV مع بيانات الحسابات
- هذا الملف (README)

## طريقة الاستخدام:
1. اطبع أكواد QR على البطاقات
2. استخدم بيانات CSV لإعطاء المستخدمين بياناتهم
3. كل QR Code يوجه إلى الملف الشخصي للمستخدم

## الدعم الفني:
- الهاتف: ${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+9647845663136'}
- الإيميل: ${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@boardiraq.com'}
`;
    
    zip.file('README.txt', readmeContent);
    
    // توليد الملف المضغوط وتحميله
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    saveAs(zipBlob, `${filename}_${timestamp}.zip`);
    
  } catch (error) {
    console.error('خطأ في إنشاء ملف ZIP:', error);
    throw new Error('فشل في إنشاء ملف ZIP');
  }
}

// ✅ جديد: تحميل QR Codes منفردة (الطريقة القديمة للمقارنة)
export function downloadAllQRCodes(users: BatchUser[]): void {
  users.forEach(user => {
    if (user.qr_code) {
      downloadSingleQR(user.qr_code, user.username);
    }
  });
}

// جلب إحصائيات الحسابات المنشأة بالجملة
export async function getBatchUsersStats() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_batch_generated', true);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      total: data?.length || 0,
      users: data || []
    };
  } catch (error) {
    console.error('خطأ في جلب إحصائيات الحسابات:', error);
    return {
      success: false,
      total: 0,
      users: []
    };
  }
}