

ALTER TABLE "public"."teams" DROP COLUMN "is_deleted" CASCADE;
ALTER TABLE "public"."teams" DROP COLUMN "is_deleted" CASCADE;
ALTER TABLE "public"."teams" DROP COLUMN "is_deleted" CASCADE;
ALTER TABLE "public"."projects" DROP COLUMN "is_deleted" CASCADE;

alter table "public"."teams" drop constraint "teams_project_id_fkey",
             add constraint "teams_project_id_fkey"
             foreign key ("project_id")
             references "public"."projects"
             ("id") on update restrict on delete cascade;
alter table "public"."team_members" drop constraint "team_members_team_id_fkey",
             add constraint "team_members_team_id_fkey"
             foreign key ("team_id")
             references "public"."teams"
             ("id") on update cascade on delete cascade;
alter table "public"."activities" drop constraint "Activities_project_id_fkey",
             add constraint "activities_project_id_fkey"
             foreign key ("project_id")
             references "public"."projects"
             ("id") on update no action on delete set null;
ALTER TABLE "public"."activities" ALTER COLUMN "project_id" DROP NOT NULL;
ALTER TABLE "public"."daily_tasks" ALTER COLUMN "project_id" DROP NOT NULL;