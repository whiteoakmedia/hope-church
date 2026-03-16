import type { Event } from "@/sanity/types";

/** An event is considered past if its end date (or start date) has passed. */
export function isEventPast(event: Event): boolean {
  const cutoff = event.endDate ?? event.date;
  return new Date(cutoff) < new Date();
}

/** Upcoming events: not past, sorted soonest-first. */
export function getUpcomingEvents(events: Event[]): Event[] {
  return events
    .filter((e) => !isEventPast(e))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

/** Past events: date has passed, sorted most-recent-first. */
export function getPastEvents(events: Event[]): Event[] {
  return events
    .filter((e) => isEventPast(e))
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
