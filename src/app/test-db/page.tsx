// src/app/test-db/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserService } from '@/lib/supabase/server';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestDBPage() {
  const [testResults, setTestResults] = useState<{
    connection: boolean | null;
    demoUser: any;
    userLinks: any[];
    stats: any;
    loading: boolean;
    error?: string;
  }>({
    connection: null,
    demoUser: null,
    userLinks: [],
    stats: null,
    loading: false
  });

  const runTests = async () => {
    setTestResults(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      // اختبار الاتصال والحصول على المستخدم التجريبي
      const demoUser = await UserService.getUserByUsername('demo123');
      
      let userLinks: any[] = [];
      if (demoUser) {
        userLinks = await UserService.getUserLinks(demoUser.id);
      }

      // اختبار الإحصائيات
      const stats = await UserService.getAdminStats();

      setTestResults({
        connection: true,
        demoUser,
        userLinks,
        stats,
        loading: false
      });

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        loading: false,
        connection: false,
        error: error instanceof Error ? error.message : 'خطأ في الاتصال'
      }));
    }
  };

  const createTestUsers = async () => {
    try {
      setTestResults(prev => ({ ...prev, loading: true }));
      
      const result = await UserService.createBatchUsers(5, 'test');
      
      if (result.success) {
        alert(`تم إنشاء ${result.users.length} مستخدم تجريبي بنجاح!`);
        await runTests(); // إعادة تشغيل الاختبارات
      } else {
        alert(`خطأ: ${result.error}`);
      }
      
      setTestResults(prev => ({ ...prev, loading: false }));
    } catch (error) {
      alert('خطأ في إنشاء المستخدمين التجريبيين');
      setTestResults(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اختبار قاعدة البيانات
          </h1>
          <p className="text-gray-600">
            تحقق من الاتصال بـ Supabase والبيانات
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              {testResults.loading ? (
                <Loader2 className="h-5 w-5 animate-spin ml-2" />
              ) : testResults.connection ? (
                <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 ml-2" />
              )}
              حالة الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.loading ? (
              <p className="text-gray-600">جاري الاختبار...</p>
            ) : testResults.connection ? (
              <p className="text-green-600">✅ تم الاتصال بـ Supabase بنجاح!</p>
            ) : (
              <div>
                <p className="text-red-600 mb-2">❌ فشل في الاتصال بقاعدة البيانات</p>
                {testResults.error && (
                  <p className="text-sm text-red-500">الخطأ: {testResults.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo User */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>المستخدم التجريبي</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.demoUser ? (
              <div className="space-y-2">
                <p><strong>اسم المستخدم:</strong> {testResults.demoUser.username}</p>
                <p><strong>الاسم الكامل:</strong> {testResults.demoUser.full_name}</p>
                <p><strong>الوظيفة:</strong> {testResults.demoUser.job_title}</p>
                <p><strong>الشركة:</strong> {testResults.demoUser.company}</p>
                <p><strong>إجمالي الزيارات:</strong> {testResults.demoUser.total_visits}</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(testResults.demoUser.created_at).toLocaleDateString('ar')}</p>
              </div>
            ) : (
              <p className="text-gray-600">لم يتم العثور على المستخدم التجريبي</p>
            )}
          </CardContent>
        </Card>

        {/* User Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>روابط المستخدم التجريبي ({testResults.userLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.userLinks.length > 0 ? (
              <div className="space-y-3">
                {testResults.userLinks.map((link, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <p><strong>{link.title}</strong></p>
                    <p className="text-sm text-gray-600">النوع: {link.type}</p>
                    <p className="text-sm text-gray-600">الرابط: {link.url}</p>
                    <p className="text-sm text-gray-600">النقرات: {link.click_count}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">لا توجد روابط</p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إحصائيات عامة</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{testResults.stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{testResults.stats.totalVisits}</p>
                  <p className="text-sm text-gray-600">إجمالي الزيارات</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{testResults.stats.totalClicks}</p>
                  <p className="text-sm text-gray-600">إجمالي النقرات</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{testResults.stats.topUsers.length}</p>
                  <p className="text-sm text-gray-600">مستخدمين نشطين</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">لا توجد إحصائيات</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات الاختبار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runTests}
              disabled={testResults.loading}
              className="w-full"
            >
              {testResults.loading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : null}
              إعادة تشغيل الاختبارات
            </Button>
            
            <Button 
              onClick={createTestUsers}
              disabled={testResults.loading}
              variant="outline"
              className="w-full"
            >
              إنشاء 5 مستخدمين تجريبيين
            </Button>
            
            <div className="text-center">
              <a href="/" className="text-blue-600 hover:text-blue-500">
                ← العودة للصفحة الرئيسية
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}