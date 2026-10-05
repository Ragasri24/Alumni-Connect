"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading users...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">
          {error}
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

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-500"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Alumni">Alumni</option>
          <option value="Faculty">Faculty</option>
        </select>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            No users found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
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

                  <th className="px-5 py-3 font-semibold text-gray-700">
                    Department
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={`${user.role}-${user.id}`}
                    className={
                      index !== filteredUsers.length - 1
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

                    <td className="px-5 py-3 text-gray-600">
                      {user.department}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}