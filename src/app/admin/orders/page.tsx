// src/app/admin/orders/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fetchOrders = async () => {
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

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, governorateFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                إدارة الطلبات
              </h1>
              <p className="text-gray-600">متابعة وإدارة طلبات البطاقات الذكية</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </button>
              
              <button
                onClick={exportOrders}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {statusOptions.map(status => (
            <div key={status.value} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getStatusColor(status.value === 'all' ? 'pending' : status.value)} mr-3`}>
                  {status.value === 'all' ? <Package className="h-4 w-4" /> : getStatusIcon(status.value)}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {status.value === 'all' ? stats.total : stats[status.value as keyof typeof stats]}
                  </p>
                  <p className="text-sm text-gray-600">{status.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* فلاتر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline ml-1" />
                فلترة حسب الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline ml-1" />
                فلترة حسب المحافظة
              </label>
              <select
                value={governorateFilter}
                onChange={(e) => setGovernorateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الطلبات...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معلومات العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تفاصيل الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.full_name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 ml-1" />
                            {order.phone}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{order.governorate} - {order.area}</p>
                          <p className="text-gray-500">{order.nearest_landmark}</p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            الكمية: {order.quantity} {order.quantity === 1 ? 'بطاقة' : 'بطاقات'}
                          </p>
                          <p className="text-gray-900 font-medium">
                            المجموع: {order.total_amount.toLocaleString()} دينار
                          </p>
                          <p className="text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 ml-1" />
                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
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
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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
    </div>
  );
}