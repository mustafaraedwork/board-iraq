// src/app/page.tsx - محدث مع تتبع Facebook
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  Share2,
  Eye,
  Star,
  ArrowRight,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

// استيراد Facebook Hooks
import { 
  useFacebookViewContent, 
  useFacebookContact, 
  useFacebookInitiateCheckout,
  useFacebookAddToWishlist,
  useFacebookEngagementTracking
} from '@/lib/facebook-hooks';

export default function HomePage() {
  // تفعيل Facebook Hooks
  const trackViewContent = useFacebookViewContent();
  const trackContact = useFacebookContact();
  const trackInitiateCheckout = useFacebookInitiateCheckout();
  const trackAddToWishlist = useFacebookAddToWishlist();
  
  // تتبع التفاعل التلقائي (وقت التصفح والتمرر)
  useFacebookEngagementTracking();

  // تتبع ViewContent عند زيارة الصفحة الرئيسية
  useEffect(() => {
    trackViewContent({
      content_type: 'website',
      content_ids: ['homepage'],
      content_name: 'الصفحة الرئيسية - Board Iraq',
      value: 11.36, // 15,000 دينار = 11.36 USD
      currency: 'USD'
    });
  }, [trackViewContent]);

  // دالة تتبع النقر على اطلب الآن
  const handleOrderClick = () => {
    trackInitiateCheckout({
      value: 11.36, // 15,000 دينار = 11.36 USD
      num_items: 1
    });
  };

  // دالة تتبع الاهتمام بالمعاينة
  const handlePreviewClick = () => {
    trackAddToWishlist({
      content_name: 'معاينة البطاقة الذكية',
      value: 11.36,
      engagement_score: 8
    });
  };

  // دالة تتبع التواصل
  const handleContactClick = (contactType: string) => {
    trackContact({
      contact_method: contactType,
      content_name: `تواصل عبر ${contactType}`,
      link_type: contactType
    });
  };

  // دالة تتبع الاهتمام بالتسجيل
  const handleRegisterInterest = () => {
    trackAddToWishlist({
      content_name: 'اهتمام بإنشاء حساب',
      value: 11.36,
      engagement_score: 7
    });
  };

  const features = [
    {
      icon: <CreditCard className="h-8 w-8" style={{ color: '#D97757' }} />,
      title: "بطاقة ذكية NFC",
      description: "بطاقة فيزيائية أنيقة مع تقنية NFC وكود QR قابل للتخصيص"
    },
    {
      icon: <Smartphone className="h-8 w-8" style={{ color: '#D97757' }} />,
      title: "صفحة شخصية رقمية",
      description: "رابط خاص بك يعرض جميع معلوماتك وروابطك بتصميم احترافي"
    },
    {
      icon: <BarChart3 className="h-8 w-8" style={{ color: '#D97757' }} />,
      title: "تحليلات مفصلة",
      description: "تتبع عدد الزوار والنقرات لكل رابط مع إحصائيات شاملة"
    },
    {
      icon: <Share2 className="h-8 w-8" style={{ color: '#D97757' }} />,
      title: "مشاركة سهلة",
      description: "شارك صفحتك على جميع منصات التواصل الاجتماعي بنقرة واحدة"
    }
  ];

  const socialPlatforms = [
    "فيسبوك", "إنستجرام", "واتساب", "تيليجرام", 
    "تويتر", "لينكد إن", "سناب شات", "تيك توك"
  ];

  const stats = [
    { number: "2+", label: "سنوات خبرة" },
    { number: "4000+", label: "عميل راضٍ" },
    { number: "24/7", label: "دعم فني" },
    { number: "15,000", label: "دينار فقط" } // 🆕 السعر المحدث
  ];

  const howItWorks = [
    {
      step: "1",
      title: "اطلب بطاقتك",
      description: "اختر التصميم واطلب بطاقتك عبر متجرنا الإلكتروني"
    },
    {
      step: "2",
      title: "خصص صفحتك",
      description: "سجل دخول وأضف معلوماتك وروابطك وخصص التصميم"
    },
    {
      step: "3",
      title: "شارك بسهولة",
      description: "استخدم البطاقة أو كود QR لمشاركة معلوماتك فوراً"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير تسويق",
      company: "شركة النجاح",
      image: "👨‍💼",
      rating: 5,
      text: "بطاقة رائعة وعملية جداً! سهلت علي مشاركة معلوماتي في المؤتمرات والفعاليات."
    },
    {
      name: "سارة علي",
      role: "مصممة جرافيك",
      company: "استوديو الإبداع",
      image: "👩‍💻",
      rating: 5,
      text: "التصميم احترافي والتقنية سريعة. عملائي يحبون سهولة الوصول لأعمالي."
    },
    {
      name: "عمر حسين",
      role: "رجل أعمال",
      company: "مجموعة الخليج",
      image: "👔",
      rating: 5,
      text: "استثمار ممتاز! البطاقة تركت انطباعاً مميزاً لدى شركائي في العمل."
    },
    {
      name: "فاطمة كريم",
      role: "مدربة تطوير",
      company: "أكاديمية المستقبل",
      image: "👩‍🏫",
      rating: 5,
      text: "أداة عصرية لا غنى عنها لكل محترف. التواصل أصبح أسهل بكثير."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
      {/* Header */}
      <header className="backdrop-blur-md shadow-sm sticky top-0 z-50" style={{ backgroundColor: 'rgba(240, 238, 230, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo الجديد */}
            <div className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Board Iraq Logo" 
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg border transition-colors"
                style={{ 
                  borderColor: '#D97757', 
                  color: '#D97757',
                }}
                onClick={() => handleContactClick('login')}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg transition-colors text-white"
                style={{ backgroundColor: '#D97757' }}
                onClick={handleRegisterInterest}
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - محسّن مع animations */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Gradient Background Animation */}
        <div className="absolute inset-0 opacity-10 animate-gradient" style={{
          background: 'linear-gradient(135deg, #D97757 0%, #a8563f 50%, #8b4332 100%)'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge
              className="mb-6 px-4 py-2 text-white border-0 animate-fade-in hover-lift"
              style={{ backgroundColor: '#D97757' }}
            >
              <Star className="h-4 w-4 ml-1" />
              الأول في العراق
            </Badge>
            
            {/* Logo كبير في Hero Section */}
            <div className="mb-8 flex justify-center animate-scale-in">
              <Image
                src="/logo.svg"
                alt="Board Iraq"
                width={112}
                height={112}
                className="h-20 md:h-28 w-auto opacity-90 animate-pulse-subtle"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ color: '#141413', animationDelay: '0.1s' }}>
              بطاقات ذكية
              <span className="block animate-slide-in-right" style={{ color: '#D97757', animationDelay: '0.3s' }}>
                لمستقبل الأعمال
              </span>
            </h1>
            
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: '#141413', opacity: 0.7 }}>
              احصل على بطاقة ذكية مع تقنية NFC وصفحة شخصية رقمية احترافية.
              شارك جميع معلوماتك وروابطك بلمسة واحدة فقط.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/order"
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-smooth hover-lift text-white shadow-lg relative overflow-hidden group"
                style={{ backgroundColor: '#D97757' }}
                onClick={handleOrderClick}
              >
                <span className="relative z-10">
                  اطلب بطاقتك الآن
                  <ArrowRight className="h-5 w-5 mr-2 inline" />
                </span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>

              <Link
                href="/mustafa"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 transition-smooth hover-lift relative overflow-hidden group"
                style={{
                  borderColor: '#D97757',
                  color: '#D97757',
                  backgroundColor: 'transparent'
                }}
                onClick={handlePreviewClick}
              >
                <Eye className="h-5 w-5 ml-2 inline" />
                شاهد المعاينة
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundColor: '#D97757' }}></div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#D97757' }}>
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - محسّن */}
      <section className="py-20 relative" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#141413' }}>
              لماذا تختار بطاقاتنا الذكية؟
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#141413', opacity: 0.7 }}>
              تقنية متطورة وتصميم أنيق لتترك انطباعاً مميزاً في كل لقاء عمل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 border-0 shadow-lg transition-smooth hover-lift cursor-pointer animate-fade-in group"
                style={{
                  backgroundColor: 'white',
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => trackAddToWishlist({
                  content_name: `اهتمام بـ ${feature.title}`,
                  engagement_score: 6
                })}
              >
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#141413' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#141413', opacity: 0.7 }}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#141413' }}>
              كيف تعمل؟
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#141413', opacity: 0.7 }}>
              ثلاث خطوات بسيطة للحصول على بطاقتك الذكية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6"
                  style={{ backgroundColor: '#D97757' }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#141413' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#141413', opacity: 0.7 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - جديد */}
      <section className="py-20" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#141413' }}>
              آراء عملائنا
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#141413', opacity: 0.7 }}>
              اكتشف تجارب عملائنا مع البطاقات الذكية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in"
                style={{
                  backgroundColor: 'white',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardContent className="p-6">
                  {/* الصورة والتقييم */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}
                      >
                        {testimonial.image}
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: '#141413' }}>
                          {testimonial.name}
                        </h4>
                        <p className="text-sm" style={{ color: '#141413', opacity: 0.6 }}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* النجوم */}
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current"
                        style={{ color: '#fbbf24' }}
                      />
                    ))}
                  </div>

                  {/* النص */}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#141413', opacity: 0.7 }}>
                    "{testimonial.text}"
                  </p>

                  {/* الشركة */}
                  <p className="text-xs font-medium" style={{ color: '#D97757' }}>
                    {testimonial.company}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* إحصائيات سريعة */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#D97757' }}>
                4000+
              </div>
              <div className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                عميل سعيد
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#10b981' }}>
                98%
              </div>
              <div className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                رضا العملاء
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
                24/7
              </div>
              <div className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                دعم فني
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#8b5cf6' }}>
                2+
              </div>
              <div className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                سنوات خبرة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-20" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#141413' }}>
              اربط جميع حساباتك
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#141413', opacity: 0.7 }}>
              أضف روابط جميع منصات التواصل الاجتماعي ومواقعك الشخصية
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {socialPlatforms.map((platform, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-lg px-4 py-2 border-2 transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  borderColor: '#D97757', 
                  color: '#D97757',
                  backgroundColor: 'transparent'
                }}
                onClick={() => trackAddToWishlist({
                  content_name: `اهتمام بربط ${platform}`,
                  engagement_score: 5
                })}
              >
                {platform}
              </Badge>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold mb-4" style={{ color: '#141413' }}>
              و العديد من المنصات الأخرى...
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-white"
              style={{ backgroundColor: '#D97757' }}
              onClick={handleRegisterInterest}
            >
              ابدأ الآن مجاناً
              <ArrowRight className="h-5 w-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl p-12 shadow-2xl" style={{ backgroundColor: '#D97757' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              جاهز لتطوير أعمالك؟
            </h2>
            <p className="text-xl mb-8 text-white opacity-90">
              انضم إلى آلاف رجال الأعمال الذين يستخدمون بطاقاتنا الذكية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 border-2 border-white text-white hover:text-white"
                style={{ backgroundColor: 'transparent' }}
                onClick={handleOrderClick}
              >
                اطلب بطاقتك
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 text-white"
                style={{ 
                  backgroundColor: '#141413',
                }}
                onClick={handleRegisterInterest}
              >
                إنشاء حساب مجاني
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: 'rgba(217, 151, 87, 0.2)', backgroundColor: 'rgba(217, 151, 87, 0.03)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              {/* Logo في Footer */}
              <div className="mb-4">
                <Image 
                  src="/logo.svg" 
                  alt="Board Iraq" 
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="mb-4" style={{ color: '#141413', opacity: 0.7 }}>
                الرائدون في مجال البطاقات الذكية والتسويق الرقمي في العراق.
                نساعدك على ترك انطباع مميز واحترافي.
              </p>
              <div className="flex gap-6">
                <button 
                  onClick={() => handleContactClick('website')}
                  className="transition-colors" 
                  style={{ color: '#D97757' }}
                >
                  <Globe className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleContactClick('phone')}
                  className="transition-colors" 
                  style={{ color: '#D97757' }}
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleContactClick('email')}
                  className="transition-colors" 
                  style={{ color: '#D97757' }}
                >
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141413' }}>روابط سريعة</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/order" 
                    className="transition-colors" 
                    style={{ color: '#141413', opacity: 0.7 }}
                    onClick={handleOrderClick}
                  >
                    طلب بطاقة
                  </Link>
                </li>
                <li><Link href="/pricing" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>الأسعار</Link></li>
                <li><Link href="/about" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>من نحن</Link></li>
                <li>
                  <Link 
                    href="/contact" 
                    className="transition-colors" 
                    style={{ color: '#141413', opacity: 0.7 }}
                    onClick={() => handleContactClick('contact_page')}
                  >
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141413' }}>الدعم</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>مركز المساعدة</Link></li>
                <li><Link href="/faq" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>الأسئلة الشائعة</Link></li>
                <li><Link href="/terms" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>الشروط والأحكام</Link></li>
                <li><Link href="/privacy" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>سياسة الخصوصية</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'rgba(217, 151, 87, 0.2)' }}>
            <p style={{ color: '#141413', opacity: 0.7 }}>
              © 2024 Board Iraq. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}