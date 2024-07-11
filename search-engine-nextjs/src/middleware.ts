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

  // hackerKiller関数を実行し、その結果に応じてレスポンスを返す
  const hackerKillerResponse = hackerKiller(request);
  if (hackerKillerResponse) {
    return hackerKillerResponse;
  }

  return NextResponse.next();
}

function hackerKiller(request: NextRequest) {
  // リクエストのURLを取得
  const { pathname } = new URL(request.url);

  // Restricted path list
  const restrictedPaths = [
    '/admin',
    '/wp-admin',
    '/wp-login',
    '/login',
    '/admin.php',
    '/wp-admin.php',
    '/wp-login.php',
    '/login.php',
    '/cgi-bin',
    '/boaform'
  ];

  // if the request path is in the restricted path list, return a custom response
  if (restrictedPaths.some(path => pathname.includes(path))) {
    return new Response('Fuck off', { status: 420 });
  }

  // restricted pathに含まれない場合は、nullを返す
  return null;
}

export const config = {
  matcher: '/:path*',
};
