// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPosts, urlFor, type BlogPost } from "../sanity.io";
import Image from "next/image";
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(posts.map((post) => post.category).filter(Boolean)),
  ];

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="text-center">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="blog-page">
      <div className="container">
        {/* Header */}
        <div className="blog-header">
          <h2 className="text-center">Blog</h2>
          <h3 className="text-center">
            Thoughts, tutorials, and insights about web development, design, and
            technology.
          </h3>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-button ${
                  selectedCategory === category ? "active" : ""
                }`}
              >
                {category === "all" ? "All Posts" : category}
              </button>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post._id} className="blog-card">
                {post.featuredImage && (
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="blog-image-link"
                  >
                    <Image
                      src={urlFor(post.featuredImage)
                        .width(400)
                        .height(200)
                        .url()}
                      alt={post.title}
                      className="blog-image"
                      height={200}
                      width={400}
                    />
                  </Link>
                )}
                <div className="blog-content">
                  <div className="blog-meta">
                    {post.category && (
                      <span className="blog-category">{post.category}</span>
                    )}
                    <time className="blog-date">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </time>
                  </div>

                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="blog-title-link"
                  >
                    <h2 className="blog-title">{post.title}</h2>
                  </Link>

                  <p className="blog-excerpt">{post.excerpt}</p>

                  <div className="blog-footer">
                    <span className="blog-author">By {post.author}</span>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="blog-read-more"
                    >
                      Read more →
                    </Link>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="blog-tags">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blog-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty text-center">
            <p>
              {selectedCategory === "all"
                ? "No blog posts yet. Check back soon!"
                : `No posts found in ${selectedCategory} category.`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
