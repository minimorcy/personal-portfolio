import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || 'your-github-username';
    const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=created&direction=desc`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'nextjs-portfolio',
        'Accept': 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub error' }, { status: 502 });
    }

    const data = await res.json();
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

