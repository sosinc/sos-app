
alter table "public"."daily_tasks" drop constraint "daily_tasks_user_id_fkey";
alter table "public"."daily_tasks" drop constraint "daily_tasks_project_id_fkey";
alter table "public"."daily_tasks" rename column "user_id" to "organization_id";
ALTER TABLE "public"."daily_tasks" ADD COLUMN "ecode" text;
ALTER TABLE "public"."daily_tasks" ALTER COLUMN "ecode" DROP NOT NULL;
alter table "public"."daily_tasks" rename column "project_id" to "team_id";
alter table "public"."daily_tasks" add foreign key ("team_id") references "public"."teams"("id") on update restrict on delete restrict;
alter table "public"."daily_tasks" add foreign key ("ecode", "organization_id") references "public"."employees"("ecode", "organization_id") on update cascade on delete restrict;