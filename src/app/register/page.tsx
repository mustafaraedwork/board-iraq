// src/app/register/page.tsx - محدث مع تتبع Facebook
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

// استيراد Facebook Hooks
import { 
  useFacebookCompleteRegistration, 
  useFacebookViewContent,
  useFacebookEngagementTracking
} from '@/lib/facebook-hooks';

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

  // تفعيل Facebook Hooks
  const trackViewContent = useFacebookViewContent();
  const trackCompleteRegistration = useFacebookCompleteRegistration();
  
  // تتبع التفاعل التلقائي (وقت التصفح والتمرر)
  useFacebookEngagementTracking();

  // تتبع ViewContent عند دخول صفحة التسجيل
  useEffect(() => {
    trackViewContent({
      content_type: 'page',
      content_ids: ['registration_page'],
      content_name: 'صفحة إنشاء حساب جديد - Board Iraq',
      value: 11.36, // 15,000 دينار = 11.36 USD
      currency: 'USD'
    });
  }, [trackViewContent]);

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
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .limit(1);
      
      if (error) {
        console.error('Error checking username availability:', error);
        return false;
      }
      
      return data && data.length === 0;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
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
        console.error('Registration error:', insertError);
        setError('حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى');
        setLoading(false);
        return;
      }

      if (!newUser) {
        console.error('No user data returned from registration');
        setError('حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى');
        setLoading(false);
        return;
      }

      // 🎉 تتبع CompleteRegistration في Facebook
      await trackCompleteRegistration({
        registration_method: 'website',
        user_email: '', // يمكن إضافة إيميل لاحقاً
        user_phone: '', // يمكن إضافة هاتف لاحقاً
        user_name: formData.username,
        username: formData.username
      });

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
      console.error('Registration error:', error);
      setError('حدث خطأ في النظام. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4" 
        style={{ backgroundColor: '#F0EEE6' }}
        dir="rtl"
      >
        <Card 
          className="w-full max-w-md border-0"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#10b981' }} />
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: '#141413' }}
            >
              تم إنشاء حسابك بنجاح!
            </h2>
            <p 
              className="mb-4"
              style={{ color: '#141413', opacity: 0.7 }}
            >
              مرحباً بك في Board Iraq. سيتم توجيهك للوحة التحكم خلال ثوانٍ...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{ borderColor: '#D97757' }}></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4" 
      style={{ backgroundColor: '#F0EEE6' }}
      dir="rtl"
    >
      <div className="max-w-md w-full">
        {/* Header مع اللوجو الجديد */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 space-x-reverse">
            <Image 
              src="/logo.svg" 
              alt="Board Iraq Logo" 
              width={64}
              height={64}
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Register Card */}
        <Card 
          className="shadow-lg border-0"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <CardHeader className="text-center">
            <CardTitle 
              className="text-2xl font-bold"
              style={{ color: '#141413' }}
            >
              إنشاء حساب جديد
            </CardTitle>
            <p style={{ color: '#141413', opacity: 0.7 }}>
              انضم إلى BOARD واحصل على صفحتك الرقمية
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* رسالة الخطأ */}
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
              
              {/* حقل اسم المستخدم */}
              <div className="space-y-2">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium"
                  style={{ color: '#141413' }}
                >
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
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:ring-orange-400"
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
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium"
                  style={{ color: '#141413' }}
                >
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
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:ring-orange-400"
                    placeholder="ادخل كلمة مرور قوية"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium"
                  style={{ color: '#141413' }}
                >
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
                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:ring-orange-400"
                    placeholder="أعد إدخال كلمة المرور"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* زر إنشاء الحساب */}
              <Button 
                type="submit"
                className="w-full text-white border-0 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#D97757' }}
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
              <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                لديك حساب بالفعل؟{' '}
                <Link 
                  href="/login" 
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#D97757' }}
                >
                  تسجيل الدخول
                </Link>
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