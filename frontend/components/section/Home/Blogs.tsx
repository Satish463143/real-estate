"use client";
import React from "react";

const posts = [
  {
    id: 1,
    category: "Market Trends",
    catCls: "bg-blue-100 text-blue-700",
    title: "Kathmandu Real Estate Market Outlook 2025: What Buyers Need to Know",
    excerpt: "Explore the latest market trends, price forecasts, and investment opportunities shaping Kathmandu's booming property landscape this year.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    author: "Binod Shrestha",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    date: "Mar 28, 2025",
    readTime: "5 min read",
  },
  {
    id: 2,
    category: "Buying Guide",
    catCls: "bg-emerald-100 text-emerald-700",
    title: "10 Essential Tips for First-Time Home Buyers in Nepal",
    excerpt: "From financing to negotiations, this comprehensive guide covers everything first-time buyers need to know before making their biggest investment.",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
    author: "Sunita Rai",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    date: "Mar 22, 2025",
    readTime: "7 min read",
  },
  {
    id: 3,
    category: "Investment",
    catCls: "bg-amber-100 text-amber-700",
    title: "Why Pokhara is Becoming Nepal's Hottest Real Estate Investment Hub",
    excerpt: "Tourism boom and infrastructure development are making Pokhara an unmissable opportunity for savvy property investors seeking high returns.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    author: "Narayan Adhikari",
    authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80",
    date: "Mar 15, 2025",
    readTime: "6 min read",
  },
];

const Blogs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent-dark text-xs font-bold tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Insights & Tips
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-3">
              Latest <span className="text-accent">Blog Posts</span>
            </h2>
            <div className="w-12 h-0.5 bg-[linear-gradient(90deg,#C9A84C,#E2C270)] rounded-full mb-4" />
            <p className="text-gray-500 max-w-md leading-relaxed">
              Stay informed with expert insights, market trends, and practical guides to help you make smart property decisions.
            </p>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
          >
            All Articles
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(10,22,40,0.08)] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(10,22,40,0.15)] transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.68rem] font-bold ${post.catCls}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-display font-bold text-primary text-lg leading-snug mb-3 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-gray-600">{post.author}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.68rem] text-gray-400">{post.date}</div>
                    <div className="text-[0.68rem] text-gray-400">{post.readTime}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;