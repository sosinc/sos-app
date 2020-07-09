DROP FUNCTION IF EXISTS public.is_current_organization;

alter table "public"."projects" drop constraint "projects_created_by_fkey";
ALTER TABLE "public"."projects" DROP COLUMN "created_by";
