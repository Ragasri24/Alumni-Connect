import pool from "@/lib/db";

export async function GET() {
  try {
    const students = await pool.query(`
      SELECT
        student_id AS id,
        name,
        email,
        'Student' AS role
      FROM students
      ORDER BY name
    `);

    const alumni = await pool.query(`
      SELECT
        alumni_id AS id,
        name,
        email,
        'Alumni' AS role
      FROM alumni
      ORDER BY name
    `);

    const faculty = await pool.query(`
      SELECT
        faculty_id AS id,
        name,
        email,
        'Faculty' AS role
      FROM faculty
      ORDER BY name
    `);

    return Response.json([
      ...students.rows,
      ...alumni.rows,
      ...faculty.rows,
    ]);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}