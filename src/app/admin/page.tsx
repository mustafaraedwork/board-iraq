// src/app/admin/page.tsx - Enhanced Admin Dashboard (Updated with New Brand Identity)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Calendar,
  Globe,
  MousePointer,
  Mail,
  Phone,
  ExternalLink,
  Activity,
  Clock,
  Star,
  UserCheck,
  Settings,
  FileText,
  Target,
  User,
  Archive
} from 'lucide-react';
import { type BatchUser } from '@/lib/supabase/batch-users';
import { 
  createBatchUsers, 
  downloadCSV, 
  downloadQRCodesZip, 
  downloadAllQRCodes 
} from '@/lib/supabase/batch-users';
import { AuthService, AdminService } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

// تعريف الأنواع
interface DetailedUser {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  bio?: string;
  total_visits: number;
  total_clicks: number;
  is_active: boolean;
  is_premium: boolean;
  is_batch_generated: boolean;
  created_at: string;
  last_visit_at?: string;
  links_count: number;
  profile_completion: number;
}

interface AdminStats {
  totalUsers: number;
  totalCards: number;
  totalVisits: number;
  totalClicks: number;
  activeUsers: number;
  batchUsers: number;
  premiumUsers: number;
  recentSignups: number;
  avgLinksPerUser: number;
  avgVisitsPerUser: number;
}

interface DashboardFilters {
  search: string;
  userType: 'all' | 'regular' | 'batch' | 'premium';
  activity: 'all' | 'active' | 'inactive';
  period: 'all' | 'today' | 'week' | 'month';
}

export default function EnhancedAdminPage() {
  const router = useRouter();
  
  // حالات فحص الصلاحيات
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // حالات البيانات
  const [users, setUsers] = useState<DetailedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DetailedUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCards: 0,
    totalVisits: 0,
    totalClicks: 0,
    activeUsers: 0,
    batchUsers: 0,
    premiumUsers: 0,
    recentSignups: 0,
    avgLinksPerUser: 0,
    avgVisitsPerUser: 0
  });

  // حالات التحكم
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DetailedUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    userType: 'all',
    activity: 'all',
    period: 'all'
  });

  // حالات نموذج إنشاء الحسابات بالجملة
  const [batchCount, setBatchCount] = useState(100);
  const [batchPrefix, setBatchPrefix] = useState('card');
  const [batchResult, setBatchResult] = useState<{
    success: boolean;
    users: BatchUser[];
    error?: string;
  } | null>(null);

  // تأثيرات جانبية
  useEffect(() => {
    checkAdminPermissions();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  // فحص صلاحيات الأدمن
  const checkAdminPermissions = async () => {
    try {
      setIsLoadingPermissions(true);
      
      const currentUser = AuthService.getUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const isAdmin = await AdminService.checkCurrentUserAdmin();
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }

      setHasAdminAccess(true);
      await loadAllData();
      
    } catch (error) {
      console.error('خطأ في فحص الصلاحيات:', error);
      router.push('/unauthorized');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  // تحميل جميع البيانات
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحميل المستخدمين
  const loadUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('users')
        .select(`
          id,
          username,
          full_name,
          email,
          phone,
          job_title,
          company,
          bio,
          total_visits,
          total_clicks,
          is_active,
          is_premium,
          is_batch_generated,
          created_at,
          last_visit_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithDetails = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count: linksCount } = await supabase
            .from('user_links')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_active', true);

          let completionScore = 0;
          if (user.full_name) completionScore += 20;
          if (user.email) completionScore += 15;
          if (user.phone) completionScore += 15;
          if (user.job_title) completionScore += 15;
          if (user.company) completionScore += 15;
          if (user.bio) completionScore += 10;
          if (linksCount && linksCount > 0) completionScore += 10;

          return {
            ...user,
            links_count: linksCount || 0,
            profile_completion: completionScore
          };
        })
      );

      setUsers(usersWithDetails);
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
    }
  };

    // تحميل الإحصائيات
    async function loadStats(): Promise<void> {
    try {
      const { data: batchUsersData } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_batch_generated', true);

      const batchStats = {
        batchUsers: (batchUsersData as any)?.count || 0
      };
      const { data: allUsers } = await supabase
        .from('users')
        .select('total_visits, total_clicks');

      const adminStats = {
        totalUsers: allUsers?.length || 0,
        totalVisits: allUsers?.reduce((sum, user) => sum + (user.total_visits || 0), 0) || 0,
        totalClicks: allUsers?.reduce((sum, user) => sum + (user.total_clicks || 0), 0) || 0
      };

      const totalLinksResult = await supabase
        .from('user_links')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const premiumUsersResult = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      const recentSignupsResult = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const totalUsers = adminStats.totalUsers;
      const totalLinks = totalLinksResult.count || 0;

      setStats({
        totalUsers,
        totalCards: totalUsers,
        totalVisits: adminStats.totalVisits,
        totalClicks: adminStats.totalClicks,
        activeUsers: users.filter(u => u.last_visit_at &&
          new Date(u.last_visit_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        batchUsers: batchStats.batchUsers,
        premiumUsers: premiumUsersResult.count || 0,
        recentSignups: recentSignupsResult.count || 0,
        avgLinksPerUser: totalUsers > 0 ? Math.round((totalLinks / totalUsers) * 10) / 10 : 0,
        avgVisitsPerUser: totalUsers > 0 ? Math.round((adminStats.totalVisits / totalUsers) * 10) / 10 : 0
      });
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  }

  // تصفية المستخدمين
  const filterUsers = () => {
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.company?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.userType !== 'all') {
      switch (filters.userType) {
        case 'regular':
          filtered = filtered.filter(user => !user.is_batch_generated && !user.is_premium);
          break;
        case 'batch':
          filtered = filtered.filter(user => user.is_batch_generated);
          break;
        case 'premium':
          filtered = filtered.filter(user => user.is_premium);
          break;
      }
    }

    if (filters.activity !== 'all') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (filters.activity === 'active') {
        filtered = filtered.filter(user => 
          user.last_visit_at && new Date(user.last_visit_at) > thirtyDaysAgo
        );
      } else {
        filtered = filtered.filter(user => 
          !user.last_visit_at || new Date(user.last_visit_at) <= thirtyDaysAgo
        );
      }
    }

    if (filters.period !== 'all') {
      const now = new Date();
      let filterDate: Date;
      
      switch (filters.period) {
        case 'today':
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          filterDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          filterDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          filterDate = new Date(0);
      }
      
      filtered = filtered.filter(user => 
        new Date(user.created_at) >= filterDate
      );
    }

    setFilteredUsers(filtered);
  };

  // إنشاء حسابات بالجملة
  const handleCreateBatch = async () => {
    if (batchCount < 1 || batchCount > 10000) {
      alert('عدد الحسابات يجب أن يكون بين 1 و 10,000');
      return;
    }

    setLoading(true);
    setBatchResult(null);

    try {
      const result = await createBatchUsers(batchCount, batchPrefix);
      setBatchResult(result);
      
      if (result.success) {
        await loadAllData();
        alert(`تم إنشاء ${result.successCount} حساب بنجاح مع QR Codes!`);
      }
    } catch (error) {
      console.error('خطأ في إنشاء الحسابات:', error);
      alert('حدث خطأ في إنشاء الحسابات');
    } finally {
      setLoading(false);
    }
  };

  // دالة جديدة: تحميل QR Codes مضغوطة في ZIP
  const handleDownloadQRZip = async () => {
    if (!batchResult || !batchResult.success || batchResult.users.length === 0) {
      alert('لا توجد QR Codes للتحميل');
      return;
    }

    try {
      await downloadQRCodesZip(batchResult.users, `${batchPrefix}_qr_codes`);
      alert('تم تحميل ملف ZIP بنجاح!');
    } catch (error) {
      console.error('خطأ في تحميل ZIP:', error);
      alert('فشل في تحميل ملف ZIP');
    }
  };

  // دالة جديدة: تحميل QR Codes منفردة
  const handleDownloadQRIndividual = () => {
    if (!batchResult || !batchResult.success || batchResult.users.length === 0) {
      alert('لا توجد QR Codes للتحميل');
      return;
    }

    downloadAllQRCodes(batchResult.users);
    alert(`بدء تحميل ${batchResult.users.length} ملف QR منفرد...`);
  };

  // عرض تفاصيل المستخدم
  const handleViewUser = (user: DetailedUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // حذف مستخدم
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await loadUsers();
      alert('تم حذف المستخدم بنجاح');
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      alert('حدث خطأ في حذف المستخدم');
    }
  };

  // تصدير CSV
  const exportUsersCSV = () => {
    const headers = ['Username', 'Full Name', 'Email', 'Phone', 'Company', 'Visits', 'Links', 'Created'];
    const csvData = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.username,
        user.full_name || '',
        user.email || '',
        user.phone || '',
        user.company || '',
        user.total_visits,
        user.links_count,
        new Date(user.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // شاشة تحميل فحص الصلاحيات
  if (isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}>
            <Shield className="h-8 w-8" style={{ color: '#D97757' }} />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#D97757' }}></div>
          <p style={{ color: '#141413', opacity: 0.7 }}>فحص صلاحيات الوصول...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
      {/* Header */}
      <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Board Iraq" className="w-18 h-8" />
            </div>
            <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                onClick={loadAllData} 
                disabled={loading}
                style={{ backgroundColor: '#D97757', color: 'white' }}
                className="hover:opacity-90 border-0 focus:ring-orange-400"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Activity className="h-4 w-4 ml-2" />
                )}
                تحديث البيانات
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={AuthService.logout}
                style={{ borderColor: '#D97757', color: '#D97757' }}
                className="hover:bg-orange-50 border-0 focus:ring-orange-400"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8" style={{ color: '#D97757' }} />
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold" style={{ color: '#141413' }}>{stats.totalUsers}</p>
                  <p className="text-xs flex items-center" style={{ color: '#D97757' }}>
                    <TrendingUp className="h-3 w-3 ml-1" />
                    +{stats.recentSignups} هذا الأسبوع
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8" style={{ color: '#D97757' }} />
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>إجمالي الزيارات</p>
                  <p className="text-2xl font-bold" style={{ color: '#141413' }}>{stats.totalVisits.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: '#D97757' }}>
                    {stats.avgVisitsPerUser} متوسط/مستخدم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8" style={{ color: '#D97757' }} />
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>النقرات الإجمالية</p>
                  <p className="text-2xl font-bold" style={{ color: '#141413' }}>{stats.totalClicks.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: '#D97757' }}>
                    {stats.avgLinksPerUser} روابط/مستخدم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8" style={{ color: '#D97757' }} />
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#141413', opacity: 0.7 }}>مستخدمين مميزين</p>
                  <p className="text-2xl font-bold" style={{ color: '#141413' }}>{stats.premiumUsers}</p>
                  <p className="text-xs" style={{ color: '#D97757' }}>
                    {stats.activeUsers} نشط شهرياً
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#141413' }}>
              <Filter className="h-5 w-5 ml-2" style={{ color: '#D97757' }} />
              تصفية وبحث المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4" style={{ color: '#141413', opacity: 0.5 }} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pr-10 px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                    placeholder="اسم المستخدم، الإيميل، الشركة..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>نوع المستخدم</label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value as any }))}
                  className="w-full px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                >
                  <option value="all">جميع المستخدمين</option>
                  <option value="regular">مستخدمين عاديين</option>
                  <option value="batch">حسابات الجملة</option>
                  <option value="premium">مستخدمين مميزين</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>النشاط</label>
                <select
                  value={filters.activity}
                  onChange={(e) => setFilters(prev => ({ ...prev, activity: e.target.value as any }))}
                  className="w-full px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                >
                  <option value="all">جميع المستخدمين</option>
                  <option value="active">نشط (آخر 30 يوم)</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>فترة التسجيل</label>
                <select
                  value={filters.period}
                  onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value as any }))}
                  className="w-full px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                >
                  <option value="all">جميع الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>
                عرض {filteredUsers.length} من {users.length} مستخدم
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportUsersCSV}
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                  className="hover:bg-orange-50 border-0 focus:ring-orange-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تصدير CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilters({ search: '', userType: 'all', activity: 'all', period: 'all' })}
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                  className="hover:bg-orange-50 border-0 focus:ring-orange-400"
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="mb-8 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center" style={{ color: '#141413' }}>
                <Users className="h-5 w-5 ml-2" style={{ color: '#D97757' }} />
                تفاصيل المستخدمين ({filteredUsers.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: 'rgba(217, 151, 87, 0.2)' }} className="border-b">
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#141413' }}>المستخدم</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#141413' }}>معلومات الاتصال</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#141413' }}>الإحصائيات</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#141413' }}>الحالة</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#141413' }}>التاريخ</th>
                    <th className="text-center py-3 px-4 font-medium" style={{ color: '#141413' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b hover:bg-orange-25 ${index % 2 === 0 ? 'bg-white' : 'bg-orange-25'}`} style={{ borderBottomColor: 'rgba(217, 151, 87, 0.1)' }}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #D97757, #C76646)' }}>
                            {(user.full_name || user.username).charAt(0).toUpperCase()}
                          </div>
                          <div className="mr-3">
                            <div className="font-medium" style={{ color: '#141413' }}>
                              {user.full_name || user.username}
                              {user.is_premium && <Star className="inline h-4 w-4 ml-1" style={{ color: '#D97757' }} />}
                            </div>
                            <div className="text-sm" style={{ color: '#141413', opacity: 0.5 }}>@{user.username}</div>
                            {user.job_title && user.company && (
                              <div className="text-xs" style={{ color: '#D97757' }}>
                                {user.job_title} - {user.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center text-xs" style={{ color: '#141413', opacity: 0.7 }}>
                              <Mail className="h-3 w-3 ml-1" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center text-xs" style={{ color: '#141413', opacity: 0.7 }}>
                              <Phone className="h-3 w-3 ml-1" />
                              {user.phone}
                            </div>
                          )}
                          {!user.email && !user.phone && (
                            <span className="text-xs" style={{ color: '#141413', opacity: 0.4 }}>لا توجد معلومات</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <Eye className="h-3 w-3 ml-1" style={{ color: '#D97757' }} />
                            <span className="font-medium" style={{ color: '#141413' }}>{user.total_visits}</span>
                            <span style={{ color: '#141413', opacity: 0.5 }} className="mr-1">زيارة</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <MousePointer className="h-3 w-3 ml-1" style={{ color: '#D97757' }} />
                            <span className="font-medium" style={{ color: '#141413' }}>{user.total_clicks}</span>
                            <span style={{ color: '#141413', opacity: 0.5 }} className="mr-1">نقرة</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <ExternalLink className="h-3 w-3 ml-1" style={{ color: '#D97757' }} />
                            <span className="font-medium" style={{ color: '#141413' }}>{user.links_count}</span>
                            <span style={{ color: '#141413', opacity: 0.5 }} className="mr-1">رابط</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Target className="h-3 w-3 ml-1" style={{ color: '#D97757' }} />
                            <span className="font-medium" style={{ color: '#141413' }}>{user.profile_completion}%</span>
                            <span style={{ color: '#141413', opacity: 0.5 }} className="mr-1">مكتمل</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            {user.is_active ? (
                              <div className="flex items-center text-xs" style={{ color: '#D97757' }}>
                                <CheckCircle className="h-3 w-3 ml-1" />
                                نشط
                              </div>
                            ) : (
                              <div className="flex items-center text-xs text-red-600">
                                <AlertCircle className="h-3 w-3 ml-1" />
                                غير نشط
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.is_batch_generated && (
                              <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}>
                                جملة
                              </span>
                            )}
                            {user.is_premium && (
                              <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'rgba(217, 151, 87, 0.2)', color: '#D97757' }}>
                                مميز
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs" style={{ color: '#141413', opacity: 0.7 }}>
                            <Calendar className="h-3 w-3 ml-1" />
                            {new Date(user.created_at).toLocaleDateString('ar')}
                          </div>
                          {user.last_visit_at && (
                            <div className="flex items-center text-xs" style={{ color: '#141413', opacity: 0.5 }}>
                              <Clock className="h-3 w-3 ml-1" />
                              آخر زيارة: {new Date(user.last_visit_at).toLocaleDateString('ar')}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewUser(user)}
                            className="h-8 w-8 p-0 border-0 focus:ring-orange-400"
                            style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/${user.username}`, '_blank')}
                            className="h-8 w-8 p-0 border-0 focus:ring-orange-400"
                            style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}
                          >
                            <Globe className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 p-0 border-0 text-red-600 hover:text-red-700 focus:ring-orange-400"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#141413', opacity: 0.4 }} />
                  <p style={{ color: '#141413', opacity: 0.7 }}>لا توجد مستخدمين يطابقون معايير البحث</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Batch Generation Card */}
        <Card className="mb-8 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#141413' }}>
              <Plus className="h-5 w-5 ml-2" style={{ color: '#D97757' }} />
              إنشاء حسابات بالجملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="mb-4" style={{ color: '#141413', opacity: 0.7 }}>
                  قم بإنشاء حسابات متعددة للطباعة على البطاقات الجديدة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                      عدد الحسابات المطلوبة *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={batchCount}
                      onChange={(e) => setBatchCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                      placeholder="مثال: 1000"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                      بادئة الأسماء *
                    </label>
                    <input
                      type="text"
                      value={batchPrefix}
                      onChange={(e) => setBatchPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                      placeholder="مثال: card"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {batchPrefix && batchCount > 0 && (
                  <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}>
                    <p className="text-sm" style={{ color: '#D97757' }}>
                      <strong>مثال على الأسماء:</strong> {batchPrefix}0001, {batchPrefix}0002, {batchPrefix}0003...
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#D97757', opacity: 0.8 }}>
                      <strong>الروابط:</strong> boardiraq.com/{batchPrefix}0001
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-end space-y-3">
                <Button 
                  onClick={handleCreateBatch}
                  disabled={loading || batchCount < 1 || !batchPrefix.trim()}
                  style={{ backgroundColor: '#D97757', color: 'white' }}
                  className="hover:opacity-90 border-0 focus:ring-orange-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 ml-2" />
                      إنشاء الحسابات
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (batchResult?.success) {
                      const csvHeaders = ['اسم المستخدم', 'كلمة المرور', 'الاسم الكامل', 'رابط الملف الشخصي'];
                      const csvRows = [csvHeaders.join(',')];

                      batchResult.users.forEach(user => {
                        const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://boardiraq.com'}/${user.username}`;
                        const row = [user.username, user.password, user.full_name, profileUrl].join(',');
                        csvRows.push(row);
                      });

                      const csvData = csvRows.join('\n');
                      downloadCSV(csvData, `${batchPrefix}_accounts`);
                    }
                  }}
                  disabled={!batchResult || !batchResult.success}
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                  className="hover:bg-orange-50 border-0 focus:ring-orange-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل بيانات CSV
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleDownloadQRZip}
                  disabled={!batchResult || !batchResult.success}
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                  className="hover:bg-orange-50 border-0 focus:ring-orange-400 font-medium"
                >
                  <Archive className="h-4 w-4 ml-2" />
                  📦 تحميل QR مضغوط (ZIP) ⭐
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleDownloadQRIndividual}
                  disabled={!batchResult || !batchResult.success}
                  style={{ borderColor: '#D97757', color: '#D97757' }}
                  className="hover:bg-orange-50 border-0 focus:ring-orange-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل QR منفردة ({batchResult?.users.length || 0})
                </Button>
              </div>
            </div>

            {batchResult && (
              <div className="mt-6 p-4 rounded-lg border-0" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
                {batchResult.success ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: '#D97757' }} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium" style={{ color: '#D97757' }}>
                        تم إنشاء {batchResult.users.length} حساب بنجاح مع QR Codes! 🎉
                      </h4>
                      <p className="text-sm mt-1" style={{ color: '#D97757', opacity: 0.8 }}>
                        يمكنك الآن تحميل ملف CSV، QR Codes مضغوطة، أو منفردة
                      </p>
                      
                      {batchResult.users.length > 0 && (
                        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}>
                          <h5 className="text-sm font-medium mb-2" style={{ color: '#141413' }}>معاينة QR Codes:</h5>
                          <div className="flex gap-2 overflow-x-auto">
                            {batchResult.users.slice(0, 4).map((user, index) => (
                              <div key={index} className="flex-shrink-0 text-center">
                                <img 
                                  src={user.qr_code} 
                                  alt={`QR Code for ${user.username}`}
                                  className="w-16 h-16 border rounded"
                                  style={{ borderColor: 'rgba(217, 151, 87, 0.3)' }}
                                />
                                <p className="text-xs mt-1" style={{ color: '#141413', opacity: 0.7 }}>{user.username}</p>
                              </div>
                            ))}
                            {batchResult.users.length > 4 && (
                              <div className="flex-shrink-0 w-16 h-16 border rounded flex items-center justify-center" style={{ borderColor: 'rgba(217, 151, 87, 0.3)', backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
                                <p className="text-xs text-center" style={{ color: '#141413', opacity: 0.5 }}>
                                  +{batchResult.users.length - 4}<br/>المزيد
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}>
                        <h5 className="text-sm font-medium mb-1" style={{ color: '#D97757' }}>📦 محتويات ملف ZIP:</h5>
                        <ul className="text-xs space-y-1" style={{ color: '#D97757', opacity: 0.8 }}>
                          <li>• {batchResult.users.length} ملف PNG (أكواد QR)</li>
                          <li>• ملف CSV مع بيانات الحسابات</li>
                          <li>• ملف README مع التعليمات</li>
                          <li>• منظم ومرتب للطباعة السهلة</li>
                        </ul>
                      </div>
                      {batchResult.error && (
                        <p className="text-sm mt-1" style={{ color: '#D97757', opacity: 0.8 }}>
                          تحذير: {batchResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800">
                        فشل في إنشاء الحسابات
                      </h4>
                      <p className="text-sm text-red-600 mt-1">
                        {batchResult.error || 'حدث خطأ غير معروف'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal 
          user={selectedUser}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
          onRefresh={loadUsers}
        />
      )}
    </div>
  );
}

// مكون تفاصيل المستخدم
interface UserDetailsModalProps {
  user: DetailedUser;
  onClose: () => void;
  onRefresh: () => void;
}

function UserDetailsModal({ user, onClose, onRefresh }: UserDetailsModalProps) {
  const [userLinks, setUserLinks] = useState<any[]>([]);
  const [userVisits, setUserVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [user.id]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const { data: links } = await supabase
        .from('user_links')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      const { data: visits } = await supabase
        .from('page_visits')
        .select('*')
        .eq('user_id', user.id)
        .order('visited_at', { ascending: false })
        .limit(10);

      setUserLinks(links || []);
      setUserVisits(visits || []);
    } catch (error) {
      console.error('خطأ في جلب تفاصيل المستخدم:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b" style={{ borderBottomColor: 'rgba(217, 151, 87, 0.2)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: '#141413' }}>
              تفاصيل المستخدم: {user.full_name || user.username}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              style={{ borderColor: '#D97757', color: '#D97757' }}
              className="border-0 focus:ring-orange-400"
            >
              <span className="text-lg">×</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: '#141413' }}>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                  <span className="text-sm" style={{ color: '#141413' }}>
                    <strong>اسم المستخدم:</strong> {user.username}
                  </span>
                </div>
                {user.full_name && (
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>الاسم الكامل:</strong> {user.full_name}
                    </span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>البريد الإلكتروني:</strong> {user.email}
                    </span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>الهاتف:</strong> {user.phone}
                    </span>
                  </div>
                )}
                {user.job_title && (
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>المسمى الوظيفي:</strong> {user.job_title}
                    </span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>الشركة:</strong> {user.company}
                    </span>
                  </div>
                )}
                {user.bio && (
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 ml-2 mt-0.5" style={{ color: '#D97757' }} />
                    <span className="text-sm" style={{ color: '#141413' }}>
                      <strong>النبذة:</strong> {user.bio}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: '#141413' }}>الإحصائيات والحالة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#141413' }}>إجمالي الزيارات:</span>
                  <span className="text-lg font-bold" style={{ color: '#D97757' }}>{user.total_visits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#141413' }}>إجمالي النقرات:</span>
                  <span className="text-lg font-bold" style={{ color: '#D97757' }}>{user.total_clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#141413' }}>عدد الروابط:</span>
                  <span className="text-lg font-bold" style={{ color: '#D97757' }}>{user.links_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#141413' }}>اكتمال الملف:</span>
                  <div className="flex items-center">
                    <div className="w-20 rounded-full h-2 ml-2" style={{ backgroundColor: 'rgba(217, 151, 87, 0.2)' }}>
                      <div 
                        className="h-2 rounded-full" 
                        style={{ backgroundColor: '#D97757', width: `${user.profile_completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#141413' }}>{user.profile_completion}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#141413' }}>تاريخ التسجيل:</span>
                  <span className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>{new Date(user.created_at).toLocaleDateString('ar')}</span>
                </div>
                {user.last_visit_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: '#141413' }}>آخر زيارة:</span>
                    <span className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>{new Date(user.last_visit_at).toLocaleDateString('ar')}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={`px-2 py-1 text-xs rounded ${user.is_active ? '' : 'bg-red-100 text-red-700'}`} style={user.is_active ? { backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' } : {}}>
                    {user.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                  {user.is_premium && (
                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'rgba(217, 151, 87, 0.2)', color: '#D97757' }}>
                      مميز
                    </span>
                  )}
                  {user.is_batch_generated && (
                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}>
                      حساب جملة
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: '#141413' }}>روابط المستخدم ({userLinks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userLinks.length > 0 ? (
                <div className="space-y-3">
                  {userLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#D97757' }}>
                          {link.type === 'phone' ? '📱' : 
                           link.type === 'email' ? '✉️' : 
                           link.type === 'website' ? '🌐' : 
                           link.platform === 'whatsapp' ? '💬' : 
                           link.platform === 'facebook' ? '📘' : 
                           link.platform === 'instagram' ? '📷' : '🔗'}
                        </div>
                        <div className="mr-3">
                          <div className="font-medium text-sm" style={{ color: '#141413' }}>{link.title}</div>
                          <div className="text-xs" style={{ color: '#141413', opacity: 0.5 }}>{link.type} • {link.click_count} نقرة</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${link.is_active ? '' : 'bg-gray-100 text-gray-700'}`} style={link.is_active ? { backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' } : {}}>
                          {link.is_active ? 'نشط' : 'معطل'}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => window.open(link.url, '_blank')}
                          style={{ borderColor: '#D97757', color: '#D97757' }}
                          className="border-0 focus:ring-orange-400"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4" style={{ color: '#141413', opacity: 0.5 }}>لا توجد روابط</p>
              )}
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="border-0">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: '#141413' }}>آخر الزيارات ({userVisits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userVisits.length > 0 ? (
                <div className="space-y-2">
                  {userVisits.map((visit, index) => (
                    <div key={visit.id} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0" style={{ borderBottomColor: 'rgba(217, 151, 87, 0.1)' }}>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 ml-2" style={{ color: '#D97757' }} />
                        <span style={{ color: '#141413' }}>{visit.visitor_ip || 'غير معروف'}</span>
                      </div>
                      <div className="text-xs" style={{ color: '#141413', opacity: 0.5 }}>
                        {new Date(visit.visited_at).toLocaleString('ar')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4" style={{ color: '#141413', opacity: 0.5 }}>لا توجد زيارات مسجلة</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4 border-t" style={{ borderTopColor: 'rgba(217, 151, 87, 0.2)' }}>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.open(`/${user.username}`, '_blank')}
                style={{ backgroundColor: '#D97757', color: 'white' }}
                className="hover:opacity-90 border-0 focus:ring-orange-400"
              >
                <Globe className="h-4 w-4 ml-2" />
                عرض الصفحة
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(`/dashboard?user=${user.username}`, '_blank')}
                style={{ borderColor: '#D97757', color: '#D97757' }}
                className="hover:bg-orange-50 border-0 focus:ring-orange-400"
              >
                <Settings className="h-4 w-4 ml-2" />
                لوحة التحكم
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              style={{ borderColor: '#D97757', color: '#D97757' }}
              className="hover:bg-orange-50 border-0 focus:ring-orange-400"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}