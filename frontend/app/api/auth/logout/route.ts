import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Clear the cookies by setting Max-Age=0
  response.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('refresh_token', '', { path: '/', maxAge: 0 });
  
  return response;
}
