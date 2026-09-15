from sqlalchemy.orm import Session

from app.database.models import ApplicationTimelineEvent


def add_timeline_event(
    db: Session,
    application_id: str,
    event_type: str,
    label: str,
    actor_type: str | None = None,
    actor_label: str | None = None,
    description: str | None = None,
    internal: bool = False,
    commit: bool = True,
) -> ApplicationTimelineEvent:
    event = ApplicationTimelineEvent(
        application_id=application_id,
        event_type=event_type,
        label=label,
        description=description,
        actor_type=actor_type,
        actor_label=actor_label,
        internal=internal,
    )

    db.add(event)

    if commit:
        db.commit()
        db.refresh(event)

    return event


def timeline_to_response(events: list[ApplicationTimelineEvent]) -> list[dict]:
    return [
        {
            "id": event.id,
            "type": event.event_type,
            "label": event.label,
            "description": event.description,
            "at": event.created_at,
            "by": event.actor_label,
            "internal": event.internal,
        }
        for event in events
    ]
