'use client';

import { useState, useMemo, useEffect } from 'react';
import RepoCard from './RepoCard';

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  created_at?: string;
};

type PaginatedReposProps = {
  repos: Repo[];
};

type YearTab = {
  year: string;
  label: string;
  count: number;
};

export default function PaginatedRepos({ repos }: PaginatedReposProps) {
  const entriesPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Dynamically determine years and group repos
  const { availableTabs, reposByYear } = useMemo(() => {
    const reposByYearMap: Record<number, Repo[]> = {};
    const years: number[] = [];

    // Group repos by year
    repos.forEach((repo) => {
      if (repo.created_at) {
        const year = new Date(repo.created_at).getFullYear();
        if (!reposByYearMap[year]) {
          reposByYearMap[year] = [];
          years.push(year);
        }
        reposByYearMap[year].push(repo);
      }
    });

    // Sort years descending
    years.sort((a, b) => b - a);

    // Build tabs: latest year, next year (if exists), and older
    const tabs: YearTab[] = [];
    const reposByYear: Record<string, Repo[]> = {};

    if (years.length > 0) {
      const latestYear = years[0];
      const latestYearRepos = reposByYearMap[latestYear];
      tabs.push({
        year: latestYear.toString(),
        label: latestYear.toString(),
        count: latestYearRepos.length,
      });
      reposByYear[latestYear.toString()] = latestYearRepos;

      // Check for next year (latestYear - 1)
      if (years.length > 1 && years[1] === latestYear - 1) {
        const nextYear = years[1];
        const nextYearRepos = reposByYearMap[nextYear];
        tabs.push({
          year: nextYear.toString(),
          label: nextYear.toString(),
          count: nextYearRepos.length,
        });
        reposByYear[nextYear.toString()] = nextYearRepos;
      }

      // Collect all older repos (everything before the second tab or latest year)
      const olderRepos: Repo[] = [];
      const cutoffYear = tabs.length === 2 ? parseInt(tabs[1].year) : latestYear;
      years.forEach((year) => {
        if (year < cutoffYear) {
          olderRepos.push(...reposByYearMap[year]);
        }
      });

      if (olderRepos.length > 0) {
        tabs.push({
          year: 'older',
          label: 'Older',
          count: olderRepos.length,
        });
        reposByYear['older'] = olderRepos;
      }
    }

    return { availableTabs: tabs, reposByYear };
  }, [repos]);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Set default selected year to the latest year when tabs are available
  useEffect(() => {
    if (availableTabs.length > 0 && (!selectedYear || !reposByYear[selectedYear])) {
      setSelectedYear(availableTabs[0].year);
      setCurrentPage(1);
    }
  }, [availableTabs, reposByYear, selectedYear]);

  // Get all available languages from repos
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) {
        languages.add(repo.language);
      }
    });
    return Array.from(languages).sort();
  }, [repos]);

  // Filter repos by year, search query, and language
  const filteredRepos = useMemo(() => {
    let filtered = reposByYear[selectedYear] || [];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((repo) => {
        const nameMatch = repo.name.toLowerCase().includes(query);
        const descMatch = repo.description?.toLowerCase().includes(query) || false;
        const langMatch = repo.language?.toLowerCase().includes(query) || false;
        return nameMatch || descMatch || langMatch;
      });
    }
    
    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage);
    }
    
    return filtered;
  }, [reposByYear, selectedYear, searchQuery, selectedLanguage]);

  const totalPages = Math.ceil(filteredRepos.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayRepos = filteredRepos.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, searchQuery, selectedLanguage]);

  // Reset to page 1 when year changes
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleLanguageFilter = (language: string | null) => {
    setSelectedLanguage(language === selectedLanguage ? null : language);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage(null);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Year tabs - show below GitHub Projects title */}
      {availableTabs.length > 0 && (
        <div className="mt-2 mb-4 flex items-center gap-2 flex-wrap border-b border-gray-200 dark:border-gray-700">
          {availableTabs.map((tab) => (
            <button
              key={tab.year}
              onClick={() => handleYearChange(tab.year)}
              disabled={tab.count === 0}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                tab.count === 0
                  ? 'border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : selectedYear === tab.year
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      )}

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search repositories by name, description, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {(searchQuery || selectedLanguage) && (
            <button
              onClick={clearFilters}
              className="absolute right-3 top-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear filters"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Language filters */}
      {availableLanguages.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by language:</span>
            <button
              onClick={() => handleLanguageFilter(null)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedLanguage === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {availableLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageFilter(language)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedLanguage === language
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      {(searchQuery || selectedLanguage) && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedLanguage && ` in ${selectedLanguage}`}
        </div>
      )}

      {/* Repos grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayRepos.length > 0 ? (
          displayRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">
            No projects found{searchQuery || selectedLanguage ? ' matching your filters' : ' for this year'}.
          </p>
        )}
      </div>

      {/* Pagination controls - moved to bottom */}
      {filteredRepos.length > entriesPerPage && (
        <div className="mt-6 mb-4 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded transition-colors ${
              currentPage === 1
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

