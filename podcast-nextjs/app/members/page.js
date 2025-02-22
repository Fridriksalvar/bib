"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Members() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for logged-in user on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/"); // Redirect to landing page if not logged in
    } else {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    }
  }, []);

  // Fetch videos from API
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/videos")
      .then((res) => {
        console.log("API Response:", res.data);
        const fetchedVideos = res.data.data || [];

        fetchedVideos.sort((a, b) => {
          const dateA = new Date(a.publishedAt || "2000-01-01");
          const dateB = new Date(b.publishedAt || "2000-01-01");
          return dateB - dateA;
        });

        setVideos(fetchedVideos);
        setCurrentEpisode(fetchedVideos[0]);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Refresh the page
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 p-6">Checking authentication...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ✅ User Info & Login/Signup Links */}
      <div className="flex justify-end space-x-4 mb-4">
        {user ? (
          <>
            <span className="text-green-600">Logged in as {user.username}</span>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Podcast Episodes</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content (Current Episode) */}
        <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
          {currentEpisode && (
            <>
              <h2 className="text-xl font-semibold">
                {currentEpisode?.Title || "No Title"}
              </h2>
              <p className="text-gray-600">
                {currentEpisode?.Description?.[0]?.children?.[0]?.text || "No Description"}
              </p>

              {/* Cloudflare Stream Video */}
              {currentEpisode.videoUrl ? (
                <div className="mt-4">
                  <iframe
                    src={currentEpisode.videoUrl}
                    width="100%"
                    height="360"
                    className="rounded-lg shadow-md"
                    allow="autoplay"
                  ></iframe>
                </div>
              ) : (
                <p className="text-red-500">No video available</p>
              )}
            </>
          )}
        </div>

        {/* Sidebar (Older Episodes) */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Older Episodes</h3>
          {videos.length <= 1 ? (
            <p className="text-gray-500">No older episodes available</p>
          ) : (
            <ul className="space-y-4">
              {videos.slice(1).map((video) => (
                <li key={video.id}>
                  <button
                    onClick={() => setCurrentEpisode(video)}
                    className="block text-blue-600 hover:underline"
                  >
                    {video.Title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}