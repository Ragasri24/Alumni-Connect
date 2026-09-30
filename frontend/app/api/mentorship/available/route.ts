import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        a.alumni_id,
        a.name,
        a.batch,
        a.company,
        a.job_role,
        a.location,
        a.skills,
        a.linkedin,
        d.dept_id,
        d.dept_name
      FROM alumni a
      JOIN departments d
        ON a.dept_id = d.dept_id
      WHERE a.mentorship_available = TRUE
      ORDER BY a.name
    `);

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch available mentors" },
      { status: 500 }
    );
  }
}