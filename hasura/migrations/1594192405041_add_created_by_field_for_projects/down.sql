
alter table "public"."projects" drop constraint "projects_created_by_fkey";
ALTER TABLE "public"."projects" ALTER COLUMN "created_by" DROP NOT NULL;
ALTER TABLE "public"."projects" DROP COLUMN "created_by";