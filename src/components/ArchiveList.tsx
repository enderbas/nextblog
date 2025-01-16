'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { ArchiveData } from '../lib/posts';

interface ArchiveListProps {
  archiveData: ArchiveData;
}

const MONTHS = {
  '01': 'Ocak',
  '02': 'Şubat',
  '03': 'Mart',
  '04': 'Nisan',
  '05': 'Mayıs',
  '06': 'Haziran',
  '07': 'Temmuz',
  '08': 'Ağustos',
  '09': 'Eylül',
  '10': 'Ekim',
  '11': 'Kasım',
  '12': 'Aralık'
};

export default function ArchiveList({ archiveData }: ArchiveListProps) {
  const { theme } = useTheme();
  const [expandedYears, setExpandedYears] = useState<string[]>([]);

  const toggleYear = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Yılları ters sıralayalım (en yeni en üstte)
  const years = Object.keys(archiveData).sort((a, b) => b.localeCompare(a));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Blog Arşivi
            </h1>
            <Link
              href="/"
              className={`inline-flex items-center gap-2 hover:text-blue-500 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Arşiv Listesi */}
          <div className="space-y-6">
            {years.map(year => (
              <div
                key={year}
                className={`rounded-lg overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <button
                  onClick={() => toggleYear(year)}
                  className={`w-full px-6 py-4 flex justify-between items-center ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <h2 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {year}
                  </h2>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedYears.includes(year) ? 'rotate-180' : ''
                    } ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedYears.includes(year) && (
                  <div className="px-6 pb-4 space-y-4">
                    {Object.keys(archiveData[year])
                      .sort((a, b) => b.localeCompare(a)) // Ayları ters sırala
                      .map(month => (
                        <div key={month} className="space-y-2">
                          <h3 className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {MONTHS[month as keyof typeof MONTHS]}
                          </h3>
                          <div className="space-y-2 ml-4">
                            {archiveData[year][month].map(post => (
                              <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className={`block py-2 hover:text-blue-500 transition-colors ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <time
                                    dateTime={post.date}
                                    className="whitespace-nowrap"
                                  >
                                    {post.date}
                                  </time>
                                  <span className={
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }>
                                    {post.title}
                                  </span>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex gap-2 flex-wrap mt-1 ml-20">
                                    {post.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className={`text-sm px-2 py-0.5 rounded-full ${
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
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 