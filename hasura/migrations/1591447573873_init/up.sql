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
CREATE TABLE public.designations (
    id text NOT NULL,
    name text NOT NULL
);
INSERT INTO designations (id, name) VALUES
  ('PM', 'Project Manager'),
  ('SA', 'Solutions Architect'),
  ('TL', 'Technical Lead'),
  ('ATL', 'Associate Technical Lead'),
  ('SSE', 'Senior Software Engineer'),
  ('SE', 'Software Engineer'),
  ('ASE', 'Associate Software Engineer'),
  ('PC', 'Project Coordinator');
CREATE TABLE public.employees (
    ecode text NOT NULL,
    organization_id uuid NOT NULL,
    headshot text,
    email text NOT NULL,
    designation_id text NOT NULL,
    joining_date date,
    name text NOT NULL,
    relieving_date date,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.organizations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    square_logo text,
    banner text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
COMMENT ON COLUMN public.organizations.banner IS 'A banner is a  logo in landscape mode';
CREATE TABLE public.projects (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo text,
    logo_square text,
    description text,
    organization_id uuid NOT NULL,
    issue_link_template text,
    pr_link_template text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT valid_issue_link_template CHECK ((issue_link_template ~ similar_escape('https?://%\{\{ID\}\}%'::text, NULL::text))),
    CONSTRAINT valid_pr_link_template CHECK ((pr_link_template ~ similar_escape('https?://%\{\{ID\}\}%'::text, NULL::text)))
);
CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL
);
INSERT INTO ROLES (id, name)
VALUES ('APP_ADMIN', 'App Admin'),
       ('USER', 'user');
CREATE TABLE public.team_members (
    ecode text NOT NULL,
    team_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organization_id uuid NOT NULL
);
CREATE TABLE public.teams (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo text,
    logo_square text,
    issue_link_template text,
    pr_link_template text,
    project_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT valid_issue_link_template CHECK ((issue_link_template ~ similar_escape('https?://%\{\{ID\}\}%'::text, NULL::text))),
    CONSTRAINT valid_pr_link_template CHECK ((pr_link_template ~ similar_escape('https?://%\{\{ID\}\}%'::text, NULL::text)))
);
CREATE TABLE public.user_logins (
    provider text NOT NULL,
    public_key text NOT NULL,
    private_key text,
    user_id uuid NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    avatar text,
    email text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    role_id text NOT NULL
);
COMMENT ON TABLE public.users IS 'A user of the application';
ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_name_key UNIQUE (name);
ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (ecode, organization_id);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organization_name_key UNIQUE (name);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT project_name_key UNIQUE (name);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT role_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (ecode, team_id, organization_id);
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public.user_logins
    ADD CONSTRAINT user_logins_pkey PRIMARY KEY (provider, public_key);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_employees_updated_at ON public.employees IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_organizations_updated_at ON public.organizations IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_project_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_project_updated_at ON public.projects IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_role_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_role_updated_at ON public.roles IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_team_members_updated_at ON public.team_members IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_teams_updated_at ON public.teams IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_designation_id_fkey FOREIGN KEY (designation_id) REFERENCES public.designations(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT project_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_ecode_organization_id_fkey FOREIGN KEY (ecode, organization_id) REFERENCES public.employees(ecode, organization_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_logins
    ADD CONSTRAINT user_logins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
