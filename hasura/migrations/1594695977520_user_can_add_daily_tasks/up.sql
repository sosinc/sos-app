
alter table "public"."daily_tasks" drop constraint "daily_tasks_ecode_organization_id_fkey";
alter table "public"."daily_tasks" drop constraint "daily_tasks_team_id_fkey";
alter table "public"."daily_tasks" rename column "team_id" to "project_id";
ALTER TABLE "public"."daily_tasks" DROP COLUMN "ecode" CASCADE;
alter table "public"."daily_tasks" rename column "organization_id" to "user_id";
alter table "public"."daily_tasks"
           add constraint "daily_tasks_project_id_fkey"
           foreign key ("project_id")
           references "public"."projects"
           ("id") on update cascade on delete set null;
alter table "public"."daily_tasks"
           add constraint "daily_tasks_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("id") on update cascade on delete restrict;