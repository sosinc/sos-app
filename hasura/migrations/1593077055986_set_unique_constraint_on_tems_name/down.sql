
alter table "public"."teams" drop constraint "teams_name_project_id_key";
alter table "public"."teams" add constraint "teams_name_key" unique ("name");
ALTER TABLE "public"."teams" DROP CONSTRAINT "teams_name_key";