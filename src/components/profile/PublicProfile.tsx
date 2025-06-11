// src/components/profile/PublicProfile.tsx
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

// دالة لتحديد لون النص تلقائياً بناءً على لون الخلفية
const getAutoTextColor = (backgroundColor: string): string => {
  // إذا كان اللون أبيض أو فاتح جداً أو الكريمي الافتراضي
  if (backgroundColor === '#ffffff' || backgroundColor === '#fff' || 
      backgroundColor === 'white' || backgroundColor === '#f8f9fa' ||
      backgroundColor === '#F0EEE6' || backgroundColor === '#f0eee6' ||
      backgroundColor?.includes('255, 255, 255')) {
    return '#141413'; // أسود داكن
  }
  
  // للألوان المتدرجة، استخدم النص الأبيض دائماً
  if (backgroundColor?.includes('gradient') || backgroundColor?.includes('linear-gradient')) {
    return '#ffffff';
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
      
      // إذا كان اللون فاتح (لمعة > 128) استخدم نص أسود داكن، وإلا أبيض
      return brightness > 128 ? '#141413' : '#ffffff';
    }
  }
  
  // للألوان الداكنة الأخرى
  return '#ffffff';
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

  // تحديد لون النص تلقائياً
  const autoTextColor = getAutoTextColor(user.background_color || '#F0EEE6');

  useEffect(() => {
    setIsClient(true);
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

  // دالة تنزيل vCard
  const downloadVCard = () => {
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

  // دالة المشاركة
  const shareProfile = async () => {
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

  const handleLinkClick = async (link: UserLink) => {
    console.log(`نقرة على: ${link.title}`);
    // يمكن إضافة تتبع النقرات هنا لاحقاً
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
              style={{ color: autoTextColor, opacity: 0.8 }}
            >
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>

          {/* الصورة الشخصية الدائرية */}
          <div className="flex flex-col items-center pt-16 pb-8">
            <div className="relative">
              {user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.full_name || user.username}
                  className="w-32 h-32 rounded-full object-cover border-4"
                  style={{ borderColor: `${autoTextColor}33` }}
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4"
                  style={{
                    background: 'linear-gradient(135deg, #a8e6cf 0%, #88c999 50%, #4caf50 100%)',
                    borderColor: `${autoTextColor}33`,
                    color: '#ffffff'
                  }}
                >
                  {(user.full_name || user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* اسم المستخدم */}
            <h1 
              className="text-2xl font-semibold mt-6 mb-2"
              style={{ color: autoTextColor }}
            >
              {user.username}
            </h1>

            {/* المسمى الوظيفي */}
            {user.job_title && (
              <p 
                className="text-lg opacity-90 mb-1"
                style={{ color: autoTextColor }}
              >
                {user.job_title}
              </p>
            )}

            {/* اسم الشركة */}
            {user.company && (
              <p 
                className="text-base font-medium opacity-80 mb-4"
                style={{ color: autoTextColor }}
              >
                {user.company}
              </p>
            )}

            {/* الوصف */}
            {user.bio && (
              <p 
                className="text-center max-w-sm px-6 leading-relaxed opacity-80"
                style={{ color: autoTextColor }}
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
                style={{ color: autoTextColor }}
              >
                {getPlatformIcon(link.platform || '', link.type)}
              </a>
            ))}
          </div>
        </div>

        {/* قائمة الروابط - محدثة مع النص في المنتصف */}
        <div className="px-6 pb-8">
          <div className="space-y-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={formatUrl(link.url, link.type, link.platform)}
                target={link.type === 'email' || link.type === 'phone' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className="block group"
              >
                <div 
                  className="flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]"
                  style={{
                    backgroundColor: user.button_color || '#D97757'
                  }}
                >
                  {/* الأيقونة على اليمين */}
                  <div 
                    className="opacity-90"
                    style={{ color: autoTextColor }}
                  >
                    {getPlatformIcon(link.platform || '', link.type)}
                  </div>

                  {/* النص في المنتصف */}
                  <div className="flex-1 text-center">
                    <span 
                      className="font-medium text-base"
                      style={{ color: autoTextColor }}
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
              style={{ color: autoTextColor, opacity: 0.9 }}
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
          style={{ color: autoTextColor }}
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
            style={{ color: autoTextColor }}
          >
            <Download className="h-4 w-4 ml-2" />
            حفظ جهة اتصال
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={shareProfile}
            className="flex-1 bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
            style={{ color: autoTextColor }}
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