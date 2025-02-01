import React from 'react';
import BlogNav from './BlogNav';

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <section className='bg-gray-50 max-w-7xl mx-auto min-h-screen'>
      <BlogNav />
      <div className="mb-10 mt-8 px-2 md:px-[10%]">{children}</div>
    </section>
  );
};

export default Wrapper;
