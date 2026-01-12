import { NextResponse } from 'next/server';

// Mock OAuth callback handler
export async function GET(request: Request) {
  // In a real implementation, this would handle OAuth callback
  // For the prototype, we just redirect to loading
  return NextResponse.redirect(new URL('/loading', request.url));
}
