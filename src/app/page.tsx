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
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: "بطاقة ذكية NFC",
      description: "بطاقة فيزيائية أنيقة مع تقنية NFC وكود QR قابل للتخصيص"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      title: "صفحة شخصية رقمية",
      description: "رابط خاص بك يعرض جميع معلوماتك وروابطك بتصميم احترافي"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "تحليلات مفصلة",
      description: "تتبع عدد الزوار والنقرات لكل رابط مع إحصائيات شاملة"
    },
    {
      icon: <Share2 className="h-8 w-8 text-orange-600" />,
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
    { number: "1000+", label: "عميل راضٍ" },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Board Iraq</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  تسجيل الدخول
                </Button>
              </Link>
              <a href={process.env.NEXT_PUBLIC_SHOP_URL || "#"} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  اطلب بطاقتك
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Star className="h-4 w-4 ml-1" />
              الأكثر مبيعاً في العراق
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              بطاقتك الذكية
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                في لمسة واحدة
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              بطاقة NFC ذكية مع صفحة شخصية قابلة للتخصيص تجمع جميع معلوماتك وروابطك في مكان واحد. 
              شارك معلوماتك بطريقة احترافية وحديثة.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href={process.env.NEXT_PUBLIC_SHOP_URL || "#"} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-3">
                  اطلب بطاقتك الآن
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </a>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Eye className="ml-2 h-5 w-5" />
                  شاهد عينة
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار Board Iraq؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نوفر لك حلول تقنية متطورة لمشاركة معلوماتك بطريقة عصرية واحترافية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              دعم لجميع منصات التواصل
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اربط جميع حساباتك على مواقع التواصل الاجتماعي في مكان واحد
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <span className="text-gray-700 font-medium">{platform}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              + الهاتف، الإيميل، الموقع الإلكتروني، الملفات، والمزيد...
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              كيف يعمل؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للحصول على بطاقتك الذكية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            جاهز لبدء رحلتك الرقمية؟
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            احصل على بطاقتك الذكية اليوم واجعل التواصل أسهل وأكثر احترافية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={process.env.NEXT_PUBLIC_SHOP_URL || "#"} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                اطلب الآن - {process.env.NEXT_PUBLIC_CARD_PRICE || '15,000'} د.ع
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </a>
            <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@boardiraq.com'}`}>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                تواصل معنا
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Board Iraq</span>
              </div>
              <p className="text-gray-400">
                بطاقات ذكية قابلة للتخصيص لتسهيل التواصل المهني
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">الرئيسية</Link></li>
                <li><Link href="/login" className="hover:text-white">تسجيل الدخول</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">لوحة التحكم</Link></li>
                <li><a href="#" className="hover:text-white">الدعم الفني</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">الخدمات</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">بطاقات NFC</a></li>
                <li><a href="#" className="hover:text-white">صفحات شخصية</a></li>
                <li><a href="#" className="hover:text-white">تحليلات</a></li>
                <li><a href="#" className="hover:text-white">تصميم مخصص</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="h-4 w-4" />
                  <span>{process.env.NEXT_PUBLIC_CONTACT_PHONE || '+964 XXX XXX XXXX'}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Mail className="h-4 w-4" />
                  <span>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@boardiraq.com'}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Globe className="h-4 w-4" />
                  <span>{process.env.NEXT_PUBLIC_SITE_URL || 'boardiraq.com'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Board Iraq. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}