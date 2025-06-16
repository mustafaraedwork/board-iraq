// src/lib/facebook-hooks.ts
// نظام React Hooks لـ Facebook Pixel + Conversions API
// محدث بالسعر الجديد: 15,000 دينار

'use client';

import { useEffect } from 'react';

// تشفير البيانات SHA256 (للمتصفح)
async function hashData(data: string): Promise<string> {
  if (typeof window === 'undefined' || !data) return '';
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// تحديد البلد والمدينة (بيانات عراقية)
function getUserLocation() {
  return {
    country: 'IQ',
    state: 'Baghdad',
    city: 'Baghdad',
    postal_code: '10001'
  };
}

// إرسال حدث إلى Conversions API
async function sendToConversionsAPI(eventData: any) {
  try {
    const response = await fetch('/api/facebook/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      console.warn('خطأ في إرسال Facebook Conversions API:', response.status);
    } else {
      console.log('✅ تم إرسال حدث Conversions API بنجاح');
    }
  } catch (error) {
    console.warn('خطأ شبكة في Facebook Conversions API:', error);
  }
}

// إرسال حدث إلى Browser Pixel
function sendToBrowserPixel(eventName: string, eventData: any = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, eventData);
    console.log(`✅ تم إرسال ${eventName} إلى Browser Pixel`);
  }
}

// بيانات عراقية للاختبار
function generateIraqiTestData() {
  const names = ['أحمد محمد', 'فاطمة علي', 'محمود حسن', 'زينب خالد', 'عمر يوسف', 'مريم صالح', 'علي حسين', 'نور أحمد'];
  const cities = ['بغداد', 'البصرة', 'أربيل', 'النجف', 'كربلاء', 'الموصل', 'الحلة', 'الناصرية'];
  const phones = ['07901234567', '07811234567', '07701234567', '07771234567', '07781234567'];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    phone: phones[Math.floor(Math.random() * phones.length)],
    email: `test${Math.floor(Math.random() * 1000)}@gmail.com`
  };
}

// Hook لتحميل Facebook Pixel تلقائياً
export function useFacebookPixelInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    if (!pixelId) {
      console.warn('⚠️ Facebook Pixel ID غير محدد في متغيرات البيئة');
      return;
    }

    // تحقق من وجود الـ Pixel بالفعل
    if (window.fbq) {
      console.log('✅ Facebook Pixel موجود بالفعل');
      return;
    }

    // إنشاء الـ Pixel
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    
    console.log('✅ تم تحميل Facebook Pixel بنجاح:', pixelId);
  }, []);
}

// Hook لـ ViewContent - تتبع مشاهدة المحتوى
export function useFacebookViewContent() {
  return async (contentData: {
    content_type?: string;
    content_ids?: string[];
    content_name?: string;
    value?: number;
    currency?: string;
    user_name?: string;
  } = {}) => {
    const testData = generateIraqiTestData();
    const location = getUserLocation();
    
    // البيانات المحدثة بالسعر الجديد: 15,000 دينار = 11.36 USD
    const eventData = {
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(testData.email)],
        ph: [await hashData(testData.phone)],
        fn: [await hashData(testData.name.split(' ')[0])],
        ln: [await hashData(testData.name.split(' ')[1] || '')],
        ct: [await hashData(testData.city)],
        country: [await hashData(location.country)],
        st: [await hashData(location.state)],
        zp: [await hashData(location.postal_code)]
      },
      custom_data: {
        content_type: contentData.content_type || 'product',
        content_ids: contentData.content_ids || ['smart_card'],
        content_name: contentData.content_name || `بطاقة ذكية ${contentData.user_name || 'Board Iraq'}`,
        value: contentData.value || 11.36, // 15,000 دينار = 11.36 USD
        currency: contentData.currency || 'USD',
        content_category: 'smart_card'
      }
    };

    // إرسال مزدوج
    sendToBrowserPixel('ViewContent', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('📊 تم تتبع ViewContent للبطاقة الذكية:', contentData.user_name);
  };
}

// Hook لـ Contact - تتبع التواصل
export function useFacebookContact() {
  return async (contactData: {
    contact_method?: string;
    content_name?: string;
    user_name?: string;
    link_type?: string;
  } = {}) => {
    const testData = generateIraqiTestData();
    const location = getUserLocation();
    
    const eventData = {
      event_name: 'Contact',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(testData.email)],
        ph: [await hashData(testData.phone)],
        fn: [await hashData(testData.name.split(' ')[0])],
        ln: [await hashData(testData.name.split(' ')[1] || '')],
        ct: [await hashData(testData.city)],
        country: [await hashData(location.country)]
      },
      custom_data: {
        contact_method: contactData.contact_method || contactData.link_type || 'website',
        content_name: contactData.content_name || `تواصل مع ${contactData.user_name || 'Board Iraq'}`,
        method: contactData.link_type || 'click'
      }
    };

    sendToBrowserPixel('Contact', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('📞 تم تتبع Contact:', contactData.link_type);
  };
}

// Hook لـ AddToWishlist - تتبع الاهتمام العالي
export function useFacebookAddToWishlist() {
  return async (wishlistData: {
    content_name?: string;
    value?: number;
    user_name?: string;
    engagement_score?: number;
  } = {}) => {
    const testData = generateIraqiTestData();
    
    const eventData = {
      event_name: 'AddToWishlist',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(testData.email)],
        ph: [await hashData(testData.phone)],
        fn: [await hashData(testData.name.split(' ')[0])],
        ln: [await hashData(testData.name.split(' ')[1] || '')]
      },
      custom_data: {
        content_type: 'product',
        content_ids: ['smart_card'],
        content_name: wishlistData.content_name || `اهتمام ببطاقة ${wishlistData.user_name || 'ذكية'}`,
        value: wishlistData.value || 11.36, // 15,000 دينار = 11.36 USD
        currency: 'USD',
        engagement_score: wishlistData.engagement_score || 7
      }
    };

    sendToBrowserPixel('AddToWishlist', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('💖 تم تتبع AddToWishlist للمستخدم:', wishlistData.user_name);
  };
}

// Hook لـ InitiateCheckout - تتبع بدء الطلب
export function useFacebookInitiateCheckout() {
  return async (checkoutData: {
    value?: number;
    num_items?: number;
    user_email?: string;
    user_phone?: string;
  } = {}) => {
    const testData = generateIraqiTestData();
    
    const eventData = {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(checkoutData.user_email || testData.email)],
        ph: [await hashData(checkoutData.user_phone || testData.phone)],
        fn: [await hashData(testData.name.split(' ')[0])],
        ln: [await hashData(testData.name.split(' ')[1] || '')]
      },
      custom_data: {
        content_type: 'product',
        content_ids: ['smart_card'],
        value: checkoutData.value || (checkoutData.num_items || 1) * 11.36, // 15,000 دينار = 11.36 USD
        currency: 'USD',
        num_items: checkoutData.num_items || 1,
        content_name: 'طلب بطاقة ذكية Board Iraq'
      }
    };

    sendToBrowserPixel('InitiateCheckout', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('🛒 تم تتبع InitiateCheckout - القيمة:', eventData.custom_data.value);
  };
}

// Hook لـ Purchase - تتبع الشراء الفعلي
export function useFacebookPurchase() {
  return async (purchaseData: {
    value: number;
    order_id?: string;
    num_items?: number;
    user_email?: string;
    user_phone?: string;
    user_name?: string;
  }) => {
    const testData = generateIraqiTestData();
    
    // تحويل السعر إذا كان بالدينار العراقي
    const valueInUSD = purchaseData.value > 1000 ? 
      Math.round((purchaseData.value / 1320) * 100) / 100 : // تحويل من دينار إلى دولار
      purchaseData.value;
    
    const eventData = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(purchaseData.user_email || testData.email)],
        ph: [await hashData(purchaseData.user_phone || testData.phone)],
        fn: [await hashData((purchaseData.user_name || testData.name).split(' ')[0])],
        ln: [await hashData((purchaseData.user_name || testData.name).split(' ')[1] || '')]
      },
      custom_data: {
        content_type: 'product',
        content_ids: ['smart_card'],
        value: valueInUSD,
        currency: 'USD',
        num_items: purchaseData.num_items || 1,
        order_id: purchaseData.order_id || `ORD_${Date.now()}`,
        content_name: 'شراء بطاقة ذكية Board Iraq'
      }
    };

    sendToBrowserPixel('Purchase', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('💰 تم تتبع Purchase - القيمة:', valueInUSD, 'USD');
  };
}

// Hook لـ CompleteRegistration - تتبع التسجيل
export function useFacebookCompleteRegistration() {
  return async (registrationData: {
    registration_method?: string;
    user_email?: string;
    user_phone?: string;
    user_name?: string;
    username?: string;
  } = {}) => {
    const testData = generateIraqiTestData();
    
    const eventData = {
      event_name: 'CompleteRegistration',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        em: [await hashData(registrationData.user_email || testData.email)],
        ph: [await hashData(registrationData.user_phone || testData.phone)],
        fn: [await hashData((registrationData.user_name || testData.name).split(' ')[0])],
        ln: [await hashData((registrationData.user_name || testData.name).split(' ')[1] || '')]
      },
      custom_data: {
        registration_method: registrationData.registration_method || 'website',
        content_name: 'تسجيل حساب Board Iraq',
        username: registrationData.username
      }
    };

    sendToBrowserPixel('CompleteRegistration', eventData.custom_data);
    await sendToConversionsAPI(eventData);
    
    console.log('📝 تم تتبع CompleteRegistration للمستخدم:', registrationData.username);
  };
}

// Hook للتتبع التلقائي لوقت التفاعل (للاهتمام العالي)
export function useFacebookEngagementTracking() {
  const addToWishlist = useFacebookAddToWishlist();
  
  useEffect(() => {
    let startTime = Date.now();
    let scrollDepth = 0;
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      scrollDepth = Math.round((scrolled / (docHeight - winHeight)) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
    };
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      // إذا قضى أكثر من 30 ثانية أو تمرر أكثر من 70% من الصفحة
      if (timeSpent > 30 || maxScrollDepth > 70) {
        const engagementScore = Math.min(10, Math.round((timeSpent / 10) + (maxScrollDepth / 20)));
        
        // تتبع الاهتمام العالي
        addToWishlist({
          content_name: 'اهتمام عالي - تفاعل مطول',
          engagement_score: engagementScore
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [addToWishlist]);
}

// TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}