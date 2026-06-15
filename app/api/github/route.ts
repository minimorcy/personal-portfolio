import { NextResponse } from 'next/server';
import { fetchGitHub, getUsername } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = getUsername();
    const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=created&direction=desc`;
    const data = await fetchGitHub<any[]>(url);
    const sorted = Array.isArray(data)
      ? [...data].sort((a, b) => {
          const da = new Date(a?.created_at ?? 0).getTime();
          const db = new Date(b?.created_at ?? 0).getTime();
          return db - da; // newest first
        })
      : data;
    return NextResponse.json(sorted, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

