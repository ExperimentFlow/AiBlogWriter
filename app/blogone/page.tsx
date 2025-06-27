import React from 'react';

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              AI Blog Writer
            </h1>
          </div>
          <p className="text-gray-600 text-xl">Exploring the future of AI-powered content creation</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8">
          {/* Featured Post */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold rounded-full">
                    ✨ Featured
                  </span>
                  <span className="text-gray-500 text-sm">December 15, 2024</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  The Future of AI-Powered Content Creation
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  Discover how artificial intelligence is revolutionizing the way we create, edit, and distribute content.
                  From automated writing assistants to intelligent content optimization, explore the cutting-edge tools
                  that are reshaping the digital landscape.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">5 min read</span>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Read More →
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AI Innovation</h3>
                  <p className="text-blue-100">Transforming content creation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-sm font-medium">AI Writing Tools</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    AI Tools
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 14, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                  Top 10 AI Writing Tools for 2024
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  A comprehensive guide to the most powerful AI writing assistants that can help you create
                  compelling content faster and more efficiently than ever before.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">3 min read</span>
                  <button className="text-green-600 hover:text-green-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm font-medium">Content Optimization</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Tutorial
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 13, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  How to Optimize Your Content with AI
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Learn the best practices for using AI to enhance your content's SEO, readability, and engagement
                  while maintaining your unique voice and style.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">4 min read</span>
                  <button className="text-purple-600 hover:text-purple-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-sm font-medium">Digital Marketing</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Industry
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 12, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">
                  AI in Digital Marketing: Trends & Predictions
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Explore how AI is transforming digital marketing strategies and what trends we can expect
                  to see in the coming years.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">6 min read</span>
                  <button className="text-orange-600 hover:text-orange-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Post 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-red-400 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">Ethics & Transparency</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Analysis
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 11, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                  The Ethics of AI-Generated Content
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Delve into the ethical considerations surrounding AI-generated content and how to maintain
                  transparency and authenticity in your work.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">7 min read</span>
                  <button className="text-red-600 hover:text-red-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Post 5 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-medium">Content Strategy</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Tips
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 10, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Building Your AI Content Strategy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Create a comprehensive content strategy that leverages AI tools while maintaining your
                  brand's unique voice and connecting with your audience.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">5 min read</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Post 6 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-teal-400 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-medium">Success Stories</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Case Study
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-sm">December 9, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-600 transition-colors">
                  Success Stories: AI-Powered Blog Growth
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Real-world examples of how bloggers and content creators have successfully integrated
                  AI tools to scale their content production and grow their audience.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">8 min read</span>
                  <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-3">Stay Updated with AI Trends</h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Get the latest insights on AI-powered content creation, exclusive tips, and industry updates
                delivered directly to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-2 rounded-xl text-gray-900 placeholder-black border border-white/40 focus:outline-none focus:ring focus:ring-white/40 text-lg"
                />
                <button className="px-8 py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-4">Join 10,000+ content creators already subscribed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;