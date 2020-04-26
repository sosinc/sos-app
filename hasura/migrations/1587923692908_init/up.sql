CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.activity (
    user_id uuid NOT NULL,
    operation text NOT NULL,
    payload jsonb,
    project_id uuid,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.client (
    name text NOT NULL,
    description text NOT NULL,
    logo text NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.daily_status_update (
    date date NOT NULL,
    team_id uuid NOT NULL,
    ecode text NOT NULL,
    body text NOT NULL,
    issue_id text,
    is_delivered boolean DEFAULT false NOT NULL,
    billable_hours numeric DEFAULT 0 NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    added_by uuid NOT NULL
);
CREATE TABLE public.designation (
    value text NOT NULL,
    name text
);
COMMENT ON COLUMN public.designation.name IS 'Display name of designation';
CREATE TABLE public.employee (
    ecode text NOT NULL,
    email text NOT NULL,
    joining_date date,
    relieving_date date,
    "designationCode" text
);
CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
CREATE TABLE public.otp (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    otp text NOT NULL,
    "userId" uuid NOT NULL,
    type text NOT NULL
);
CREATE TABLE public.project (
    name text NOT NULL,
    client_id uuid NOT NULL,
    logo uuid,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
COMMENT ON TABLE public.project IS 'A client''s project';
CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.team (
    name text NOT NULL,
    project_id uuid NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.team IS 'A team within a project';
CREATE TABLE public.team_employee (
    ecode text NOT NULL,
    team_id uuid NOT NULL,
    max_billable_hours numeric DEFAULT 8.0 NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.team_employee IS 'An employee can be in multiple teams across projects';
CREATE TABLE public.typeormmigrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
CREATE SEQUENCE public.typeormmigrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.typeormmigrations_id_seq OWNED BY public.typeormmigrations.id;
CREATE TABLE public."user" (
    "passwordHash" text NOT NULL,
    name text,
    avatar text,
    bio text,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL,
    role integer NOT NULL
);
COMMENT ON TABLE public."user" IS 'User of the application';
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.typeormmigrations ALTER COLUMN id SET DEFAULT nextval('public.typeormmigrations_id_seq'::regclass);
ALTER TABLE ONLY public.typeormmigrations
    ADD CONSTRAINT "PK_61e49e6c8df5ff28b7c9f723a28" PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_status_update
    ADD CONSTRAINT daily_status_update_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_name_key UNIQUE (value);
ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_email_key UNIQUE (email);
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (ecode);
ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_client_id_name_key UNIQUE (client_id, name);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_id_key UNIQUE (id);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team_employee
    ADD CONSTRAINT team_employee_ecode_key UNIQUE (ecode);
ALTER TABLE ONLY public.team_employee
    ADD CONSTRAINT team_employee_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_name_project_id_key UNIQUE (name, project_id);
ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_activity_updated_at BEFORE UPDATE ON public.activity FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_activity_updated_at ON public.activity IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_client_updated_at BEFORE UPDATE ON public.client FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_client_updated_at ON public.client IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_daily_status_update_updated_at BEFORE UPDATE ON public.daily_status_update FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_daily_status_update_updated_at ON public.daily_status_update IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_project_updated_at BEFORE UPDATE ON public.project FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_project_updated_at ON public.project IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_team_employee_updated_at BEFORE UPDATE ON public.team_employee FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_team_employee_updated_at ON public.team_employee IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_team_updated_at BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_team_updated_at ON public.team IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.daily_status_update
    ADD CONSTRAINT daily_status_update_added_by_fkey FOREIGN KEY (added_by) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.daily_status_update
    ADD CONSTRAINT daily_status_update_ecode_fkey FOREIGN KEY (ecode) REFERENCES public.employee(ecode) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.daily_status_update
    ADD CONSTRAINT daily_status_update_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_designation_fkey FOREIGN KEY ("designationCode") REFERENCES public.designation(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_email_fkey FOREIGN KEY (email) REFERENCES public."user"(email) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.otp
    ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_employee
    ADD CONSTRAINT team_employee_ecode_fkey FOREIGN KEY (ecode) REFERENCES public.employee(ecode) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_employee
    ADD CONSTRAINT team_employee_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_role_fkey FOREIGN KEY (role) REFERENCES public.roles(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
