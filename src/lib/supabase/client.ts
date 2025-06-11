 // src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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