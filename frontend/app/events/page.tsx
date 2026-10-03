"use client";

import { useEffect, useState } from "react";

type Event = {
  event_id: number;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location: string;
  max_capacity: number;
  registration_deadline: string;
  faculty_id: number;
  faculty_name: string;
};

type Speaker = {
  alumni_id: number;
  name: string;
  company: string;
  job_role: string;
  batch: number;
  location: string;
  skills: string;
  linkedin: string;
  dept_name: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [speakers, setSpeakers] = useState<Record<number, Speaker[]>>({});
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch events
        const response = await fetch("/api/events");
        const data = await response.json();

        setEvents(data);

        // Fetch student's registrations
        const registrationResponse = await fetch(
          "/api/events/registrations"
        );

        const registrationData = await registrationResponse.json();

        setRegisteredEvents(
          registrationData.map(
            (registration: { event_id: number }) =>
              registration.event_id
          )
        );

        // Fetch speakers for each event
        const speakerData: Record<number, Speaker[]> = {};

        for (const event of data) {
          const speakerResponse = await fetch(
            `/api/events/${event.event_id}/speakers`
          );

          const speakerList = await speakerResponse.json();

          speakerData[event.event_id] = speakerList;
        }

        setSpeakers(speakerData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  async function registerForEvent(eventId: number) {
    try {
      const response = await fetch(
        "/api/events/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: eventId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to register");
        return;
      }

      setRegisteredEvents((current) => [
        ...current,
        eventId,
      ]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  async function cancelRegistration(eventId: number) {
    try {
      const response = await fetch(
        "/api/events/registrations",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: eventId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error || "Failed to cancel registration"
        );
        return;
      }

      setRegisteredEvents((current) =>
        current.filter((id) => id !== eventId)
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading events...
        </p>
      </main>
    );
  }

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Events
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Discover upcoming college events, workshops, and seminars.
        </p>
      </div>

      {/* No Events */}
      {events.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            No events available.
          </p>
        </div>
      ) : (
        /* Event Cards */
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              {/* Event Title + Type */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h2>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {event.event_type}
                </span>
              </div>

              {/* Description */}
              <p className="mb-4 text-sm leading-5 text-gray-600">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  📅 <strong>Date:</strong>{" "}
                  {formatDate(event.start_time)}
                </p>

                <p>
                  🕐 <strong>Time:</strong>{" "}
                  {formatTime(event.start_time)} –{" "}
                  {formatTime(event.end_time)}
                </p>

                <p>
                  📍 <strong>Location:</strong>{" "}
                  {event.location}
                </p>

                <p>
                  👨‍🏫 <strong>Organized by:</strong>{" "}
                  {event.faculty_name}
                </p>

                <p>
                  👥 <strong>Capacity:</strong>{" "}
                  {event.max_capacity}
                </p>

                <p>
                  📝 <strong>Registration deadline:</strong>{" "}
                  {formatDate(event.registration_deadline)}
                </p>
              </div>

              {/* Alumni Speakers */}
              {speakers[event.event_id]?.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    🎤 Alumni Speakers
                  </p>

                  <div className="space-y-1.5">
                    {speakers[event.event_id].map(
                      (speaker) => (
                        <div
                          key={speaker.alumni_id}
                          className="rounded-md bg-gray-50 p-2.5"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {speaker.name}
                          </p>

                          <p className="text-xs text-gray-600">
                            {speaker.job_role} ·{" "}
                            {speaker.company}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Registration */}
              <div className="mt-4 border-t pt-3">
                {registeredEvents.includes(
                  event.event_id
                ) ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-green-600">
                      ✓ Registered
                    </span>

                    <button
                      onClick={() =>
                        cancelRegistration(event.event_id)
                      }
                      className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      registerForEvent(event.event_id)
                    }
                    className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Register for Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}