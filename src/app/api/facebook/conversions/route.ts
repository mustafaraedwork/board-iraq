// src/app/api/facebook/conversions/route.ts
// API Route عام لإرسال أي حدث إلى Facebook Conversions API

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // متغيرات البيئة
    const pixelId = process.env.FACEBOOK_PIXEL_ID || process.env.FB_PIXEL_ID;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || process.env.FB_ACCESS_TOKEN;
    const testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE || process.env.FB_TEST_EVENT_CODE;
    
    if (!pixelId || !accessToken) {
      console.error('❌ متغيرات Facebook غير مكتملة:', { pixelId: !!pixelId, accessToken: !!accessToken });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Facebook configuration missing',
          details: 'FACEBOOK_PIXEL_ID or FACEBOOK_ACCESS_TOKEN not found'
        },
        { status: 500 }
      );
    }

    // URL Facebook Conversions API
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;
    
    // إعداد البيانات للإرسال
    const payload = {
      data: [eventData],
      access_token: accessToken,
      ...(testEventCode && { test_event_code: testEventCode })
    };

    console.log('🎯 إرسال حدث Facebook:', {
      pixel_id: pixelId,
      event_name: eventData.event_name,
      test_mode: !!testEventCode,
      timestamp: new Date().toISOString()
    });

    // إرسال الطلب إلى Facebook
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ نجح إرسال حدث Facebook:', {
        event_name: eventData.event_name,
        events_received: result.events_received || 1,
        fbtrace_id: result.fbtrace_id
      });
      
      return NextResponse.json({
        success: true,
        message: 'Event sent successfully to Facebook',
        data: result,
        event_name: eventData.event_name,
        events_received: result.events_received || 1
      });
    } else {
      console.error('❌ فشل إرسال حدث Facebook:', result);
      return NextResponse.json({
        success: false,
        message: 'Failed to send event to Facebook',
        error: result,
        pixel_id: pixelId,
        event_name: eventData.event_name
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ خطأ في Facebook Conversions API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error in Facebook API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// دعم GET للاختبار
export async function GET() {
  const pixelId = process.env.FACEBOOK_PIXEL_ID || process.env.FB_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || process.env.FB_ACCESS_TOKEN;
  
  return NextResponse.json({
    message: 'Facebook Conversions API is ready',
    config: {
      pixel_id: pixelId ? '✅ Configured' : '❌ Missing',
      access_token: accessToken ? '✅ Configured' : '❌ Missing',
      test_mode: !!(process.env.FACEBOOK_TEST_EVENT_CODE || process.env.FB_TEST_EVENT_CODE)
    },
    endpoint: '/api/facebook/conversions',
    method: 'POST',
    timestamp: new Date().toISOString()
  });
}