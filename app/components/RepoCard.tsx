type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  created_at?: string;
};

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-500',
  Java: 'bg-red-500',
  'C++': 'bg-pink-500',
  C: 'bg-gray-500',
  'C#': 'bg-indigo-500',
  HTML: 'bg-red-600',
  CSS: 'bg-blue-600',
  Assembly: 'bg-gray-600',
  'Jupyter Notebook': 'bg-orange-600',
};

export default function RepoCard({ repo }: { repo: Repo }) {
  const createdLabel = repo.created_at
    ? new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(repo.created_at))
    : undefined;
  
  const language = repo.language || 'Unknown';
  const languageColor = languageColors[language] || 'bg-gray-400';
  
  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-800">
      <a 
        href={repo.html_url} 
        target="_blank" 
        className="text-blue-600 dark:text-blue-400 font-medium hover:underline" 
        rel="noreferrer"
      >
        {repo.name}
      </a>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{repo.description || 'No description available'}</p>
      
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Language:</span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${languageColor}`}>
          {language}
        </span>
      </div>
      
      {createdLabel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Created: {createdLabel}</p>
      )}
    </div>
  );
}

