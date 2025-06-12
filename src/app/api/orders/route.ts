// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// إنشاء طلب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // التحقق من البيانات المطلوبة
    const { fullName, phone, governorate, area, nearestLandmark, quantity, notes } = body;
    
    if (!fullName || !phone || !governorate || !area || !nearestLandmark) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'الكمية يجب أن تكون بين 1 و 10' },
        { status: 400 }
      );
    }

    // حساب المجموع
    const unitPrice = 15000;
    const totalAmount = quantity * unitPrice;

    // إدراج الطلب في قاعدة البيانات
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          full_name: fullName,
          phone: phone,
          governorate: governorate,
          area: area,
          nearest_landmark: nearestLandmark,
          quantity: quantity,
          notes: notes || null,
          unit_price: unitPrice,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'cash_on_delivery'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء الطلب:', error);
      return NextResponse.json(
        { error: 'حدث خطأ في حفظ الطلب، يرجى المحاولة مرة أخرى' },
        { status: 500 }
      );
    }

    // إرسال إشعار (اختياري) - يمكن إضافته لاحقاً
    // await sendOrderNotification(data);

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك بنجاح!',
      orderId: data.id,
      orderNumber: data.id.slice(0, 8).toUpperCase(),
      totalAmount: totalAmount
    });

  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// جلب جميع الطلبات (للمشرفين)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const governorate = searchParams.get('governorate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders_with_details')
      .select('*', { count: 'exact' });

    // تطبيق الفلاتر
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (governorate && governorate !== 'all') {
      query = query.eq('governorate', governorate);
    }

    // ترتيب وتحديد الصفحة
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('خطأ في جلب الطلبات:', error);
      return NextResponse.json(
        { error: 'فشل في جلب الطلبات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data,
      pagination: {
        total: count || 0,
        page: page,
        limit: limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}