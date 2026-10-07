"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  department?: string;
  current_year?: number;
  batch?: number;
  section?: string;
};

type AuthData = {
  authenticated: boolean;
  user?: User;
  role?: string;
};

export default function Navbar() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setAuth(data);
        } else {
          setAuth({ authenticated: false });
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuth({ authenticated: false });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 p-6 text-white">
      <h1 className="text-2xl font-bold">
        Alumni Connect
      </h1>

      <p className="mt-1 text-sm text-gray-400">
        College Alumni Network
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <a
          href="/"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Home
        </a>

        <a
          href="/alumni"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Alumni
        </a>

        <div className="flex flex-col gap-1">
          <p className="px-4 py-2 font-medium">
            Mentorship
          </p>

          <a
            href="/mentorship"
            className="rounded-lg px-6 py-2 text-sm hover:bg-gray-800"
          >
            Find a Mentor
          </a>

          <a
            href="/mentorship/requests"
            className="rounded-lg px-6 py-2 text-sm hover:bg-gray-800"
          >
            My Requests
          </a>
        </div>

        <a
          href="/jobs"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Jobs & Internships
        </a>

        <a
          href="/events"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Events
        </a>
      </div>

      <div className="mt-auto">
        {loading ? (
          <p className="px-4 py-3 text-sm text-gray-400">
            Checking login...
          </p>
        ) : auth?.authenticated && auth.user ? (
          <div className="border-t border-gray-700 pt-4">
            <p className="px-4 font-medium">
              {auth.user.name}
            </p>

            <p className="mt-1 px-4 text-xs text-gray-400">
              {auth.role}
            </p>

            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg px-4 py-3 text-left hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}