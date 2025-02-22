"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (temporary check using localStorage)
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/members"); // Redirect logged-in users
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Podcast</h1>
      <p className="text-gray-600 mb-4">Sign up or log in to access exclusive content.</p>
      <div className="flex space-x-4">
        <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Log In</a>
        <a href="/signup" className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</a>
      </div>
    </div>
  );
}
