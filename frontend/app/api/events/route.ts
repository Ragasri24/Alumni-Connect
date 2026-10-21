
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

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
    const session = await requireRole(["FACULTY"]);
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
        session.user_id,
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

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return Response.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
