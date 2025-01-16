'use client';

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { PostData } from '../lib/posts';

interface BlogPostProps {
  post: PostData;
  relatedPosts: PostData[];
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <main className="p-8 max-w-4xl mx-auto">
        <Link 
          href="/" 
          className={`inline-flex items-center gap-2 mb-8 hover:text-blue-500 transition-colors ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Dön
        </Link>
        
        <article className={`prose prose-lg max-w-none ${
          theme === 'dark' 
            ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-gray-200' 
            : ''
        }`}>
          <header className="mb-8 not-prose">
            <h1 className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
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
          </header>

          <div 
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            className={`mt-8 ${theme === 'dark' ? `
                prose-code:text-gray-300 prose-code:bg-gray-800
                prose-pre:bg-gray-800
                prose-a:text-blue-400
                prose-blockquote:text-gray-300 prose-blockquote:border-gray-700
                prose-li:text-gray-300
              ` : `
                prose-code:text-gray-700 prose-code:bg-gray-100
                prose-pre:bg-gray-100
                prose-a:text-blue-600
                prose-blockquote:text-gray-700 prose-blockquote:border-gray-300
                prose-li:text-gray-700
              `}
              prose-a:no-underline hover:prose-a:underline
            `}
          />
        </article>

        {relatedPosts.length > 0 && (
          <aside className={`mt-12 p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Bunları da Okuyabilirsiniz
            </h2>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.id}`}
                  className={`block p-4 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {relatedPost.title}
                  </h3>
                  <time
                    dateTime={relatedPost.date}
                    className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  >
                    {relatedPost.date}
                  </time>
                  {relatedPost.tags && relatedPost.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {relatedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-sm rounded-full ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
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
          </aside>
        )}

        <div className={`mt-12 pt-8 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 hover:text-blue-500 transition-colors ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Diğer Yazılara Dön
          </Link>
        </div>
      </main>
    </div>
  );
} 