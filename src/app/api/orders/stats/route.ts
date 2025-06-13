// src/app/api/orders/stats/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// تعريف أنواع البيانات
interface Order {
  created_at: string;
  total_amount: number;
  status: string;
}

interface DailyStatsData {
  [key: string]: {
    date: string;
    orders: number;
    revenue: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

interface ProcessedDailyStats {
  date: string;
  orders: number;
  revenue: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// إزالة request غير المستخدم
export async function GET() {
  try {
    // جلب الإحصائيات العامة
    const { data: generalStats, error: generalError } = await supabase
      .from('orders_statistics')
      .select('*')
      .single();

    if (generalError) {
      console.error('خطأ في جلب الإحصائيات العامة:', generalError);
      return NextResponse.json(
        { error: 'فشل في جلب الإحصائيات العامة' },
        { status: 500 }
      );
    }

    // جلب إحصائيات المحافظات
    const { data: governorateStats, error: govError } = await supabase
      .from('orders_by_governorate')
      .select('*')
      .order('order_count', { ascending: false })
      .limit(10);

    if (govError) {
      console.error('خطأ في جلب إحصائيات المحافظات:', govError);
    }

    // جلب إحصائيات آخر 30 يوم
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentOrders, error: recentError } = await supabase
      .from('orders')
      .select('created_at, total_amount, status')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (recentError) {
      console.error('خطأ في جلب الطلبات الأخيرة:', recentError);
    }

    // تجميع البيانات اليومية
    const dailyStats = recentOrders ? processDailyStats(recentOrders) : [];

    // إحصائيات اليوم
    const today = new Date().toDateString();
    const todayOrders = recentOrders?.filter(order => 
      new Date(order.created_at).toDateString() === today
    ) || [];

    const todayStats = {
      orders: todayOrders.length,
      revenue: todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
      pending: todayOrders.filter(o => o.status === 'pending').length,
      confirmed: todayOrders.filter(o => o.status === 'confirmed').length
    };

    return NextResponse.json({
      success: true,
      generalStats: generalStats || {},
      governorateStats: governorateStats || [],
      dailyStats: dailyStats,
      todayStats: todayStats
    });

  } catch (error) {
    console.error('خطأ في API الإحصائيات:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// دالة لمعالجة الإحصائيات اليومية - استبدال any بأنواع محددة
function processDailyStats(orders: Order[]): ProcessedDailyStats[] {
  const dailyData: DailyStatsData = {};

  orders.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        orders: 0,
        revenue: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };
    }

    dailyData[date].orders++;
    dailyData[date].revenue += order.total_amount || 0;
    
    // تحسين طريقة تحديث الحالات
    const status = order.status as keyof Omit<ProcessedDailyStats, 'date' | 'orders' | 'revenue'>;
    if (dailyData[date][status] !== undefined) {
      dailyData[date][status]++;
    }
  });

  return Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}