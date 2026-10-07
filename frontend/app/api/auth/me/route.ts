import { getSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let user = null;

    if (session.role === "STUDENT") {
      const result = await pool.query(
        `
        SELECT
          s.student_id AS id,
          s.name,
          s.email,
          s.current_year,
          s.batch,
          s.section,
          d.dept_name AS department
        FROM students s
        JOIN departments d
          ON s.dept_id = d.dept_id
        WHERE s.student_id = $1
        `,
        [session.user_id]
      );

      user = result.rows[0];
    } else if (session.role === "ALUMNI") {
      const result = await pool.query(
        `
        SELECT
          a.alumni_id AS id,
          a.name,
          a.email,
          a.batch,
          a.company,
          a.job_role,
          a.location,
          d.dept_name AS department
        FROM alumni a
        JOIN departments d
          ON a.dept_id = d.dept_id
        WHERE a.alumni_id = $1
        `,
        [session.user_id]
      );

      user = result.rows[0];
    } else if (session.role === "FACULTY") {
      const result = await pool.query(
        `
        SELECT
          f.faculty_id AS id,
          f.name,
          f.email,
          f.designation,
          d.dept_name AS department
        FROM faculty f
        JOIN departments d
          ON f.dept_id = d.dept_id
        WHERE f.faculty_id = $1
        `,
        [session.user_id]
      );

      user = result.rows[0];
    } else if (session.role === "ADMIN") {
      const result = await pool.query(
        `
        SELECT
          admin_id AS id,
          name
        FROM admin
        WHERE admin_id = $1
        `,
        [session.user_id]
      );

      user = result.rows[0];
    }

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      authenticated: true,
      user,
      role: session.role,
    });
  } catch (error) {
    console.error("Auth check error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}