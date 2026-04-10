"use client"
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const MyAccountPage = () => {
  const router = useRouter();
  const loggedInUser = useSelector((root:any) => root.user.loggedInUser);

  useEffect(() => {
    if (!loggedInUser) {
      router.push('/login');
    }
  }, [loggedInUser, router]);

  if (!loggedInUser) {
    return null; // Return null while redirecting to avoid flashing content
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Account</h1>
      <p>Welcome back, {loggedInUser.firstName} {loggedInUser.lastName}</p>
    </div>
  )
}

export default MyAccountPage