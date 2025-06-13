// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// التحقق من وجود متغيرات البيئة مع رسائل خطأ واضحة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// دالة للتحقق من اتصال قاعدة البيانات
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('خطأ في الاتصال بـ Supabase:', error);
      return false;
    }
    
    console.log('تم الاتصال بـ Supabase بنجاح');
    return true;
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return false;
  }
}