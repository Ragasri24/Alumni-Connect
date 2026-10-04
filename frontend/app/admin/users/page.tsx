"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading users...
        </p>
      </main>
    );
  }

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          View students, alumni, and faculty members.
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 font-semibold text-gray-700">
                Name
              </th>

              <th className="px-5 py-3 font-semibold text-gray-700">
                Email
              </th>

              <th className="px-5 py-3 font-semibold text-gray-700">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={`${user.role}-${user.id}`}
                className={
                  index !== users.length - 1
                    ? "border-b"
                    : ""
                }
              >
                <td className="px-5 py-3 font-medium text-gray-900">
                  {user.name}
                </td>

                <td className="px-5 py-3 text-gray-600">
                  {user.email}
                </td>

                <td className="px-5 py-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}