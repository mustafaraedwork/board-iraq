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
  AlertTriangle
} from 'lucide-react';
import { AuthService } from '@/lib/utils';
import Image from 'next/image';

export default function UnauthorizedPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = AuthService.getUser();
    setCurrentUser(user?.username || 'مجهول');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" dir="rtl" style={{ backgroundColor: '#F0EEE6' }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Board Iraq Logo"
              width={200}
              height={60}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Unauthorized Card */}
        <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D97757', opacity: 0.1 }}>
              <Shield className="h-8 w-8" style={{ color: '#D97757' }} />
            </div>
            <CardTitle className="text-2xl font-bold mb-2" style={{ color: '#D97757' }}>
              غير مصرح لك بالوصول
            </CardTitle>
            <p style={{ color: '#141413', opacity: 0.7 }}>
              هذه الصفحة مخصصة للمشرفين فقط
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات المستخدم الحالي */}
            <div className="rounded-lg p-4" style={{ backgroundColor: '#F0EEE6' }}>
              <div className="flex items-center space-x-3 space-x-reverse">
                <User className="h-5 w-5" style={{ color: '#141413', opacity: 0.6 }} />
                <div>
                  <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>المستخدم الحالي:</p>
                  <p className="font-medium" style={{ color: '#141413' }}>{currentUser}</p>
                </div>
              </div>
            </div>

            {/* التحذير */}
            <div className="border-0 rounded-lg p-4" style={{ backgroundColor: '#F0EEE6' }}>
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: '#141413' }} />
                <div>
                  <h4 className="text-sm font-medium mb-1" style={{ color: '#141413' }}>
                    تنبيه هام
                  </h4>
                  <p className="text-sm" style={{ color: '#141413', opacity: 0.8 }}>
                    للحصول على صلاحيات المشرف، يرجى التواصل مع الإدارة
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار التنقل */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="w-full border-0 focus:ring-orange-400" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    color: '#141413',
                    borderColor: '#D97757'
                  }}
                >
                  <User className="h-4 w-4 ml-2" />
                  لوحة التحكم
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  className="w-full border-0 focus:ring-orange-400 text-white"
                  style={{ backgroundColor: '#D97757' }}
                >
                  <Home className="h-4 w-4 ml-2" />
                  الصفحة الرئيسية
                </Button>
              </Link>
            </div>

            {/* زر تسجيل خروج */}
            <Button 
              variant="ghost" 
              className="w-full border-0 focus:ring-orange-400"
              style={{ 
                color: '#D97757',
                backgroundColor: 'transparent'
              }}
              onClick={AuthService.logout}
            >
              تسجيل خروج والدخول بحساب آخر
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#141413', opacity: 0.5 }}>
            Board Iraq © 2025 - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}