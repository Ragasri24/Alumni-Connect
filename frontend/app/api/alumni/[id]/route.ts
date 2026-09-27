import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `
      SELECT
        a.alumni_id,
        a.name,
        a.batch,
        a.rollno,
        a.section,
        a.email,
        a.gender,
        a.location,
        a.company,
        a.job_role,
        a.skills,
        a.mentorships_done,
        a.linkedin,
        a.past_job_roles,
        a.events_attended,
        d.dept_id,
        d.dept_name
      FROM alumni a
      JOIN departments d
        ON a.dept_id = d.dept_id
      WHERE a.alumni_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}