import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        e.event_id,
        e.title,
        e.description,
        e.event_type,
        e.start_time,
        e.end_time,
        e.location,
        e.max_capacity,
        e.registration_deadline,

        f.faculty_id,
        f.name AS faculty_name

      FROM events e

      JOIN faculty f
        ON e.created_by = f.faculty_id

      ORDER BY e.start_time ASC
    `);

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      event_type,
      start_time,
      end_time,
      location,
      max_capacity,
      registration_deadline,
    } = body;

    if (
      !title ||
      !description ||
      !event_type ||
      !start_time ||
      !end_time ||
      !location ||
      !max_capacity ||
      !registration_deadline
    ) {
      return Response.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Temporary faculty ID until authentication is implemented
    const facultyId = 1;

    const result = await pool.query(
      `
      INSERT INTO events
        (
          title,
          description,
          event_type,
          start_time,
          end_time,
          location,
          max_capacity,
          registration_deadline,
          created_by
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [
        title,
        description,
        event_type,
        start_time,
        end_time,
        location,
        max_capacity,
        registration_deadline,
        facultyId,
      ]
    );

    return Response.json(
      {
        message: "Event created successfully",
        event: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}