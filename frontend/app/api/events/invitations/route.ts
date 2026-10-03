import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { event_id, alumni_id } = body;

    if (!event_id || !alumni_id) {
      return Response.json(
        { error: "Event ID and alumni ID are required" },
        { status: 400 }
      );
    }

    // Temporary faculty ID until authentication is implemented
    const facultyId = 1;

    // Check whether the event belongs to this faculty member
    const eventResult = await pool.query(
      `
      SELECT event_id
      FROM events
      WHERE event_id = $1
        AND created_by = $2
      `,
      [event_id, facultyId]
    );

    if (eventResult.rows.length === 0) {
      return Response.json(
        { error: "Event not found or not created by this faculty member" },
        { status: 404 }
      );
    }

    // Check whether this alumni has already been invited
    const existingRequest = await pool.query(
      `
      SELECT request_id
      FROM event_alumni_requests
      WHERE event_id = $1
        AND alumni_id = $2
      `,
      [event_id, alumni_id]
    );

    if (existingRequest.rows.length > 0) {
      return Response.json(
        { error: "This alumni has already been invited to the event" },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO event_alumni_requests
        (event_id, alumni_id, status)
      VALUES
        ($1, $2, 'PENDING')
      RETURNING *
      `,
      [event_id, alumni_id]
    );

    return Response.json(
      {
        message: "Speaker invitation sent successfully",
        invitation: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to send speaker invitation" },
      { status: 500 }
    );
  }
}