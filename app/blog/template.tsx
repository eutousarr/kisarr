'use client';

import BlogNav from '../components/BlogNav';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className='bg-gray-50 max-w-7xl mx-auto min-h-screen'>
        <BlogNav />
        <div className="mb-10 mt-8 px-1 md:px-[5%]">{children}</div>
      </section>
  );
}
