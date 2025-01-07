import { SignIn } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
