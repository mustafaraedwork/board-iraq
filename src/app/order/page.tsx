// src/app/order/page.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, User, Phone, MapPin, Package, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface OrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
}

export default function OrderPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    governorate: '',
    area: '',
    nearestLandmark: '',
    quantity: 1,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string>('');

  const governorates = [
    'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 
    'الأنبار', 'السليمانية', 'واسط', 'كركوك', 'ذي قار', 
    'بابل', 'المثنى', 'القادسية', 'صلاح الدين', 'ديالى', 
    'ميسان', 'دهوك', 'الديوانية'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ عند التعديل
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return false;
    }
    
    // التحقق من صيغة رقم الهاتف العراقي
    const phoneRegex = /^(07[3-9][0-9]{8})$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setError('يرجى إدخال رقم هاتف عراقي صحيح (مثال: 07XXXXXXXXX)');
      return false;
    }
    
    if (!formData.governorate) {
      setError('يرجى اختيار المحافظة');
      return false;
    }
    
    if (!formData.area.trim()) {
      setError('يرجى إدخال المنطقة');
      return false;
    }
    
    if (!formData.nearestLandmark.trim()) {
      setError('يرجى إدخال أقرب نقطة دالة');
      return false;
    }
    
    if (formData.quantity < 1 || formData.quantity > 10) {
      setError('الكمية يجب أن تكون بين 1 و 10');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: OrderResponse = await response.json();

      if (response.ok && result.success) {
        setOrderResult(result);
        setOrderSubmitted(true);
      } else {
        setError(result.error || 'حدث خطأ في إرسال الطلب');
      }
    } catch (err) {
      console.error('خطأ في إرسال الطلب:', err);
      setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSubmitted && orderResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم استلام طلبك بنجاح!
          </h2>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="text-blue-800 text-sm space-y-1">
              <p><strong>رقم الطلب:</strong> {orderResult.orderNumber}</p>
              <p><strong>المجموع:</strong> {orderResult.totalAmount?.toLocaleString()} دينار</p>
              <p><strong>الكمية:</strong> {formData.quantity} {formData.quantity === 1 ? 'بطاقة' : 'بطاقات'}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            شكراً لك! سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>📝 تذكير:</strong> الدفع عند التوصيل
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                setOrderSubmitted(false);
                setOrderResult(null);
                setFormData({
                  fullName: '',
                  phone: '',
                  governorate: '',
                  area: '',
                  nearestLandmark: '',
                  quantity: 1,
                  notes: ''
                });
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              طلب جديد
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اطلب كاردك الآن
          </h1>
          <p className="text-gray-600">
            احصل على بطاقتك الذكية وشارك معلوماتك بسهولة
          </p>
        </div>

        {/* عرض الأخطاء */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 ml-3 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* صورة الكارد */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                البطاقة الذكية
              </h3>
              
              <div className="relative">
                {/* صورة الكارد - يمكن استبدالها لاحقاً */}
                <div className="w-full h-60 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 text-center text-white">
                    <CreditCard className="h-16 w-16 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Board Iraq</h4>
                    <p className="text-sm opacity-90">بطاقة ذكية - NFC</p>
                  </div>
                </div>
                
                {/* مميزات الكارد */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    <span className="text-sm">تقنية NFC للمشاركة السريعة</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    <span className="text-sm">تصميم عصري وأنيق</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    <span className="text-sm">مقاوم للماء والخدوش</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    <span className="text-sm">ربط فوري بملفك الشخصي</span>
                  </div>
                </div>
                
                {/* السعر */}
                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">25,000 دينار</div>
                  <div className="text-sm text-gray-600">شامل التوصيل</div>
                </div>
              </div>
            </div>
          </div>

          {/* نموذج الطلب */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                معلومات الطلب
              </h3>
              
              <div className="space-y-6">
                
                {/* الاسم الكامل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline ml-2" />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline ml-2" />
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="07XX XXX XXXX"
                  />
                </div>

                {/* المحافظة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline ml-2" />
                    المحافظة *
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                {/* المنطقة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="اسم المنطقة أو الحي"
                  />
                </div>

                {/* أقرب نقطة دالة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أقرب نقطة دالة *
                  </label>
                  <input
                    type="text"
                    name="nearestLandmark"
                    value={formData.nearestLandmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="مثال: مول، مسجد، مدرسة، محطة وقود"
                  />
                </div>

                {/* الكمية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="h-4 w-4 inline ml-2" />
                    الكمية *
                  </label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'بطاقة' : 'بطاقات'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الملاحظات */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="h-4 w-4 inline ml-2" />
                    ملاحظات إضافية
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="أي ملاحظات أو طلبات خاصة..."
                  />
                </div>

                {/* ملاحظة الدفع */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>📝 ملاحظة مهمة:</strong> الدفع عند التوصيل - لا حاجة للدفع المسبق
                  </p>
                </div>

                {/* المجموع */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-green-600">
                      {(formData.quantity * 25000).toLocaleString()} دينار
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    شامل التوصيل المجاني
                  </div>
                </div>

                {/* زر الطلب */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent ml-2"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    '🚀 اطلب الآن'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">توصيل مجاني</h4>
            <p className="text-gray-600 text-sm">توصيل مجاني لجميع المحافظات</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">جودة عالية</h4>
            <p className="text-gray-600 text-sm">مواد متينة ومقاومة للاستخدام</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">دعم فني</h4>
            <p className="text-gray-600 text-sm">مساعدة فنية على مدار الساعة</p>
          </div>
        </div>
      </div>
    </div>
  );
}