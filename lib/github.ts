const GITHUB_API = 'https://api.github.com';
const USERNAME = process.env.GITHUB_USERNAME || 'minimorcy';
const TOKEN = process.env.GITHUB_TOKEN;

export async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API}${endpoint}`;
  const headers: Record<string, string> = {
    'User-Agent': 'nextjs-portfolio',
    'Accept': 'application/vnd.github+json',
  };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status} ${res.statusText} for ${endpoint}`);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const rateLimit = res.headers.get('X-RateLimit-Remaining');
  if (rateLimit && parseInt(rateLimit) < 10) {
    console.warn(`GitHub rate limit low: ${rateLimit} remaining`);
  }

  return res.json() as Promise<T>;
}

export function getUsername(): string {
  return USERNAME;
}
