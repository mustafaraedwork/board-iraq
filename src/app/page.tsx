// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Users, 
  BarChart3, 
  QrCode, 
  Share2,
  Eye,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

export default function HomePage() {
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
    { number: "15,000", label: "دينار فقط" }
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
      {/* Header */}
      <header className="backdrop-blur-md shadow-sm sticky top-0 z-50" style={{ backgroundColor: 'rgba(240, 238, 230, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo الجديد */}
            <div className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Board Iraq Logo" 
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
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg transition-colors text-white"
                style={{ backgroundColor: '#D97757' }}
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge 
              className="mb-6 px-4 py-2 text-white border-0"
              style={{ backgroundColor: '#D97757' }}
            >
              <Star className="h-4 w-4 ml-1" />
              الأول في العراق
            </Badge>
            
            {/* Logo كبير في Hero Section */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/logo.svg" 
                alt="Board Iraq" 
                className="h-20 md:h-28 w-auto opacity-90"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#141413' }}>
              بطاقات ذكية 
              <span className="block" style={{ color: '#D97757' }}>
                لمستقبل الأعمال
              </span>
            </h1>
            
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: '#141413', opacity: 0.7 }}>
              احصل على بطاقة ذكية مع تقنية NFC وصفحة شخصية رقمية احترافية.
              شارك جميع معلوماتك وروابطك بلمسة واحدة فقط.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/order"
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 text-white shadow-lg"
                style={{ backgroundColor: '#D97757' }}
              >
                اطلب بطاقتك الآن
                <ArrowRight className="h-5 w-5 mr-2 inline" />
              </Link>
              
              <Link
                href="/mustafa"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 transition-all transform hover:scale-105"
                style={{ 
                  borderColor: '#D97757', 
                  color: '#D97757',
                  backgroundColor: 'transparent'
                }}
              >
                <Eye className="h-5 w-5 ml-2 inline" />
                شاهد المعاينة
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

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#141413' }}>
              لماذا تختار بطاقاتنا الذكية؟
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#141413', opacity: 0.7 }}>
              تقنية متطورة وتصميم أنيق لتترك انطباعاً مميزاً في كل لقاء عمل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ backgroundColor: 'white' }}>
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
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

      {/* Social Platforms */}
      <section className="py-20" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
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
                className="text-lg px-4 py-2 border-2 transition-all hover:scale-105"
                style={{ 
                  borderColor: '#D97757', 
                  color: '#D97757',
                  backgroundColor: 'transparent'
                }}
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
              >
                اطلب بطاقتك
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 text-white"
                style={{ 
                  backgroundColor: '#141413',
                }}
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
                <img 
                  src="/logo.svg" 
                  alt="Board Iraq" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="mb-4" style={{ color: '#141413', opacity: 0.7 }}>
                الرائدون في مجال البطاقات الذكية والتسويق الرقمي في العراق.
                نساعدك على ترك انطباع مميز واحترافي.
              </p>
              <div className="flex gap-6">
                <a href="#" className="transition-colors" style={{ color: '#D97757' }}>
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="transition-colors" style={{ color: '#D97757' }}>
                  <Phone className="h-5 w-5" />
                </a>
                <a href="#" className="transition-colors" style={{ color: '#D97757' }}>
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141413' }}>روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/order" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>طلب بطاقة</Link></li>
                <li><Link href="/pricing" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>الأسعار</Link></li>
                <li><Link href="/about" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>من نحن</Link></li>
                <li><Link href="/contact" className="transition-colors" style={{ color: '#141413', opacity: 0.7 }}>تواصل معنا</Link></li>
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