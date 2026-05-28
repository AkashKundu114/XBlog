const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Platform administrator and lead writer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });
  console.log('✅ Admin:', admin.email);

  const authorPassword = await bcrypt.hash('Author@123456', 12);
  await prisma.user.upsert({
    where: { email: 'author@blog.com' },
    update: {},
    create: {
      email: 'author@blog.com',
      passwordHash: authorPassword,
      name: 'Jane Doe',
      role: 'AUTHOR',
      bio: 'Senior software engineer and technical writer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
  });
  console.log('✅ Author: author@blog.com');

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'technology' }, update: {}, create: { name: 'Technology', slug: 'technology', description: 'Latest in tech', color: '#6366f1' } }),
    prisma.category.upsert({ where: { slug: 'design' }, update: {}, create: { name: 'Design', slug: 'design', description: 'UI/UX and visual design', color: '#f59e0b' } }),
    prisma.category.upsert({ where: { slug: 'development' }, update: {}, create: { name: 'Development', slug: 'development', description: 'Software development', color: '#10b981' } }),
    prisma.category.upsert({ where: { slug: 'tutorials' }, update: {}, create: { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides', color: '#3b82f6' } }),
  ]);
  console.log('✅ Categories:', categories.length);

  const tagNames = ['React', 'JavaScript', 'Node.js', 'CSS', 'Next.js', 'PostgreSQL', 'API', 'Performance'];
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/\./g, '').replace(/\s/g, '-') },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\./g, '').replace(/\s/g, '-') },
      })
    )
  );
  console.log('✅ Tags:', tags.length);

  const postsData = [
    {
      title: 'Building a Modern Blog with Next.js 14 and App Router',
      slug: 'building-modern-blog-nextjs-14',
      excerpt: 'A comprehensive guide to building a production-ready blog using the latest Next.js features.',
      content: '<h2>Introduction</h2><p>Next.js 14 introduces powerful features that make building blogs easier than ever. With the App Router, you get seamless file-based routing, React Server Components for optimal performance, and built-in ISR support.</p><h2>Setting Up the Project</h2><p>Start by creating a new Next.js project with the App Router enabled. This gives you access to all modern React features.</p><h2>Key Features</h2><ul><li>Server Components for faster initial load</li><li>Incremental Static Regeneration for dynamic content</li><li>Built-in image optimization</li><li>Edge Runtime support</li></ul>',
      status: 'PUBLISHED', featured: true, readTime: 8,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      publishedAt: new Date(), categoryId: categories[0].id,
      tagIds: [tags[0].id, tags[4].id, tags[1].id],
    },
    {
      title: 'JavaScript Best Practices for Large Scale Applications',
      slug: 'javascript-best-practices-large-scale',
      excerpt: 'Explore advanced JavaScript patterns and best practices for building maintainable, scalable applications.',
      content: '<h2>Why Patterns Matter</h2><p>Good patterns in large-scale JavaScript applications lead to cleaner, more maintainable code. Learn about module patterns, design principles, and architecture decisions that make your codebase scale.</p><h2>Key Patterns</h2><p>From the module pattern to the observer pattern, these time-tested approaches solve common software design challenges.</p>',
      status: 'PUBLISHED', featured: false, readTime: 12,
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      publishedAt: new Date(Date.now() - 86400000), categoryId: categories[2].id,
      tagIds: [tags[1].id, tags[6].id],
    },
    {
      title: 'Mastering CSS Grid and Flexbox for Modern Layouts',
      slug: 'mastering-css-grid-flexbox-layouts',
      excerpt: 'A deep dive into CSS Grid and Flexbox — the two layout systems that power modern web design.',
      content: '<h2>CSS Grid vs Flexbox</h2><p>Understanding when to use Grid versus Flexbox is crucial. Grid excels at two-dimensional layouts while Flexbox is perfect for one-dimensional alignment.</p><h2>Grid Fundamentals</h2><p>Template areas, auto-fill, minmax — these powerful Grid features let you create complex responsive layouts with minimal CSS.</p>',
      status: 'PUBLISHED', featured: true, readTime: 10,
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      publishedAt: new Date(Date.now() - 172800000), categoryId: categories[1].id,
      tagIds: [tags[3].id],
    },
    {
      title: 'PostgreSQL Performance Tuning: Indexes and Query Optimization',
      slug: 'postgresql-performance-tuning-indexes',
      excerpt: 'Learn how to optimize your PostgreSQL database for maximum performance.',
      content: '<h2>Understanding Query Plans</h2><p>EXPLAIN ANALYZE is your best friend for understanding how PostgreSQL executes queries. Learn to read query plans and identify bottlenecks.</p><h2>Indexing Strategies</h2><p>B-tree, GIN, GiST — different index types serve different purposes. Know when to use each one for maximum performance.</p>',
      status: 'PUBLISHED', featured: false, readTime: 15,
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
      publishedAt: new Date(Date.now() - 259200000), categoryId: categories[2].id,
      tagIds: [tags[5].id, tags[7].id],
    },
    {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-nodejs-express',
      excerpt: 'A complete tutorial on building production-ready REST APIs using Node.js and Express.',
      content: '<h2>Project Setup</h2><p>Starting a Node.js API project with the right structure is crucial. We cover folder organization and environment management.</p><h2>Middleware Architecture</h2><p>Authentication, validation, error handling, and logging — these cross-cutting concerns need systematic middleware handling.</p>',
      status: 'PUBLISHED', featured: false, readTime: 18,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      publishedAt: new Date(Date.now() - 345600000), categoryId: categories[3].id,
      tagIds: [tags[2].id, tags[1].id, tags[6].id],
    },
    {
      title: 'Web Performance: Core Web Vitals Deep Dive',
      slug: 'web-performance-core-web-vitals',
      excerpt: 'Understanding and optimizing Core Web Vitals for better user experience and search rankings.',
      content: '<h2>What Are Core Web Vitals?</h2><p>Google Core Web Vitals measure real-world user experience through LCP, FID, and CLS metrics.</p>',
      status: 'DRAFT', featured: false, readTime: 9,
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      publishedAt: null, categoryId: categories[0].id,
      tagIds: [tags[7].id, tags[4].id],
    },
  ];

  for (const { tagIds, ...data } of postsData) {
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, authorId: admin.id, tags: { create: tagIds.map(tagId => ({ tagId })) } },
    });
  }
  console.log('✅ Posts:', postsData.length);
  console.log('\n🎉 Seeding complete!');
  console.log('🔑 Admin login: admin@blog.com / Admin@123456');
  console.log('🔑 Author login: author@blog.com / Author@123456');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
