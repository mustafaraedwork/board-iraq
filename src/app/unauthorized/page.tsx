// src/app/unauthorized/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Home, 
  User, 
  AlertTriangle,
  CreditCard 
} from 'lucide-react';
import { AuthService } from '@/lib/utils';

export default function UnauthorizedPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = AuthService.getUser();
    setCurrentUser(user?.username || 'مجهول');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4" dir="rtl">
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

        {/* Unauthorized Card */}
        <Card className="shadow-lg border-red-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800 mb-2">
              غير مصرح لك بالوصول
            </CardTitle>
            <p className="text-gray-600">
              هذه الصفحة مخصصة للمشرفين فقط
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات المستخدم الحالي */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">المستخدم الحالي:</p>
                  <p className="font-medium text-gray-900">{currentUser}</p>
                </div>
              </div>
            </div>

            {/* التحذير */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    تنبيه هام
                  </h4>
                  <p className="text-sm text-yellow-700">
                    للحصول على صلاحيات المشرف، يرجى التواصل مع الإدارة
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                للحصول على المساعدة:
              </h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>📧 البريد: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@boardiraq.com'}</p>
                <p>📱 الهاتف: {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+964 XXX XXX XXXX'}</p>
              </div>
            </div>

            {/* أزرار التنقل */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 ml-2" />
                  لوحة التحكم
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <Home className="h-4 w-4 ml-2" />
                  الصفحة الرئيسية
                </Button>
              </Link>
            </div>

            {/* زر تسجيل خروج */}
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={AuthService.logout}
            >
              تسجيل خروج والدخول بحساب آخر
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Board Iraq © 2025 - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}