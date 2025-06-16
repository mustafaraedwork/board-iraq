// src/app/api/facebook/purchase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { facebookAPI } from '@/lib/facebook-conversions-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userPhone, userName, userCity, orderValue, currency } = body;

    const urlParams = new URLSearchParams(request.url.split('?')[1] || '');
    
    const result = await facebookAPI.trackPurchase(
      userEmail,
      userPhone,
      userName,
      userCity,
      orderValue,
      currency,
      request.headers,
      urlParams
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Purchase event sent successfully',
        result: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send Purchase event',
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Purchase API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

