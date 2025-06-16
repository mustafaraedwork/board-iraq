// src/app/api/facebook/complete-registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { facebookAPI } from '@/lib/facebook-conversions-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userPhone, userName, username } = body;

    const urlParams = new URLSearchParams(request.url.split('?')[1] || '');
    
    const result = await facebookAPI.trackCompleteRegistration(
      userEmail,
      userPhone,
      userName,
      username,
      request.headers,
      urlParams
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'CompleteRegistration event sent successfully',
        result: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send CompleteRegistration event',
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('CompleteRegistration API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}