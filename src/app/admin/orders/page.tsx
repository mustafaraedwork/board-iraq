// src/app/admin/orders/page.tsx - Updated with New Brand Identity
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  Download,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  Shield,
  Loader2
} from 'lucide-react';
import { AuthService, AdminService } from '@/lib/utils';

interface Order {
  id: string;
  full_name: string;
  phone: string;
  governorate: string;
  area: string;
  nearest_landmark: string;
  quantity: number;
  total_amount: number;
  status: string;
  status_arabic: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminOrdersPage() {
  const router = useRouter();
  
  // حالات فحص الصلاحيات
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // حالات البيانات
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  
  // فلاتر
  const [statusFilter, setStatusFilter] = useState('all');
  const [governorateFilter, setGovernorateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // إحصائيات
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  const governorates = [
    'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 
    'الأنبار', 'السليمانية', 'واسط', 'كركوك', 'ذي قار', 
    'بابل', 'المثنى', 'القادسية', 'صلاح الدين', 'ديالى', 
    'ميسان', 'دهوك', 'الديوانية'
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات', color: 'gray' },
    { value: 'pending', label: 'في انتظار التأكيد', color: 'yellow' },
    { value: 'confirmed', label: 'تم التأكيد', color: 'blue' },
    { value: 'shipped', label: 'تم الشحن', color: 'purple' },
    { value: 'delivered', label: 'تم التوصيل', color: 'green' },
    { value: 'cancelled', label: 'ملغى', color: 'red' }
  ];

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
      await fetchOrders(); // بدء تحميل البيانات بعد التأكد من الصلاحيات
      
    } catch (error) {
      console.error('خطأ في فحص الصلاحيات:', error);
      router.push('/unauthorized');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  useEffect(() => {
    checkAdminPermissions();
  }, []);

  useEffect(() => {
    if (hasAdminAccess) {
      fetchOrders();
    }
  }, [currentPage, statusFilter, governorateFilter, hasAdminAccess]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-800 border-yellow-200';
      case 'confirmed': return 'text-blue-800 border-blue-200'; 
      case 'shipped': return 'text-purple-800 border-purple-200';
      case 'delivered': return 'text-green-800 border-green-200';
      case 'cancelled': return 'text-red-800 border-red-200';
      default: return 'text-gray-800 border-gray-200';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return 'rgba(255, 193, 7, 0.1)';
      case 'confirmed': return 'rgba(0, 123, 255, 0.1)'; 
      case 'shipped': return 'rgba(108, 117, 125, 0.1)';
      case 'delivered': return 'rgba(40, 167, 69, 0.1)';
      case 'cancelled': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  };

  const fetchOrders = async () => {
    if (!hasAdminAccess) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(governorateFilter !== 'all' && { governorate: governorateFilter })
      });

      const response = await fetch(`/api/orders?${params}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب الطلبات');
      }

      const data: OrdersResponse = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        
        // حساب الإحصائيات
        const newStats = data.orders.reduce((acc, order) => {
          acc.total++;
          acc[order.status as keyof typeof acc]++;
          return acc;
        }, { total: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });
        
        setStats(newStats);
      } else {
        setError('فشل في جلب البيانات');
      }
    } catch (err) {
      setError('حدث خطأ في جلب الطلبات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // إعادة جلب الطلبات
        fetchOrders();
      } else {
        alert('فشل في تحديث حالة الطلب');
      }
    } catch (err) {
      alert('حدث خطأ في تحديث الطلب');
      console.error(err);
    }
  };

  const exportOrders = () => {
    // تصدير الطلبات كـ CSV
    const csvContent = [
      ['الاسم', 'الهاتف', 'المحافظة', 'المنطقة', 'النقطة الدالة', 'الكمية', 'المجموع', 'الحالة', 'تاريخ الطلب'].join(','),
      ...orders.map(order => [
        order.full_name,
        order.phone,
        order.governorate,
        order.area,
        order.nearest_landmark,
        order.quantity,
        order.total_amount,
        order.status_arabic,
        new Date(order.created_at).toLocaleDateString('ar-EG')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
          <p style={{ color: '#141413', opacity: 0.7 }}>فحص صلاحيات الوصول لإدارة الطلبات...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم أدمن، لا تعرض شيء (سيتم التوجيه)
  if (!hasAdminAccess) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F0EEE6' }} dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="rounded-2xl shadow-lg p-6 mb-8 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Board Iraq" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#141413' }}>
                  إدارة الطلبات - المشرفين فقط
                </h1>
                <p style={{ color: '#141413', opacity: 0.7 }}>متابعة وإدارة طلبات البطاقات الذكية</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={fetchOrders}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 border-0 focus:ring-2 focus:ring-orange-400"
                style={{ backgroundColor: '#D97757' }}
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </button>
              
              <button
                onClick={() => setShowAddOrderModal(true)}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 border-0 focus:ring-2 focus:ring-orange-400"
                style={{ backgroundColor: '#D97757' }}
              >
                <Package className="h-4 w-4 ml-2" />
                إضافة طلب جديد
              </button>
              
              <button
                onClick={exportOrders}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 border-0 focus:ring-2 focus:ring-orange-400"
                style={{ backgroundColor: '#D97757' }}
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </button>

              <button
                onClick={() => router.push('/admin')}
                className="flex items-center px-4 py-2 rounded-lg transition-colors border-0 focus:ring-2 focus:ring-orange-400 hover:bg-orange-50"
                style={{ borderColor: '#D97757', color: '#D97757' }}
              >
                ← العودة للوحة الإدارة
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {statusOptions.map(status => (
            <div key={status.value} className="rounded-xl p-4 shadow-sm border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 border-0 ${getStatusColor(status.value === 'all' ? 'pending' : status.value)}`} style={{ backgroundColor: getStatusBgColor(status.value === 'all' ? 'pending' : status.value) }}>
                  {status.value === 'all' ? <Package className="h-4 w-4" /> : getStatusIcon(status.value)}
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#141413' }}>
                    {status.value === 'all' ? stats.total : stats[status.value as keyof typeof stats]}
                  </p>
                  <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>{status.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* فلاتر */}
        <div className="rounded-2xl shadow-lg p-6 mb-8 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                <Filter className="h-4 w-4 inline ml-1" style={{ color: '#D97757' }} />
                فلترة حسب الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                <MapPin className="h-4 w-4 inline ml-1" style={{ color: '#D97757' }} />
                فلترة حسب المحافظة
              </label>
              <select
                value={governorateFilter}
                onChange={(e) => setGovernorateFilter(e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
              >
                <option value="all">جميع المحافظات</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* جدول الطلبات */}
        <div className="rounded-2xl shadow-lg overflow-hidden border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#D97757' }}></div>
              <p style={{ color: '#141413', opacity: 0.7 }}>جاري تحميل الطلبات...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchOrders}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 border-0 focus:ring-2 focus:ring-orange-400"
                style={{ backgroundColor: '#D97757' }}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4" style={{ color: '#141413', opacity: 0.4 }} />
              <p style={{ color: '#141413', opacity: 0.7 }}>لا توجد طلبات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)' }}>
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#141413' }}>
                      معلومات العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#141413' }}>
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#141413' }}>
                      تفاصيل الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#141413' }}>
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#141413' }}>
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(217, 151, 87, 0.1)' }}>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-orange-25" style={{ backgroundColor: 'rgba(217, 151, 87, 0.02)' }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#141413' }}>
                            {order.full_name}
                          </p>
                          <p className="text-sm flex items-center" style={{ color: '#141413', opacity: 0.7 }}>
                            <Phone className="h-3 w-3 ml-1" />
                            {order.phone}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p style={{ color: '#141413' }}>{order.governorate} - {order.area}</p>
                          <p style={{ color: '#141413', opacity: 0.7 }}>{order.nearest_landmark}</p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p style={{ color: '#141413' }}>
                            الكمية: {order.quantity} {order.quantity === 1 ? 'بطاقة' : 'بطاقات'}
                          </p>
                          <p className="font-medium" style={{ color: '#D97757' }}>
                            المجموع: {order.total_amount.toLocaleString()} دينار
                          </p>
                          <p className="flex items-center" style={{ color: '#141413', opacity: 0.7 }}>
                            <Calendar className="h-3 w-3 ml-1" />
                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-orange-400 ${getStatusColor(order.status)}`}
                          style={{ backgroundColor: getStatusBgColor(order.status) }}
                        >
                          <option value="pending">في انتظار التأكيد</option>
                          <option value="confirmed">تم التأكيد</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغى</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            className="p-2 rounded-lg border-0 focus:ring-2 focus:ring-orange-400 hover:opacity-80"
                            style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg border-0 focus:ring-2 focus:ring-orange-400 hover:opacity-80"
                            style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)', color: '#D97757' }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg border-0 focus:ring-2 focus:ring-red-400 hover:opacity-80"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* نافذة إضافة طلب جديد */}
      {showAddOrderModal && (
        <AddOrderModal 
          onClose={() => setShowAddOrderModal(false)}
          onOrderAdded={fetchOrders}
          governorates={governorates}
        />
      )}
    </div>
  );
}

// مكون نافذة إضافة طلب جديد
interface AddOrderModalProps {
  onClose: () => void;
  onOrderAdded: () => void;
  governorates: string[];
}

function AddOrderModal({ onClose, onOrderAdded, governorates }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    governorate: '',
    area: '',
    nearest_landmark: '',
    quantity: 1,
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // استخدام السعر الجديد مباشرة: 15,000 دينار
  const cardPrice = 15000;
  
  // للتشخيص - طباعة السعر في الكونسول
  console.log('🏷️ سعر البطاقة الحالي:', cardPrice);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'الاسم الكامل مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.governorate) newErrors.governorate = 'المحافظة مطلوبة';
    if (!formData.area.trim()) newErrors.area = 'المنطقة مطلوبة';
    if (!formData.nearest_landmark.trim()) newErrors.nearest_landmark = 'النقطة الدالة مطلوبة';
    if (formData.quantity < 1) newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    
    // التحقق من رقم الهاتف العراقي
    const phoneRegex = /^(\+964|0)?7[0-9]{9}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 07)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // تصحيح أسماء الحقول لتتطابق مع API + إرسال السعر الصحيح
      const orderData = {
        fullName: formData.full_name,
        phone: formData.phone,
        governorate: formData.governorate,
        area: formData.area,
        nearestLandmark: formData.nearest_landmark,
        quantity: formData.quantity,
        notes: formData.notes,
        unitPrice: cardPrice,  // 🔥 إرسال السعر الصحيح للـ API
        totalAmount: formData.quantity * cardPrice  // 🔥 إرسال المجموع الصحيح
      };
      
      console.log('Sending order data with correct price:', orderData); // للتشخيص
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      console.log('Response status:', response.status); // للتشخيص
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`خطأ من الخادم: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Success result:', result); // للتشخيص
      
      if (result.success || response.status === 201) {
        onOrderAdded();
        onClose();
        alert('✅ تم إضافة الطلب بالسعر الصحيح: ' + orderData.totalAmount.toLocaleString() + ' دينار');
      } else {
        throw new Error(result.error || 'فشل في إضافة الطلب');
      }
    } catch (error) {
      console.error('خطأ في إضافة الطلب:', error);
      
      // رسالة خطأ أكثر تفصيلاً
      let errorMessage = 'حدث خطأ في إضافة الطلب';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'خطأ في الاتصال بالخادم - تأكد من الاتصال بالإنترنت';
        } else if (error.message.includes('404')) {
          errorMessage = 'خدمة إضافة الطلبات غير متوفرة حالياً';
        } else if (error.message.includes('500')) {
          errorMessage = 'خطأ داخلي في الخادم - حاول مرة أخرى لاحقاً';
        } else if (error.message.includes('400')) {
          errorMessage = 'بيانات غير صحيحة - تأكد من ملء جميع الحقول';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(`❌ ${errorMessage}\n\n💡 ملاحظة: قد تحتاج لتحديث API الخادم لاستخدام السعر الجديد`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // طباعة المجموع المحسوب عند تغيير الكمية
    if (field === 'quantity') {
      const newTotal = (value as number) * cardPrice;
      console.log(`📊 الكمية: ${value} × ${cardPrice.toLocaleString()} = ${newTotal.toLocaleString()} دينار`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="p-6 border-b" style={{ borderBottomColor: 'rgba(217, 151, 87, 0.2)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: '#141413' }}>
              إضافة طلب جديد
            </h2>
            <button 
              onClick={onClose}
              className="text-2xl hover:opacity-70 focus:outline-none"
              style={{ color: '#D97757' }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                placeholder="أدخل الاسم الكامل"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                placeholder="07xxxxxxxxx"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* المحافظة */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                المحافظة *
              </label>
              <select
                value={formData.governorate}
                onChange={(e) => handleChange('governorate', e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
              >
                <option value="">اختر المحافظة</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate}</p>}
            </div>

            {/* المنطقة */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                المنطقة *
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                placeholder="اسم المنطقة أو الحي"
              />
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
            </div>

            {/* النقطة الدالة */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                النقطة الدالة *
              </label>
              <input
                type="text"
                value={formData.nearest_landmark}
                onChange={(e) => handleChange('nearest_landmark', e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
                placeholder="أقرب معلم أو مكان مشهور"
              />
              {errors.nearest_landmark && <p className="text-red-500 text-xs mt-1">{errors.nearest_landmark}</p>}
            </div>

            {/* الكمية */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
                الكمية *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* المجموع */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(217, 151, 87, 0.1)' }}>
            <div className="text-center">
              <p className="text-sm" style={{ color: '#141413', opacity: 0.7 }}>المجموع الإجمالي</p>
              <p className="text-2xl font-bold" style={{ color: '#D97757' }}>
                {(formData.quantity * cardPrice).toLocaleString()} دينار عراقي
              </p>
              <p className="text-xs" style={{ color: '#141413', opacity: 0.6 }}>
                ({formData.quantity} × {cardPrice.toLocaleString()} دينار)
              </p>
              <p className="text-xs mt-1" style={{ color: '#D97757', opacity: 0.8 }}>
                💡 السعر المُحدّث: {cardPrice.toLocaleString()} دينار للبطاقة الواحدة
              </p>
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#141413' }}>
              ملاحظات إضافية
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
              style={{ backgroundColor: 'rgba(217, 151, 87, 0.05)', color: '#141413' }}
              placeholder="أي ملاحظات خاصة بالطلب..."
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 border-0 focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
              style={{ backgroundColor: '#D97757' }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 ml-2" />
                  إضافة الطلب
                </>
              )}
            </button>
            
            {/* زر تجريبي - يمكن إزالته لاحقاً */}
            <button
              type="button"
              onClick={async () => {
                if (!validateForm()) return;
                
                // محاكاة إضافة الطلب محلياً (للاختبار)
                const newOrder: Order = {
                  id: `temp_${Date.now()}`,
                  full_name: formData.full_name,
                  phone: formData.phone,
                  governorate: formData.governorate,
                  area: formData.area,
                  nearest_landmark: formData.nearest_landmark,
                  quantity: formData.quantity,
                  total_amount: formData.quantity * cardPrice,
                  status: 'pending',
                  status_arabic: 'في انتظار التأكيد',
                  payment_status: 'pending',
                  notes: formData.notes,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                console.log('طلب تجريبي تم إنشاؤه:', newOrder);
                alert('🧪 تم إنشاء طلب تجريبي - راجع وحدة التحكم');
                onClose();
              }}
              className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 border-0 focus:ring-2 focus:ring-blue-400"
              style={{ backgroundColor: '#6c757d' }}
              title="لأغراض الاختبار - يمكن حذفه لاحقاً"
            >
              🧪 اختبار
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-colors border-0 focus:ring-2 focus:ring-orange-400 hover:bg-orange-50"
              style={{ borderColor: '#D97757', color: '#D97757' }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}