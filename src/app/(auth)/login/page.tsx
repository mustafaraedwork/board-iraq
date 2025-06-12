// src/app/(auth)/login/page.tsx - محدث بالهوية البصرية الجديدة مع الاحتفاظ على جميع الوظائف
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, User, Lock, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleLogin = async () => {
    // منع الإرسال إذا كانت الحقول فارغة
    if (!username.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');

    console.log('🔍 محاولة تسجيل الدخول...', username);

    try {
      // ✅ التحقق من قاعدة البيانات
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password) // نص بسيط كما هو مطلوب
        .single();

      if (error || !user) {
        console.log('❌ فشل في تسجيل الدخول:', error);
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        return;
      }

      // ✅ تحقق من حالة الحساب
      if (!user.is_active) {
        setError('هذا الحساب غير مفعل. يرجى التواصل مع الدعم');
        return;
      }

      console.log('✅ تم تسجيل الدخول بنجاح!', user.username);
      
      // ✅ حفظ بيانات المستخدم الكاملة
      localStorage.setItem('board_iraq_user', JSON.stringify({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        is_admin: user.is_admin,
        isLoggedIn: true
      }));

      // ✅ تحديث آخر زيارة
      await supabase
        .from('users')
        .update({ last_visit_at: new Date().toISOString() })
        .eq('id', user.id);
      
      // ✅ توجيه حسب نوع المستخدم
      if (user.is_admin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('💥 خطأ في النظام:', error);
      setError('حدث خطأ في النظام. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4" 
      style={{ backgroundColor: '#F0EEE6' }}
      dir="rtl"
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 space-x-reverse">
            <img 
              src="/logo.svg" 
              alt="Board Iraq Logo" 
              className="h-16 w-auto"
            />
          </Link>
        </div>

        <Card 
          className="shadow-lg border-0"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <CardHeader className="text-center">
            <CardTitle 
              className="text-2xl font-bold"
              style={{ color: '#141413' }}
            >
              تسجيل الدخول
            </CardTitle>
            <p style={{ color: '#141413', opacity: 0.7 }}>
              ادخل إلى لوحة التحكم الخاصة بك
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {error && (
              <div 
                className="flex items-center space-x-2 space-x-reverse p-3 rounded-md border"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#dc2626'
                }}
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* حقل اسم المستخدم */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#141413' }}
                >
                  اسم المستخدم
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:ring-orange-400"
                    placeholder="ادخل اسم المستخدم"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* حقل كلمة المرور */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#141413' }}
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:ring-orange-400"
                    placeholder="ادخل كلمة المرور"
                    dir="ltr"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleLogin}
                className="w-full text-white border-0 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#D97757' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#D97757' }}
                >
                  إنشاء حساب جديد
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: '#141413' }}
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}