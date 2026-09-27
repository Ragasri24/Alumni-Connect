"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Alumni = {
  alumni_id: number;
  name: string;
  batch: number;
  company: string;
  job_role: string;
  location: string;
  skills: string;
  linkedin: string;
  dept_id: number;
  dept_name: string;
};

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [batch, setBatch] = useState("");

  // Fetch alumni
  useEffect(() => {
    fetch("/api/alumni")
      .then((res) => res.json())
      .then((data) => setAlumni(data));
  }, []);

  // Close filters when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Get unique filter options
  const companies = [
    ...new Set(alumni.map((person) => person.company)),
  ];

  const jobRoles = [
    ...new Set(alumni.map((person) => person.job_role)),
  ];

  const departments = [
    ...new Set(alumni.map((person) => person.dept_name)),
  ];

  const locations = [
    ...new Set(alumni.map((person) => person.location)),
  ];

  const batches = [
    ...new Set(alumni.map((person) => person.batch)),
  ];

  const allSkills = [
    ...new Set(
      alumni.flatMap((person) =>
        person.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      )
    ),
  ];

  // Select / unselect skill
  function toggleSkill(skill: string) {
    setSelectedSkills((currentSkills) => {
      if (currentSkills.includes(skill)) {
        return currentSkills.filter((item) => item !== skill);
      }

      return [...currentSkills, skill];
    });
  }

  // Filter alumni
  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      `${person.name} ${person.company} ${person.job_role} ${person.location} ${person.skills}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCompany =
      company === "" || person.company === company;

    const matchesJobRole =
      jobRole === "" || person.job_role === jobRole;

    const matchesDepartment =
      department === "" ||
      person.dept_name === department;

    const matchesLocation =
      location === "" ||
      person.location === location;

    const matchesBatch =
      batch === "" ||
      person.batch.toString() === batch;

    // Alumni must have all selected skills
    const personSkills = person.skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase());

    const matchesSkills =
  selectedSkills.length === 0 ||
  selectedSkills.some((skill) =>
    personSkills.includes(skill.toLowerCase())
  );

    return (
      matchesSearch &&
      matchesCompany &&
      matchesJobRole &&
      matchesDepartment &&
      matchesLocation &&
      matchesBatch &&
      matchesSkills
    );
  });

  return (
    <main className="ml-64 min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-gray-900">
        Alumni Directory
      </h1>

      <p className="mt-2 text-gray-600">
        Explore and connect with alumni from our college.
      </p>

      {/* Search Bar */}
      <div className="relative mt-6">
        <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-white">
          <input
            type="text"
            placeholder="Search by name, company, role, location or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 outline-none"
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border-l border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            ⚙ Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            ref={filterRef}
            className="absolute right-0 z-10 mt-2 w-96 rounded-xl bg-white p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Filters
              </h2>

              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">

              {/* Company */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Company
                </label>

                <select
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">
                    All Companies
                  </option>

                  {companies.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Role */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Job Role
                </label>

                <select
                  value={jobRole}
                  onChange={(e) =>
                    setJobRole(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">
                    All Roles
                  </option>

                  {jobRoles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Skills
                </label>

                <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-300 p-3">
                  {allSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex cursor-pointer items-center gap-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />

                      <span className="text-sm">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Department
                </label>

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">
                    All Departments
                  </option>

                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location
                </label>

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">
                    All Locations
                  </option>

                  {locations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Batch
                </label>

                <select
                  value={batch}
                  onChange={(e) =>
                    setBatch(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">
                    All Batches
                  </option>

                  {batches.map((item) => (
                    <option
                      key={item}
                      value={item.toString()}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => {
                  setCompany("");
                  setJobRole("");
                  setSelectedSkills([]);
                  setDepartment("");
                  setLocation("");
                  setBatch("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Clear
              </button>

              <button
                onClick={() => setShowFilters(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Apply Filters
              </button>

            </div>
          </div>
        )}
      </div>

      {/* Alumni Cards */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <Link
  href={`/alumni/${person.alumni_id}`}
  key={person.alumni_id}
  className="block rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
>
            <h2 className="text-xl font-bold">
              {person.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {person.job_role}
            </p>

            <p className="text-gray-500">
              {person.company}
            </p>

            <p className="mt-3 text-gray-500">
              📍 {person.location}
            </p>

            <p className="mt-2 text-gray-500">
              Batch: {person.batch}
            </p>

            <p className="mt-3 text-sm text-gray-600">
              Department: {person.dept_name}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Skills: {person.skills}
            </p>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredAlumni.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          No alumni found.
        </p>
      )}
    </main>
  );
}