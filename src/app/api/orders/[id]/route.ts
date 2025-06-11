// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// تحديث طلب معين
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // التحقق من معرف الطلب
    if (!id) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    // الحقول المسموح بتحديثها
    const allowedFields = ['status', 'delivery_date', 'delivery_notes', 'tracking_number', 'admin_notes', 'priority_level'];
    
    const updateData: any = {};
    
    // فلترة الحقول المسموحة فقط
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    // التحقق من وجود بيانات للتحديث
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'لا توجد بيانات صالحة للتحديث' },
        { status: 400 }
      );
    }

    // إضافة تاريخ التحديث
    updateData.updated_at = new Date().toISOString();

    // تحديث الطلب في قاعدة البيانات
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث الطلب:', error);
      return NextResponse.json(
        { error: 'فشل في تحديث الطلب' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      order: data
    });

  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// جلب طلب معين
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    // جلب الطلب مع التفاصيل
    const { data, error } = await supabase
      .from('orders_with_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('خطأ في جلب الطلب:', error);
      return NextResponse.json(
        { error: 'فشل في جلب الطلب' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // جلب تاريخ تغيير الحالات
    const { data: statusHistory, error: historyError } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', id)
      .order('changed_at', { ascending: false });

    return NextResponse.json({
      success: true,
      order: data,
      statusHistory: statusHistory || []
    });

  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// حذف طلب معين
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    // حذف الطلب من قاعدة البيانات
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('خطأ في حذف الطلب:', error);
      return NextResponse.json(
        { error: 'فشل في حذف الطلب' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    });

  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}