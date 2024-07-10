import { NextRequest, NextResponse } from 'next/server';

const port = process.env.PORT || 3000;

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // APIエンドポイントへのリクエストを除外
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for') || request.ip || 'Unknown IP';
  const url = request.url;

  const logData = { ip, url };

  console.log('IP = ', ip);

  await fetch(`http://localhost:${port}/api/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  });

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};