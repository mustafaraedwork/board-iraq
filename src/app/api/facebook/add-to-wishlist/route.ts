// src/app/api/facebook/add-to-wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { facebookAPI } from '@/lib/facebook-conversions-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardOwner, engagementScore, visitorData } = body;

    const urlParams = new URLSearchParams(request.url.split('?')[1] || '');
    
    const result = await facebookAPI.trackAddToWishlist(
      cardOwner,
      engagementScore,
      visitorData,
      request.headers,
      urlParams
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'AddToWishlist event sent successfully',
        result: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send AddToWishlist event',
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('AddToWishlist API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

