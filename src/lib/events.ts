import type { SanityEvent } from "@/sanity/types";

/** An event is considered past if its end date (or start date) has passed. */
export function isEventPast(event: SanityEvent): boolean {
  const cutoff = event.endTime ?? event.startTime;
  return new Date(cutoff) < new Date();
}

/** Upcoming events: not archived and not past, sorted soonest-first. */
export function getUpcomingEvents(events: SanityEvent[]): SanityEvent[] {
  return events
    .filter((e) => !e.archived && !isEventPast(e))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
}

/** Past events: archived or date has passed, sorted most-recent-first. */
export function getPastEvents(events: SanityEvent[]): SanityEvent[] {
  return events
    .filter((e) => e.archived || isEventPast(e))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
}
