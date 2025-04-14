import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Zeta's Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Welcome to my personal blog where I share my thoughts and experiences.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {/* Featured Post */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Getting Started with Next.js
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A comprehensive guide to building modern web applications with Next.js.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>April 14, 2024</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
            </div>
          </article>

          {/* Recent Posts */}
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((post) => (
              <article key={post} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Post Title {post}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    A brief description of the post content goes here.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>April {14 - post}, 2024</span>
                    <span className="mx-2">•</span>
                    <span>{3 + post} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Zeta's Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
