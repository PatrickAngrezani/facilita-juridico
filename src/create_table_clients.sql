CREATE TABLE postgres.clients (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar(100) NULL,
    email varchar(100) NULL,
    phone_number varchar NULL,
    x int4 NULL,
    y int4 NULL,
    CONSTRAINT clients_email_key UNIQUE (email),
    CONSTRAINT clients_phone_number_key UNIQUE (phone_number),
    CONSTRAINT clients_pkey PRIMARY KEY (id)
);