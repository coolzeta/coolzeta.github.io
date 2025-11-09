import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // 检查是否访问根路径
    if (request.nextUrl.pathname === '/') {
        // 从请求头中获取用户首选语言，如果没有则默认为英文
        const acceptLanguage = request.headers.get('accept-language');
        let defaultLocale = 'en';

        // 简单的语言检测，检查是否包含中文
        if (acceptLanguage && acceptLanguage.includes('zh')) {
            defaultLocale = 'zh';
        }

        // 重定向到包含语言的路径
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // 匹配所有路径，但排除静态文件
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};