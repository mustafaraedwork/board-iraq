// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  QrCode, 
  Download, 
  Settings, 
  Plus,
  BarChart3,
  Users,
  MousePointer,
  Trash2,
  ExternalLink,
  GripVertical
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
      style={style}
      className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg group hover:border-gray-300 bg-white ${
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
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
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
          <p className="font-medium">{link.title}</p>
          <p className="text-sm text-gray-600">{link.type} • {link.url}</p>
          <p className="text-xs text-gray-500">تم النقر {link.click_count} مرة</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="outline">
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDelete(link.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline">
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

  // تحميل بيانات المستخدم
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
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
  };

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
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
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
        alert(`خطأ: ${error.message}`);
        return;
      }

      // تحديث البيانات المحلية
      setUser({ ...user, ...profileData });
      alert('تم تحديث الملف الشخصي بنجاح!');
    } catch (error) {
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
          // إعادة الترتيب السابق في حالة الخطأ
          setLinks(links);
          alert(`خطأ في تحديث الترتيب: ${result.error}`);
        }
      } catch (error) {
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
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 mb-4">لم يتم العثور على المستخدم</p>
          <Button onClick={() => router.push('/login')}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              مرحباً، {user.full_name || user.username}
            </h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button variant="outline" size="sm" onClick={openProfile}>
                <Eye className="h-4 w-4 ml-2" />
                معاينة الصفحة
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">إجمالي الزيارات</p>
                  <p className="text-2xl font-bold text-gray-900">{user.total_visits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MousePointer className="h-8 w-8 text-green-600" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">إجمالي النقرات</p>
                  <p className="text-2xl font-bold text-gray-900">{user.total_clicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">عدد الروابط</p>
                  <p className="text-2xl font-bold text-gray-900">{links.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                معلومات الملف الشخصي
                <Button size="sm" variant="outline" onClick={() => setShowEditProfile(true)}>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user.full_name?.charAt(0) || user.username.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user.full_name || user.username}</h3>
                  <p className="text-gray-600">{user.job_title}</p>
                  <p className="text-sm text-gray-500">{user.company}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">اسم المستخدم</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">رابط الصفحة</p>
                    <p className="font-medium text-blue-600">boardiraq.com/{user.username}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 ml-2" />
                كود QR الخاص بك
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-48 h-48 bg-white border border-gray-200 rounded-lg mx-auto flex items-center justify-center p-4">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">جاري إنشاء الكود...</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" variant="outline" onClick={downloadQRCode}>
                  <Download className="h-4 w-4 ml-2" />
                  تحميل كود QR
                </Button>
                <p className="text-xs text-gray-500">
                  هذا هو الكود المطبوع على بطاقتك
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              الروابط والمعلومات ({links.length})
              <Button size="sm" onClick={() => setShowAddForm(true)}>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">لا توجد روابط بعد</p>
                    <Button variant="outline" onClick={() => setShowAddForm(true)}>
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