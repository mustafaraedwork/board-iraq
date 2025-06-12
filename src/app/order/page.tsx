// src/app/order/page.tsx - محدث بالهوية البصرية الجديدة مع الاحتفاظ على جميع الوظائف
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
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: '#F0EEE6' }}
        dir="rtl"
      >
        <div 
          className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center border-0"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: '#10b981' }} />
          </div>
          
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: '#141413' }}
          >
            تم استلام طلبك بنجاح!
          </h2>
          
          <div 
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}
          >
            <div className="text-sm space-y-1" style={{ color: '#141413' }}>
              <p><strong>رقم الطلب:</strong> {orderResult.orderNumber}</p>
              <p><strong>المجموع:</strong> {orderResult.totalAmount?.toLocaleString()} دينار</p>
              <p><strong>الكمية:</strong> {formData.quantity} {formData.quantity === 1 ? 'بطاقة' : 'بطاقات'}</p>
            </div>
          </div>
          
          <p 
            className="mb-6 leading-relaxed"
            style={{ color: '#141413', opacity: 0.7 }}
          >
            شكراً لك! سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.
          </p>
          
          <div 
            className="border rounded-xl p-4 mb-6"
            style={{ 
              backgroundColor: 'rgba(252, 211, 77, 0.1)',
              borderColor: 'rgba(252, 211, 77, 0.3)'
            }}
          >
            <p className="text-sm" style={{ color: '#141413' }}>
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
              className="w-full text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200"
              style={{ backgroundColor: '#D97757' }}
            >
              طلب جديد
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-3 rounded-xl font-medium hover:opacity-80 transition-all duration-200"
              style={{ 
                backgroundColor: 'rgba(20, 20, 19, 0.1)',
                color: '#141413'
              }}
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4" 
      style={{ backgroundColor: '#F0EEE6' }}
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Board Iraq Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: '#141413' }}
          >
            اطلب بطاقتك الآن
          </h1>
          <p style={{ color: '#141413', opacity: 0.7 }}>
            احصل على بطاقتك الذكية وشارك معلوماتك بسهولة
          </p>
        </div>

        {/* عرض الأخطاء */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div 
              className="border rounded-xl p-4 flex items-center"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <AlertCircle className="h-5 w-5 text-red-500 ml-3 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* صورة الكارد */}
          <div className="order-2 lg:order-1">
            <div 
              className="rounded-2xl shadow-xl p-6 border-0"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              <h3 
                className="text-xl font-bold mb-4 text-center"
                style={{ color: '#141413' }}
              >
                البطاقة الذكية
              </h3>
              
              <div className="relative">
                {/* صورة الكارد */}
                <div 
                  className="w-full h-60 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #D97757 0%, #a8563f 50%, #8b4332 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="relative z-10 text-center text-white">
                    <CreditCard className="h-16 w-16 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Board Iraq</h4>
                    <p className="text-sm opacity-90">بطاقة ذكية - NFC</p>
                  </div>
                </div>
                
                {/* مميزات الكارد */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center" style={{ color: '#141413' }}>
                    <div 
                      className="w-2 h-2 rounded-full ml-3"
                      style={{ backgroundColor: '#10b981' }}
                    ></div>
                    <span className="text-sm">تقنية NFC للمشاركة السريعة</span>
                  </div>
                  <div className="flex items-center" style={{ color: '#141413' }}>
                    <div 
                      className="w-2 h-2 rounded-full ml-3"
                      style={{ backgroundColor: '#10b981' }}
                    ></div>
                    <span className="text-sm">تصميم عصري وأنيق</span>
                  </div>
                  <div className="flex items-center" style={{ color: '#141413' }}>
                    <div 
                      className="w-2 h-2 rounded-full ml-3"
                      style={{ backgroundColor: '#10b981' }}
                    ></div>
                    <span className="text-sm">مقاوم للماء والخدوش</span>
                  </div>
                  <div className="flex items-center" style={{ color: '#141413' }}>
                    <div 
                      className="w-2 h-2 rounded-full ml-3"
                      style={{ backgroundColor: '#10b981' }}
                    ></div>
                    <span className="text-sm">ربط فوري بملفك الشخصي</span>
                  </div>
                </div>
                
                {/* السعر */}
                <div 
                  className="mt-6 rounded-xl p-4 text-center"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: '#141413' }}
                  >
                    15,000 دينار
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: '#141413', opacity: 0.7 }}
                  >
                    شامل التوصيل
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* نموذج الطلب */}
          <div className="order-1 lg:order-2">
            <div 
              className="rounded-2xl shadow-xl p-6 border-0"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              <h3 
                className="text-xl font-bold mb-6"
                style={{ color: '#141413' }}
              >
                معلومات الطلب
              </h3>
              
              <div className="space-y-6">
                
                {/* الاسم الكامل */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    <User className="h-4 w-4 inline ml-2" />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    <Phone className="h-4 w-4 inline ml-2" />
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
                    placeholder="07XX XXX XXXX"
                  />
                </div>

                {/* المحافظة */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    <MapPin className="h-4 w-4 inline ml-2" />
                    المحافظة *
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                {/* المنطقة */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    المنطقة *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
                    placeholder="اسم المنطقة أو الحي"
                  />
                </div>

                {/* أقرب نقطة دالة */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    أقرب نقطة دالة *
                  </label>
                  <input
                    type="text"
                    name="nearestLandmark"
                    value={formData.nearestLandmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
                    placeholder="مثال: مول، مسجد، مدرسة، محطة وقود"
                  />
                </div>

                {/* الكمية */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    <Package className="h-4 w-4 inline ml-2" />
                    الكمية *
                  </label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200"
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
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#141413' }}
                  >
                    <MessageSquare className="h-4 w-4 inline ml-2" />
                    ملاحظات إضافية
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent focus:ring-orange-400 transition-all duration-200 resize-none"
                    placeholder="أي ملاحظات أو طلبات خاصة..."
                  />
                </div>

                {/* ملاحظة الدفع */}
                <div 
                  className="border rounded-xl p-4"
                  style={{ 
                    backgroundColor: 'rgba(252, 211, 77, 0.1)',
                    borderColor: 'rgba(252, 211, 77, 0.3)'
                  }}
                >
                  <p className="text-sm" style={{ color: '#141413' }}>
                    <strong>📝 ملاحظة مهمة:</strong> الدفع عند التوصيل - لا حاجة للدفع المسبق
                  </p>
                </div>

                {/* المجموع */}
                <div 
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}
                >
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span style={{ color: '#141413' }}>المجموع الكلي:</span>
                    <span style={{ color: '#10b981' }}>
                      {(formData.quantity * 15000).toLocaleString()} دينار
                    </span>
                  </div>
                  <div 
                    className="text-sm mt-1"
                    style={{ color: '#141413', opacity: 0.7 }}
                  >
                    شامل التوصيل المجاني
                  </div>
                </div>

                {/* زر الطلب */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#D97757' }}
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
          <div 
            className="rounded-2xl p-6 text-center shadow-lg border-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
            >
              <Package className="h-6 w-6" style={{ color: '#10b981' }} />
            </div>
            <h4 className="font-bold mb-2" style={{ color: '#141413' }}>توصيل مجاني</h4>
            <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>توصيل مجاني لجميع المحافظات</p>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center shadow-lg border-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}
            >
              <CheckCircle className="h-6 w-6" style={{ color: '#D97757' }} />
            </div>
            <h4 className="font-bold mb-2" style={{ color: '#141413' }}>جودة عالية</h4>
            <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>مواد متينة ومقاومة للاستخدام</p>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center shadow-lg border-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              <Phone className="h-6 w-6" style={{ color: '#8b5cf6' }} />
            </div>
            <h4 className="font-bold mb-2" style={{ color: '#141413' }}>دعم فني</h4>
            <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>مساعدة فنية على مدار الساعة</p>
          </div>
        </div>
      </div>
    </div>
  );
}