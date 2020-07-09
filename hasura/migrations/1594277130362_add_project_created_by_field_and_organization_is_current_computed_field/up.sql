ALTER TABLE "public"."projects" ADD COLUMN "created_by" uuid NULL;
alter table "public"."projects"
           add constraint "projects_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update restrict on delete set null;
CREATE OR REPLACE FUNCTION public.is_current_organization(organizations_row organizations, hasura_session json)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM organizations
    WHERE organizations.id = (hasura_session ->> 'x-hasura-organization-id')::UUID
  );
  $function$;
