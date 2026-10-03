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
        a.company,
        a.job_role,
        a.batch,
        a.location,
        a.skills,
        a.linkedin,
        d.dept_name

      FROM event_alumni_requests ear

      JOIN alumni a
        ON ear.alumni_id = a.alumni_id

      JOIN departments d
        ON a.dept_id = d.dept_id

      WHERE ear.event_id = $1
        AND ear.status = 'ACCEPTED'

      ORDER BY a.name
      `,
      [id]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch event speakers" },
      { status: 500 }
    );
  }
}