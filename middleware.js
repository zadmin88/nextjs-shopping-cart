export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/checkout',
    '/dashboard',
    '/api/keys/:path*',
    '/api/orders/:path*',
  ],
};
