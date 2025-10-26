// src/components/profile/PublicProfile.tsx - إصلاح عرض الصور من Storage
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { User, UserLink } from '@/lib/types';
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Download, 
  Share2,
  Eye,
  ExternalLink,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTelegram, 
  FaTwitter, 
  FaLinkedin, 
  FaSnapchat, 
  FaTiktok, 
  FaYoutube,
  FaFilePdf
} from 'react-icons/fa';

// استيراد Facebook Hooks
import { 
  useFacebookViewContent, 
  useFacebookContact, 
  useFacebookAddToWishlist,
  useFacebookEngagementTracking
} from '@/lib/facebook-hooks';

interface PublicProfileProps {
  user: User;
  links: UserLink[];
}

// ايقونات المنصات
const getPlatformIcon = (platform: string, type: string) => {
  const iconClass = "h-5 w-5";
  
  switch (platform || type) {
    case 'facebook': return <FaFacebook className={iconClass} />;
    case 'instagram': return <FaInstagram className={iconClass} />;
    case 'whatsapp': return <FaWhatsapp className={iconClass} />;
    case 'telegram': return <FaTelegram className={iconClass} />;
    case 'twitter': return <FaTwitter className={iconClass} />;
    case 'linkedin': return <FaLinkedin className={iconClass} />;
    case 'snapchat': return <FaSnapchat className={iconClass} />;
    case 'tiktok': return <FaTiktok className={iconClass} />;
    case 'youtube': return <FaYoutube className={iconClass} />;
    case 'phone': return <Phone className={iconClass} />;
    case 'email': return <Mail className={iconClass} />;
    case 'website': return <Globe className={iconClass} />;
    case 'pdf': return <FaFilePdf className={iconClass} />;
    case 'file': return <FileText className={iconClass} />;
    case 'location': return <MapPin className={iconClass} />;
    default: return <ExternalLink className={iconClass} />;
  }
};

// 🔥 دالة معالجة URL الصور من Supabase Storage
const getProfileImageUrl = (user: User): string | null => {
  if (!user.profile_image_url) {
    return null;
  }

  // إذا كانت الصورة base64 (النظام القديم)
  if (user.profile_image_url.startsWith('data:')) {
    return user.profile_image_url;
  }

  // إذا كانت URL كاملة من Supabase Storage (النظام الجديد)
  if (user.profile_image_url.startsWith('https://')) {
    return user.profile_image_url;
  }

  // إذا كانت مجرد اسم ملف، بناء URL كامل
  if (user.profile_image_url.includes('profiles/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://icqvknhbhnsllnkpajmo.supabase.co';
    return `${supabaseUrl}/storage/v1/object/public/profile-images/${user.profile_image_url}`;
  }

  // إذا كان اسم ملف فقط، بناء المسار الكامل
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://icqvknhbhnsllnkpajmo.supabase.co';
  return `${supabaseUrl}/storage/v1/object/public/profile-images/profiles/${user.profile_image_url}`;
};

// 🔥 إصلاح دالة تحديد لون النص - أعطي الأولوية لـ user.text_color
const getTextColor = (user: User): string => {
  // 🎯 إذا كان المستخدم حدد لون نص مخصص، استخدمه مباشرة
  if (user.text_color && user.text_color !== '#000000' && user.text_color !== '#ffffff') {
    return user.text_color;
  }
  
  // إذا لم يحدد لون مخصص، احسب اللون تلقائياً
  const backgroundColor = user.background_color || '#F0EEE6';
  
  // إذا كان اللون أبيض أو فاتح جداً أو الكريمي الافتراضي
  if (backgroundColor === '#ffffff' || backgroundColor === '#fff' || 
      backgroundColor === 'white' || backgroundColor === '#f8f9fa' ||
      backgroundColor === '#F0EEE6' || backgroundColor === '#f0eee6' ||
      backgroundColor?.includes('255, 255, 255')) {
    return user.text_color || '#141413'; // استخدم لون المستخدم أو أسود داكن
  }
  
  // للألوان المتدرجة، استخدم النص الأبيض دائماً أو لون المستخدم
  if (backgroundColor?.includes('gradient') || backgroundColor?.includes('linear-gradient')) {
    return user.text_color || '#ffffff';
  }
  
  // إذا كان اللون hex
  if (backgroundColor?.startsWith('#')) {
    const hex = backgroundColor.replace('#', '');
    if (hex.length >= 6) {
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // حساب اللمعة (brightness)
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      // إذا كان اللون فاتح (لمعة > 128) استخدم لون المستخدم أو نص أسود داكن، وإلا أبيض أو لون المستخدم
      return user.text_color || (brightness > 128 ? '#141413' : '#ffffff');
    }
  }
  
  // للألوان الداكنة الأخرى
  return user.text_color || '#ffffff';
};

// تنسيق الروابط
const formatUrl = (url: string, type: string, platform?: string): string => {
  if (type === 'phone') {
    return `tel:${url}`;
  }
  if (type === 'email') {
    return `mailto:${url}`;
  }
  if (type === 'whatsapp') {
    return `https://wa.me/${url.replace(/\D/g, '')}`;
  }
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

export default function PublicProfile({ user, links }: PublicProfileProps) {
  const [isClient, setIsClient] = useState(false);
  const [visitCount, setVisitCount] = useState(user.total_visits || 0);
  const [imageError, setImageError] = useState(false); // 🔥 تتبع أخطاء تحميل الصور
  const [imageLoading, setImageLoading] = useState(true); // Loading state للصورة
  const [isVisible, setIsVisible] = useState(false); // للـ animations

  // تفعيل Facebook Hooks
  const trackViewContent = useFacebookViewContent();
  const trackContact = useFacebookContact();
  const trackAddToWishlist = useFacebookAddToWishlist();
  
  // تتبع التفاعل التلقائي (وقت التصفح والتمرر)
  useFacebookEngagementTracking();

  // 🔥 استخدام الدالة المحدثة لتحديد لون النص
  const textColor = getTextColor(user);
  
  // 🔥 الحصول على URL الصورة الصحيح
  const profileImageUrl = getProfileImageUrl(user);

  // تتبع ViewContent عند زيارة البطاقة
  useEffect(() => {
    trackViewContent({
      content_type: 'profile',
      content_ids: [user.username],
      content_name: `بطاقة ${user.full_name || user.username}`,
      value: 11.36, // 15,000 دينار = 11.36 USD
      currency: 'USD',
      user_name: user.full_name || user.username
    });
  }, [trackViewContent, user.username, user.full_name]);

  useEffect(() => {
    setIsClient(true);

    // تفعيل animations
    setTimeout(() => setIsVisible(true), 100);

    // تسجيل الزيارة
    const updateVisitCount = async () => {
      try {
        const response = await fetch(`/api/visits/${user.username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });

        if (response.ok) {
          setVisitCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('خطأ في تسجيل الزيارة:', error);
      }
    };

    updateVisitCount();
  }, [user.username]);

  // دالة تنزيل vCard مع تتبع Facebook
  const downloadVCard = () => {
    // تتبع الاهتمام بحفظ جهة الاتصال
    trackAddToWishlist({
      content_name: `حفظ جهة اتصال ${user.full_name || user.username}`,
      value: 11.36,
      user_name: user.full_name || user.username,
      engagement_score: 8
    });

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.full_name || user.username}
ORG:${user.company || ''}
TITLE:${user.job_title || ''}
TEL:${user.phone || ''}
EMAIL:${user.email || ''}
URL:${window.location.origin}/${user.username}
NOTE:${user.bio || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.username}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // دالة المشاركة مع تتبع Facebook
  const shareProfile = async () => {
    // تتبع مشاركة البطاقة
    trackContact({
      contact_method: 'share',
      content_name: `مشاركة بطاقة ${user.full_name || user.username}`,
      user_name: user.full_name || user.username,
      link_type: 'share'
    });

    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.full_name || user.username} - Board Iraq`,
          text: user.bio || `تواصل مع ${user.full_name || user.username}`,
          url: url,
        });
      } catch (error) {
        console.log('تم إلغاء المشاركة');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    }
  };

  // دالة تتبع النقر على الروابط مع Facebook
  const handleLinkClick = async (link: UserLink) => {
    console.log(`نقرة على: ${link.title}`);
    
    // تتبع Contact في Facebook
    trackContact({
      contact_method: link.platform || link.type,
      content_name: `${link.title} - ${user.full_name || user.username}`,
      user_name: user.full_name || user.username,
      link_type: link.platform || link.type
    });

    // إضافة تأخير صغير لضمان إرسال الحدث
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  // تتبع النقر على رابط الطلب
  const handleOrderClick = () => {
    trackAddToWishlist({
      content_name: `اهتمام بطلب بطاقة من ${user.full_name || user.username}`,
      value: 11.36,
      user_name: user.full_name || user.username,
      engagement_score: 9
    });
  };

  // 🔥 معالجة أخطاء تحميل الصور
  const handleImageError = () => {
    console.warn('فشل في تحميل الصورة الشخصية:', profileImageUrl);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('تم تحميل الصورة بنجاح:', profileImageUrl);
    setImageLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        background: user.background_color?.includes('gradient') 
          ? user.background_color 
          : undefined,
        backgroundColor: !user.background_color?.includes('gradient') 
          ? (user.background_color || '#F0EEE6') 
          : undefined
      }}
    >
      {/* المحتوى الرئيسي */}
      <div className="flex-1">
        {/* Header مع القائمة */}
        <div className="relative">
          {/* أيقونة القائمة في الأعلى اليسار */}
          <div className="absolute top-6 left-6 z-10">
            <button 
              className="transition-colors"
              style={{ color: textColor, opacity: 0.8 }}
              onClick={() => trackAddToWishlist({
                content_name: `تفاعل مع قائمة ${user.full_name || user.username}`,
                engagement_score: 5
              })}
            >
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>

          {/* الصورة الشخصية الدائرية - 🔥 محسّنة مع loading state */}
          <div className={`flex flex-col items-center pt-16 pb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Loading skeleton */}
              {imageLoading && profileImageUrl && !imageError && (
                <div
                  className="absolute inset-0 w-32 h-32 rounded-full animate-pulse"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.2)' }}
                ></div>
              )}

              {profileImageUrl && !imageError ? (
                <img
                  src={profileImageUrl}
                  alt={user.full_name || user.username}
                  className={`w-32 h-32 rounded-full object-cover border-4 transition-all duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100 hover:scale-105'}`}
                  style={{ borderColor: `${textColor}33` }}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 animate-scale-in hover:scale-105 transition-transform duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #D97757 0%, #a8563f 50%, #8b4332 100%)',
                    borderColor: `${textColor}33`,
                    color: '#ffffff'
                  }}
                >
                  {(user.full_name || user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* اسم الكامل - محسّن مع animation */}
            <h1
              className={`text-2xl font-semibold mt-6 mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ color: textColor, transitionDelay: '0.1s' }}
            >
              {user.full_name || user.username}
            </h1>

            {/* المسمى الوظيفي - محسّن مع animation */}
            {user.job_title && (
              <p
                className={`text-lg opacity-90 mb-1 transition-all duration-700 ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ color: textColor, transitionDelay: '0.2s' }}
              >
                {user.job_title}
              </p>
            )}

            {/* اسم الشركة - محسّن مع animation */}
            {user.company && (
              <p
                className={`text-base font-medium opacity-80 mb-4 transition-all duration-700 ${isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ color: textColor, transitionDelay: '0.3s' }}
              >
                {user.company}
              </p>
            )}

            {/* الوصف - محسّن مع animation */}
            {user.bio && (
              <p
                className={`text-center max-w-sm px-6 leading-relaxed opacity-80 transition-all duration-700 ${isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ color: textColor, transitionDelay: '0.4s' }}
              >
                {user.bio}
              </p>
            )}
          </div>

          {/* الأيقونات السريعة */}
          <div className="flex justify-center space-x-8 pb-8">
            {links.slice(0, 3).map((link, index) => (
              <a
                key={index}
                href={formatUrl(link.url, link.type, link.platform)}
                target={link.type === 'email' || link.type === 'phone' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="transition-colors opacity-80 hover:opacity-100"
                style={{ color: textColor }}
                onClick={() => handleLinkClick(link)}
              >
                {getPlatformIcon(link.platform || '', link.type)}
              </a>
            ))}
          </div>
        </div>

        {/* قائمة الروابط - محسّنة مع animations */}
        <div className="px-6 pb-8">
          <div className="space-y-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={formatUrl(link.url, link.type, link.platform)}
                target={link.type === 'email' || link.type === 'phone' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className={`block group transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
              >
                <div
                  className="flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-active:scale-[0.98] relative overflow-hidden"
                  style={{
                    backgroundColor: user.button_color || '#D97757'
                  }}
                >
                  {/* تأثير Ripple */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                  {/* الأيقونة على اليمين */}
                  <div
                    className="opacity-90 transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                    style={{ color: textColor }}
                  >
                    {getPlatformIcon(link.platform || '', link.type)}
                  </div>

                  {/* النص في المنتصف */}
                  <div className="flex-1 text-center relative z-10">
                    <span
                      className="font-medium text-base"
                      style={{ color: textColor }}
                    >
                      {link.title}
                    </span>
                  </div>

                  {/* فراغ للموازنة مع الجانب الآخر */}
                  <div className="w-5 opacity-0">
                    <MoreHorizontal className="h-5 w-5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer مع رابط التطبيق - دائماً في الأسفل */}
      <div className="px-6 pb-6 mt-auto">
        <a 
          href={process.env.NEXT_PUBLIC_SHOP_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onClick={handleOrderClick}
        >
          <div 
            className="flex items-center justify-center px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="font-medium text-center"
              style={{ color: textColor, opacity: 0.9 }}
            >
              ⚡ إذا أعجبك الكارد اطلبه من هنا ⚡
            </span>
          </div>
        </a>
      </div>

      {/* Cookie Preferences */}
      <div className="px-6 pb-6">
        <button 
          className="text-sm transition-colors opacity-40 hover:opacity-60"
          style={{ color: textColor }}
        >
          Cookie Preferences
        </button>
      </div>

      {/* أزرار الإجراءات (مخفية - يمكن إظهارها لاحقاً) */}
      {isClient && (
        <div className="fixed bottom-4 left-4 right-4 flex space-x-3 opacity-0 pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadVCard}
            className="flex-1 bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
            style={{ color: textColor }}
          >
            <Download className="h-4 w-4 ml-2" />
            حفظ جهة اتصال
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={shareProfile}
            className="flex-1 bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
            style={{ color: textColor }}
          >
            <Share2 className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
        </div>
      )}

      {/* عداد الزيارات (مخفي - يمكن إظهاره لاحقاً) */}
      {isClient && (
        <div className="fixed bottom-20 right-4 opacity-0 pointer-events-none">
          <div className="flex items-center text-sm bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
            <Eye className="h-4 w-4 ml-1" />
            {visitCount}
          </div>
        </div>
      )}
    </div>
  );
}