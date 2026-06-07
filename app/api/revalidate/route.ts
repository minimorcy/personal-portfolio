import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = req.headers.get('x-revalidate-token') || new URL(req.url).searchParams.get('token');

  if (!secret || provided !== secret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // Revalidate homepage (and optionally others)
  revalidatePath('/');
  return NextResponse.json({ revalidated: true });
}

