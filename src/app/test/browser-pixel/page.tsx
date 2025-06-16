'use client';

import { useState } from 'react';

export default function TestFacebookPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: any) => {
    setResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString('ar-IQ')
    }]);
  };

  const testEvent = async (eventType: string, endpoint: string, data: any = {}) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      addResult({
        event: eventType,
        success: result.success,
        message: result.message,
        details: result.result || result.error,
        status: response.status
      });
      
    } catch (error: any) {
      addResult({
        event: eventType,
        success: false,
        message: 'خطأ في الشبكة',
        details: error.message,
        status: 'ERROR'
      });
    }
    setLoading(false);
  };

  const clearResults = () => setResults([]);

  const testViewContent = () => {
    testEvent('مشاهدة المحتوى', '/api/facebook/view-content', {
      cardOwner: 'testuser_demo',
      visitorData: {
        city: 'بغداد',
        firstName: 'أحمد'
      }
    });
  };

  const testContact = () => {
    testEvent('اتصال', '/api/facebook/contact', {
      linkType: 'whatsapp',
      cardOwner: 'testuser_demo',
      visitorData: {
        city: 'بغداد',
        phone: '07901234567'
      }
    });
  };

  const testAddToWishlist = () => {
    testEvent('إضافة للرغبات', '/api/facebook/add-to-wishlist', {
      cardOwner: 'testuser_demo',
      engagementScore: 85,
      visitorData: {
        city: 'بغداد',
        email: 'test@example.com'
      }
    });
  };

  const testInitiateCheckout = () => {
    testEvent('بدء الطلب', '/api/facebook/initiate-checkout', {
      userEmail: 'customer@test.com',
      userPhone: '07701234567',
      visitorData: {
        city: 'بغداد',
        firstName: 'محمد'
      }
    });
  };

  const testPurchase = () => {
    testEvent('إتمام الشراء', '/api/facebook/purchase', {
      userEmail: 'customer@test.com',
      userPhone: '07701234567',
      userName: 'محمد أحمد',
      userCity: 'بغداد',
      orderValue: 25000,
      currency: 'IQD'
    });
  };

  const testCompleteRegistration = () => {
    testEvent('إكمال التسجيل', '/api/facebook/complete-registration', {
      userEmail: 'newuser@test.com',
      userPhone: '07801234567',
      userName: 'علي حسن',
      username: 'ali_hassan_demo'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🧪 اختبار Facebook Conversions API - Board Iraq
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <button
              onClick={testViewContent}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              👁️ مشاهدة المحتوى
            </button>
            
            <button
              onClick={testContact}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              📞 اتصال
            </button>
            
            <button
              onClick={testAddToWishlist}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              ❤️ إضافة للرغبات
            </button>
            
            <button
              onClick={testInitiateCheckout}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              🛒 بدء الطلب
            </button>
            
            <button
              onClick={testPurchase}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              💰 إتمام الشراء
            </button>
            
            <button
              onClick={testCompleteRegistration}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              👤 إكمال التسجيل
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">النتائج</h2>
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              مسح النتائج
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">جاري الإرسال...</p>
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? '✅' : '❌'} {result.event}
                  </span>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                
                <p className={`mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.message}
                </p>
                
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      عرض التفاصيل
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {results.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              انقر على أي زر أعلاه لاختبار الأحداث
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">📋 تعليمات:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• تأكد من وجود Access Token في ملف .env.local</li>
              <li>• فحص Facebook Events Manager للأحداث الواردة</li>
              <li>• النتائج تظهر خلال 5-10 دقائق في Facebook</li>
              <li>• استخدم Facebook Pixel Helper للتحقق من Browser Events</li>
              <li>• جميع البيانات المرسلة للاختبار فقط وليست حقيقية</li>
              <li>• <strong>Browser Pixel:</strong> <a href="/test/browser-pixel" className="text-blue-600 underline">اختبر Browser Pixel هنا</a></li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-2">🔍 مراقبة النتائج:</h3>
            <p className="text-sm text-yellow-700">
              بعد إرسال الأحداث، اذهب إلى Facebook Events Manager → اختر البكسل 539630289902216 → 
              انقر "Test Events" لمشاهدة الأحداث الواردة خلال 2-5 دقائق.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}