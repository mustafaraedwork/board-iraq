// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Lock, CreditCard, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import QRCode from 'qrcode';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return false;
    }
    
    return true;
  };

  const checkUsernameAvailability = async (username: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .limit(1);
    
    return data && data.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // التحقق من توفر اسم المستخدم
      const isAvailable = await checkUsernameAvailability(formData.username);
      
      if (!isAvailable) {
        setError('اسم المستخدم مستخدم بالفعل. جرب اسماً آخر');
        setLoading(false);
        return;
      }

      // إنشاء المستخدم الجديد بالألوان الجديدة
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          username: formData.username,
          password_hash: formData.password, // سيتم تحسين التشفير لاحقاً
          is_active: true,
          is_premium: false,
          is_batch_generated: false,
          total_visits: 0,
          total_clicks: 0,
          background_color: '#F0EEE6', // ✅ اللون الكريمي الجديد
          text_color: '#141413',       // ✅ النص الأسود الداكن
          button_color: '#D97757'      // ✅ البرتقالي الدافئ
        })
        .select()
        .single();

      if (insertError) {
        setError('حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى');
        console.error('خطأ في إنشاء المستخدم:', insertError);
        setLoading(false);
        return;
      }

      // عرض رسالة النجاح
      setSuccess(true);
      
      // حفظ بيانات المستخدم
      localStorage.setItem('board_iraq_user', JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        isLoggedIn: true
      }));

      // الانتقال للوحة التحكم بعد 2 ثانية
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('خطأ في التسجيل:', error);
      setError('حدث خطأ في النظام. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              تم إنشاء حسابك بنجاح!
            </h2>
            <p className="text-gray-600 mb-4">
              مرحباً بك في Board Iraq. سيتم توجيهك للوحة التحكم خلال ثوانٍ...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Board Iraq</span>
          </Link>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              إنشاء حساب جديد
            </CardTitle>
            <p className="text-gray-600">
              انضم إلى Board Iraq واحصل على صفحتك الرقمية
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* رسالة الخطأ */}
              {error && (
                <div className="flex items-center space-x-2 space-x-reverse p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* حقل اسم المستخدم */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  اسم المستخدم *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: ahmed123"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  سيكون هذا رابط صفحتك: boardiraq.com/{formData.username}
                </p>
              </div>
              
              {/* حقل كلمة المرور */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ادخل كلمة مرور قوية"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  تأكيد كلمة المرور *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أعد إدخال كلمة المرور"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* زر إنشاء الحساب */}
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  'إنشاء حساب جديد'
                )}
              </Button>
            </form>
            
            {/* رابط تسجيل الدخول */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <p className="text-sm text-blue-800">
                ✨ <strong>مجاني تماماً!</strong> ستحصل على صفحة شخصية رقمية فورية مع QR Code خاص بك.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}