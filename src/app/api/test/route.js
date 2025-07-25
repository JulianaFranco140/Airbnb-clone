import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test API called');
    
    return NextResponse.json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test API failed' },
      { status: 500 }
    );
  }
}
