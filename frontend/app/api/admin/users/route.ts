import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);

    const students = await pool.query(`
      SELECT
        s.student_id AS id,
        s.name,
        s.email,
        'Student' AS role,
        d.dept_name AS department
      FROM students s
      JOIN departments d
        ON s.dept_id = d.dept_id
      ORDER BY s.name
    `);

    const alumni = await pool.query(`
      SELECT
        a.alumni_id AS id,
        a.name,
        a.email,
        'Alumni' AS role,
        d.dept_name AS department
      FROM alumni a
      JOIN departments d
        ON a.dept_id = d.dept_id
      ORDER BY a.name
    `);

    const faculty = await pool.query(`
      SELECT
        f.faculty_id AS id,
        f.name,
        f.email,
        'Faculty' AS role,
        d.dept_name AS department
      FROM faculty f
      JOIN departments d
        ON f.dept_id = d.dept_id
      ORDER BY f.name
    `);

    return Response.json([
      ...students.rows,
      ...alumni.rows,
      ...faculty.rows,
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    console.error(error);

    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}