
ALTER TABLE "public"."activities" DROP COLUMN "task_id" CASCADE;
alter table "public"."activities" drop constraint "Activities_task_id_fkey";