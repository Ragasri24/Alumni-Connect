import pool from "@/lib/db";

export async function GET() {
  try {
    // Temporary student ID until authentication is implemented
    const studentId = 1;

    const result = await pool.query(
      `
      SELECT
        application_id,
        job_id,
        student_id,
        status,
        applied_at
      FROM job_applications
      WHERE student_id = $1
      ORDER BY applied_at DESC
      `,
      [studentId]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { job_id } = body;

    if (!job_id) {
      return Response.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Temporary student ID until authentication is implemented
    const studentId = 1;

    const existingApplication = await pool.query(
      `
      SELECT application_id
      FROM job_applications
      WHERE job_id = $1
        AND student_id = $2
      `,
      [job_id, studentId]
    );

    if (existingApplication.rows.length > 0) {
      return Response.json(
        { error: "Application already marked" },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO job_applications
        (job_id, student_id, status)
      VALUES
        ($1, $2, 'APPLIED')
      RETURNING *
      `,
      [job_id, studentId]
    );

    return Response.json(
      {
        message: "Application marked successfully",
        application: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to mark application" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { job_id } = body;

    if (!job_id) {
      return Response.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Temporary student ID until authentication is implemented
    const studentId = 1;

    const result = await pool.query(
      `
      DELETE FROM job_applications
      WHERE job_id = $1
        AND student_id = $2
      RETURNING *
      `,
      [job_id, studentId]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Application record not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Application mark removed",
      application: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to remove application mark" },
      { status: 500 }
    );
  }
}