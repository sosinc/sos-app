
ALTER TABLE "public"."teams" ADD CONSTRAINT "teams_name_key" UNIQUE ("name");
alter table "public"."teams" drop constraint "teams_name_key";
alter table "public"."teams" add constraint "teams_name_project_id_key" unique ("name", "project_id");