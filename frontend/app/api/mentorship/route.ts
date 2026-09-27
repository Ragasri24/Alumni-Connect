import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { student_id, alumni_id, message } = body;

    if (!student_id || !alumni_id || !message) {
      return Response.json(
        { error: "Student, alumni, and message are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO mentorship_requests
        (student_id, alumni_id, message)
      VALUES
        ($1, $2, $3)
      RETURNING *
      `,
      [student_id, alumni_id, message]
    );

    return Response.json(
      {
        message: "Mentorship request sent successfully",
        request: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to send mentorship request" },
      { status: 500 }
    );
  }
}