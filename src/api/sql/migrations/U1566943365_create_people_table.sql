DROP TABLE IF EXISTS people;

CREATE people (
    id          bigserial PRIMARY KEY,
    first_name  char(256) NOT NULL,
    last_name   char(256) NOT NULL,
    birthday    date NOT NULL,
    company     char(256),
    title       char(256),
    created_at  timestamp [ (p) ] with time zone NOT NULL DEFAULT now(),
    updated_at  timestamp [ (p) ] with time zone,
    deleted_at  timestamp [ (p) ] with time zone
)