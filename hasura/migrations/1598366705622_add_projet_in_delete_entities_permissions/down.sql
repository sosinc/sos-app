

ALTER TABLE "public"."daily_tasks" ALTER COLUMN "project_id" SET NOT NULL;
ALTER TABLE "public"."activities" ALTER COLUMN "project_id" SET NOT NULL;
alter table "public"."activities" drop constraint "activities_project_id_fkey",
          add constraint "Activities_project_id_fkey"
          foreign key ("project_id")
          references "public"."projects"
          ("id")
          on update no action
          on delete no action;
alter table "public"."team_members" drop constraint "team_members_team_id_fkey",
          add constraint "team_members_team_id_fkey"
          foreign key ("team_id")
          references "public"."teams"
          ("id")
          on update cascade
          on delete restrict;
alter table "public"."teams" drop constraint "teams_project_id_fkey",
          add constraint "teams_project_id_fkey"
          foreign key ("project_id")
          references "public"."projects"
          ("id")
          on update restrict
          on delete restrict;

ALTER TABLE "public"."projects" ADD COLUMN "is_deleted" bool;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" SET DEFAULT false;
ALTER TABLE "public"."teams" ADD COLUMN "is_deleted" bool;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" SET DEFAULT false;
ALTER TABLE "public"."teams" ADD COLUMN "is_deleted" bool;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" SET DEFAULT false;
ALTER TABLE "public"."teams" ADD COLUMN "is_deleted" bool;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" SET DEFAULT false;