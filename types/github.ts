export interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  created_at?: string;
  stargazers_count?: number;
  forks_count?: number;
  topics?: string[];
  homepage?: string | null;
}

export interface GitHubUser {
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
  name?: string | null;
  company?: string | null;
  location?: string | null;
  blog?: string;
}
