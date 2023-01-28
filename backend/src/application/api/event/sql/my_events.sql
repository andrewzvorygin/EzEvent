select
  event."event_id",
  event."uuid",
  event."uuid_edit",
  event."date_start",
  event."date_end",
  event."title",
  event."latitude",
  event."longitude",
  event."description",
  event."responsible_id",
  event."visibility",
  event."tags_id",
  event."photo_cover",
  event."key_invite",
  user$."surname" responsible_surname,
  user$."name" responsible_name,
  city_orm.c.name.label('city'),
from
  "Events" event
    left join
      "City" city
        on
          event."city" = city."id"
    join
      "User" user$
        on
          event."responsible_id" = user$."user_id"
where
  coalesce(event."date_start", 'infinity'::timestamp)) >= cast(:date_start as timestamp)