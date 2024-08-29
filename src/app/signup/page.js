"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json(); // Parse response as JSON
    if (res.ok) {
      Cookies.set('token', data.token);
      router.push('/'); // Use router.push for navigation
    } else {
      console.error("Sign-up error:", data.error || "Unknown error");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-black'>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
          className='border rounded p-2'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='border rounded p-2'
        />
        <button type="submit" className=' p-3 bg-blue-500 rounded-lg'>Sign Up</button>
      </form>
      <p className='mt-4'>Already have an account? <Link href="/login">Login</Link></p>
    </>
  );
};

export default SignUp;
