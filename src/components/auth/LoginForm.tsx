// src/app/(auth)/login/page.tsx
import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
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

        {/* Login Form Component */}
        <LoginForm />
        
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}