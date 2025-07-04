import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Set a header to identify the request
  requestHeaders.set('x-search-engine', 'local-data-extraction');
  
  // Create a response with proper headers for file uploads
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Add CORS headers to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
};
