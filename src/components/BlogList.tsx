'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { PostData } from '../lib/posts';
import { useTheme } from '../context/ThemeContext';

interface BlogListProps {
  initialPosts: PostData[];
  stats: {
    totalPosts: number;
    tagDistribution: [string, number][];
    popularTags: string[];
  };
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function BlogList({ initialPosts, stats }: BlogListProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsPanelOpen, setIsTagsPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  const tagStats = useMemo(() => {
    const stats = new Map<string, number>();
    initialPosts.forEach(post => {
      post.tags?.forEach(tag => {
        stats.set(tag, (stats.get(tag) || 0) + 1);
      });
    });
    return stats;
  }, [initialPosts]);

  const sortPosts = (posts: PostData[], order: 'desc' | 'asc') => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const searchLower = searchQuery.toLowerCase();
      const title = post.title?.toLowerCase() || '';
      const excerpt = post.excerpt?.toLowerCase() || '';
      const tags = Array.isArray(post.tags) ? post.tags.map(tag => tag.toLowerCase()) : [];
      
      const matchesSearch = searchQuery.trim() === '' || (
        title.includes(searchLower) || 
        excerpt.includes(searchLower) ||
        tags.some(tag => tag.includes(searchLower))
      );

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [initialPosts, searchQuery, selectedTags]);

  const sortedPosts = useMemo(() => sortPosts(filteredPosts, sortOrder), [filteredPosts, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Başlık ve tema değiştirme */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Engin Deniz Erbas
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
            }`}
            aria-label={`${theme === 'dark' ? 'Açık' : 'Koyu'} temaya geç`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Sosyal medya linkleri */}
        <div className="flex gap-4 mb-8">
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" 
             className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
            LinkedIn
          </a>
          <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer"
             className={`${theme === 'dark' ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-600'} transition-colors`}>
            YouTube
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"
             className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-500' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
            Twitter
          </a>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Sol sütun - Blog yazıları */}
          <main className="lg:flex-1">
            <div className="mb-8">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <option value="desc">En Yeni</option>
                <option value="asc">En Eski</option>
              </select>

              <button
                onClick={() => setIsTagsPanelOpen(!isTagsPanelOpen)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>Etiketler</span>
                {selectedTags.length > 0 && (
                  <span className={`px-2 py-0.5 text-sm rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>

            {isTagsPanelOpen && (
              <div className={`mb-8 p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                <div className="flex flex-wrap gap-2">
                  {Array.from(tagStats.entries()).map(([tag, count]) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag} ({count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {filteredPosts.length} yazı bulundu
              </span>
            </div>

            <div className="space-y-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className={`p-6 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}
                >
                  <Link
                    href={`/posts/${post.id}`}
                    className={`block group ${
                      theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'
                    }`}
                  >
                    <h2 className={`text-2xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <time
                      dateTime={post.date}
                      className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    >
                      {post.date}
                    </time>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-sm rounded-full ${
                              theme === 'dark'
                                ? 'bg-gray-800 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {post.excerpt && (
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {post.excerpt}
                    </p>
                  )}
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col gap-4">
                {/* Items per page selector */}
                <div className="flex justify-end items-center gap-2 text-sm">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className={`px-2 py-1 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    yazı/sayfa
                  </span>
                </div>

                {/* Page navigation */}
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Sadece mevcut sayfayı ve yanındaki bir sayfayı göster
                    if (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(currentPage - page) <= 1
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : theme === 'dark'
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={page}
                          className={`w-8 h-8 flex items-center justify-center ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          ⋯
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Sağ sütun - Blog istatistikleri */}
          <aside className="lg:w-80 mt-8 lg:mt-0">
            <div className="space-y-4">
              {/* İstatistikler kartı */}
              <div className={`sticky top-8 p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Blog İstatistikleri
                </h2>
                <div className={`space-y-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <p>Toplam Yazı: {stats.totalPosts}</p>
                  <div>
                    <h3 className="font-semibold mb-2">Popüler Etiketler:</h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.popularTags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-sm rounded-full ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag} ({stats.tagDistribution.find(([t]) => t === tag)?.[1]})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arşiv kartı */}
              <Link
                href="/archive"
                className={`block p-6 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Blog Arşivi
                    </h2>
                    <p className={`mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Yıl ve ay bazında tüm yazılar
                    </p>
                  </div>
                  <svg 
                    className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 