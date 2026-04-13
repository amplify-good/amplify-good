import Link from "next/link";
import { Event } from "@/data/events";
import { Musician } from "@/data/musicians";
import { NonProfit } from "@/data/nonprofits";
import { formatDate, formatTime } from "@/lib/format";

export default function EventCard({
  event,
  musician,
  nonprofit,
}: {
  event: Event;
  musician: Musician | null | undefined;
  nonprofit: NonProfit | null | undefined;
}) {
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className="card h-full flex flex-col gap-3 group-hover:shadow-lg transition-shadow border-t-4 border-t-azure">
        {event.status === "completed" && (
          <span className="inline-flex items-center self-start text-xs font-heading font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-md uppercase tracking-wide">
            Completed
          </span>
        )}

        <h3 className="font-heading font-bold text-xl text-azure group-hover:text-sienna transition-colors leading-tight">
          {event.name}
        </h3>

        <div className="flex items-start gap-2 text-sm font-body text-gray-600">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-sienna" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.dateTime)} &middot; {formatTime(event.dateTime)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm font-body text-gray-600">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-sienna" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.venue}</span>
        </div>

        {nonprofit && (
          <div className="text-sm font-body text-gray-500">
            <span className="font-semibold text-gray-700">Hosted by:</span>{" "}
            {nonprofit.name}
          </div>
        )}

        <div className="text-sm font-body">
          {musician ? (
            <span className="text-gray-600">
              <span className="font-semibold text-gray-700">Performing:</span>{" "}
              {musician.name}
            </span>
          ) : (
            <span className="text-gray-400 italic">Musician TBD</span>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex justify-between items-center pt-2 pb-1 border-t border-sand-dark">
          <span className="text-sm font-heading font-semibold text-azure uppercase tracking-wide">
            {event.genrePref}{" "}
            <span className="text-gold font-bold mx-0.5">|</span>{" "}
            {event.cause}
          </span>
          <span className="text-sm font-heading font-semibold text-sienna uppercase tracking-wide">
            {event.rsvpCount} RSVPs
          </span>
        </div>
      </div>
    </Link>
  );
}
