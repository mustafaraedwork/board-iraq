// src/app/dashboard/page.tsx - محدث بالهوية البصرية الجديدة مع الاحتفاظ على جميع الوظائف
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthService } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  QrCode, 
  Download, 
  Plus,
  BarChart3,
  Users,
  MousePointer,
  Trash2,
  ExternalLink,
  GripVertical,
  Copy
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserService } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import AddLinkForm from '@/components/dashboard/AddLinkForm';
import EditProfileForm from '@/components/dashboard/EditProfileForm';
import type { User, UserLink } from '@/lib/types';
import QRCode from 'qrcode';

// مكون الرابط القابل للسحب
interface SortableLinkProps {
  link: UserLink;
  onDelete: (id: string) => void;
}

function SortableLink({ link, onDelete }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor: 'rgba(217, 151, 87, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      className={`flex items-center justify-between p-4 border rounded-lg group hover:shadow-md transition-all ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center space-x-3 space-x-reverse flex-1">
        <div 
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#D97757' }}
        >
          <span className="text-white text-sm">
            {link.type === 'phone' ? '📱' : 
             link.type === 'email' ? '✉️' : 
             link.type === 'website' ? '🌐' : 
             link.platform === 'whatsapp' ? '💬' : 
             link.platform === 'facebook' ? '📘' : 
             link.platform === 'instagram' ? '📷' :
             link.platform === 'telegram' ? '✈️' : '🔗'}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-medium" style={{ color: '#141413' }}>{link.title}</p>
          <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>{link.type} • {link.url}</p>
          <p className="text-xs" style={{ color: '#141413', opacity: 0.5 }}>تم النقر {link.click_count} مرة</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="outline" style={{ borderColor: '#D97757', color: '#D97757' }}>
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDelete(link.id)}
          style={{ borderColor: '#dc2626', color: '#dc2626' }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" style={{ borderColor: '#D97757', color: '#D97757' }}>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<UserLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // إعداد Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // تحميل بيانات المستخدم مع useCallback
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // الحصول على المستخدم المُسجل من localStorage
      const loggedInUser = AuthService.getUser();
      
      if (!loggedInUser) {
        // إذا لم يكن هناك مستخدم مُسجل، توجيه لصفحة تسجيل الدخول
        router.push('/login');
        return;
      }

      console.log('🔍 تحميل بيانات المستخدم:', loggedInUser.username);
      
      // جلب بيانات المستخدم الحقيقي من قاعدة البيانات
      const userData = await UserService.getUserByUsername(loggedInUser.username);
      
      if (userData) {
        setUser(userData);
        
        // جلب الروابط للمستخدم الحقيقي
        const userLinks = await UserService.getUserLinks(userData.id);
        setLinks(userLinks);
        
        // توليد QR Code للمستخدم الحقيقي
        const profileUrl = `${window.location.origin}/${userData.username}`;
        const qrCode = await QRCode.toDataURL(profileUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrCode);
        
        console.log('✅ تم تحميل بيانات المستخدم بنجاح:', userData.username);
      } else {
        console.error('❌ لم يتم العثور على المستخدم في قاعدة البيانات');
        // إذا لم يوجد المستخدم في قاعدة البيانات، مسح الجلسة
        AuthService.logout();
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // تحميل بيانات المستخدم
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleAddLink = async (linkData: {
    type: string;
    platform?: string;
    title: string;
    url: string;
  }) => {
    if (!user) return;

    try {
      const result = await UserService.addUserLink(user.id, linkData);
      
      if (result.success) {
        // إعادة تحميل الروابط
        const updatedLinks = await UserService.getUserLinks(user.id);
        setLinks(updatedLinks);
        alert('تم إضافة الرابط بنجاح!');
      } else {
        console.error('Error adding link:', result.error);
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('خطأ في إضافة الرابط');
    }
  };

  const handleEditProfile = async (profileData: {
    full_name?: string;
    job_title?: string;
    company?: string;
    bio?: string;
    email?: string;
    phone?: string;
    background_color?: string;
    text_color?: string;
    button_color?: string;
  }) => {
    if (!user) return;

    try {
      // تحديث البيانات في قاعدة البيانات
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        alert(`خطأ: ${error.message}`);
        return;
      }

      if (!data) {
        console.error('No data returned from update');
        alert('خطأ في تحديث الملف الشخصي');
        return;
      }

      // تحديث البيانات المحلية
      setUser({ ...user, ...profileData });
      alert('تم تحديث الملف الشخصي بنجاح!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('خطأ في تحديث الملف الشخصي');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over?.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // تحديث ترتيب الروابط في قاعدة البيانات
      try {
        const linkUpdates = newLinks.map((link, index) => ({
          id: link.id,
          sort_order: index + 1
        }));

        const result = await UserService.updateLinksOrder(linkUpdates);
        if (!result.success) {
          console.error('Error updating links order:', result.error);
          // إعادة الترتيب السابق في حالة الخطأ
          setLinks(links);
          alert(`خطأ في تحديث الترتيب: ${result.error}`);
        }
      } catch (error) {
        console.error('Error updating links order:', error);
        // إعادة الترتيب السابق في حالة الخطأ
        setLinks(links);
        alert('خطأ في تحديث ترتيب الروابط');
      }
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return;

    try {
      const result = await UserService.deleteUserLink(linkId);
      
      if (result.success) {
        // إعادة تحميل الروابط
        if (user) {
          const updatedLinks = await UserService.getUserLinks(user.id);
          setLinks(updatedLinks);
        }
        alert('تم حذف الرابط بنجاح!');
      } else {
        console.error('Error deleting link:', result.error);
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('خطأ في حذف الرابط');
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !user) return;

    const link = document.createElement('a');
    link.download = `${user.username}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const openProfile = () => {
    if (user) {
      window.open(`/${user.username}`, '_blank');
    }
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      AuthService.logout();
    }
  };

  const copyProfileLink = async () => {
    if (!user) return;
    
    const profileUrl = `boardiraq.com/${user.username}`;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      alert('تم نسخ الرابط بنجاح!');
    } catch (error) {
      console.error('Error copying link:', error);
      // Fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ الرابط بنجاح!');
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: '#F0EEE6' }}
        dir="rtl"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#D97757' }}
          ></div>
          <p style={{ color: '#141413' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: '#F0EEE6' }}
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">لم يتم العثور على المستخدم</p>
          <Button 
            onClick={() => router.push('/login')}
            className="text-white border-0"
            style={{ backgroundColor: '#D97757' }}
          >
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
      {/* Header */}
      <header 
        className="shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Board Iraq Logo" 
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openProfile}
                style={{ borderColor: '#D97757', color: '#D97757' }}
                className="ml-2"
              >
                <Eye className="h-4 w-4 ml-2" />
                معاينة الصفحة
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                style={{ borderColor: '#141413', color: '#141413' }}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - محسّنة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in cursor-pointer"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.1s' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #D97757 0%, #a8563f 100%)'
                  }}
                >
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>إجمالي الزيارات</p>
                  <p className="text-3xl font-bold" style={{ color: '#141413' }}>{user.total_visits}</p>
                  <p className="text-xs mt-1" style={{ color: '#10b981' }}>+12% هذا الأسبوع</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in cursor-pointer"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.2s' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }}
                >
                  <MousePointer className="h-7 w-7 text-white" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>إجمالي النقرات</p>
                  <p className="text-3xl font-bold" style={{ color: '#141413' }}>{user.total_clicks}</p>
                  <p className="text-xs mt-1" style={{ color: '#10b981' }}>+8% هذا الأسبوع</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in cursor-pointer"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.3s' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                  }}
                >
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>عدد الروابط</p>
                  <p className="text-3xl font-bold" style={{ color: '#141413' }}>{links.length}</p>
                  <p className="text-xs mt-1" style={{ color: '#3b82f6' }}>نشط</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card - محسّنة */}
          <Card
            className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.4s' }}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center justify-between"
                style={{ color: '#141413' }}
              >
                معلومات الملف الشخصي
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditProfile(true)}
                  className="transition-smooth hover:scale-105"
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                >
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #D97757 0%, #a8563f 100%)',
                    boxShadow: '0 4px 12px rgba(217, 151, 87, 0.3)'
                  }}
                >
                  <span className="text-white text-xl font-bold">
                    {user.full_name?.charAt(0) || user.username.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: '#141413' }}>
                    {user.full_name || user.username}
                  </h3>
                  <p style={{ color: '#141413', opacity: 0.7 }}>{user.job_title}</p>
                  <p className="text-sm" style={{ color: '#141413', opacity: 0.5 }}>{user.company}</p>
                </div>
              </div>
              
              <div className="border-t pt-4" style={{ borderColor: 'rgba(217, 151, 87, 0.2)' }}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p style={{ color: '#141413', opacity: 0.7 }}>اسم المستخدم</p>
                    <p className="font-medium" style={{ color: '#141413' }}>{user.username}</p>
                  </div>
                  <div>
                    <p style={{ color: '#141413', opacity: 0.7 }}>رابط الصفحة</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <p className="font-medium" style={{ color: '#D97757' }}>boardiraq.com/{user.username}</p>
                      <button 
                        onClick={copyProfileLink}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        title="نسخ الرابط"
                      >
                        <Copy className="h-3 w-3" style={{ color: '#D97757' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card - محسّنة */}
          <Card
            className="border-0 shadow-lg transition-smooth hover-lift animate-fade-in"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.5s' }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center"
                style={{ color: '#141413' }}
              >
                <QrCode className="h-5 w-5 ml-2" style={{ color: '#D97757' }} />
                كود QR الخاص بك
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div
                className="w-48 h-48 border-2 rounded-xl mx-auto flex items-center justify-center p-4 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'rgba(217, 151, 87, 0.3)'
                }}
              >
                {qrCodeUrl ? (
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="text-center">
                    <QrCode className="h-12 w-12 mx-auto mb-2 animate-pulse" style={{ color: '#D97757' }} />
                    <p className="text-sm" style={{ color: '#141413', opacity: 0.5 }}>جاري إنشاء الكود...</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Button
                  className="w-full text-white border-0 transition-smooth hover-lift"
                  onClick={downloadQRCode}
                  style={{ backgroundColor: '#D97757' }}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل كود QR
                </Button>
                <p className="text-xs text-center" style={{ color: '#141413', opacity: 0.5 }}>
                  هذا هو الكود المطبوع على بطاقتك
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links Section - محسّنة */}
        <Card
          className="mt-8 border-0 shadow-lg transition-smooth animate-fade-in"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.6s' }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center justify-between"
              style={{ color: '#141413' }}
            >
              الروابط والمعلومات ({links.length})
              <Button
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="text-white border-0 transition-smooth hover-lift"
                style={{ backgroundColor: '#D97757' }}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة رابط
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-4">
                {links.length > 0 ? (
                  <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
                    {links.map((link: UserLink) => (
                      <SortableLink 
                        key={link.id} 
                        link={link} 
                        onDelete={handleDeleteLink}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center"
                    style={{ borderColor: 'rgba(217, 151, 87, 0.4)' }}
                  >
                    <Plus className="h-8 w-8 mx-auto mb-2" style={{ color: '#D97757' }} />
                    <p className="mb-2" style={{ color: '#141413', opacity: 0.5 }}>لا توجد روابط بعد</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(true)}
                      style={{ borderColor: '#D97757', color: '#D97757' }}
                    >
                      إضافة أول رابط
                    </Button>
                  </div>
                )}
              </div>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Form Modal */}
      {showEditProfile && user && (
        <EditProfileForm
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleEditProfile}
        />
      )}

      {/* Add Link Form Modal */}
      {showAddForm && (
        <AddLinkForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddLink}
        />
      )}
    </div>
  );
}