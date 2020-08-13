
alter table "public"."activities" add foreign key ("task_id") references "public"."daily_tasks"("id") on update no action on delete no action;
ALTER TABLE "public"."activities" ADD COLUMN "task_id" uuid;
ALTER TABLE "public"."activities" ALTER COLUMN "task_id" DROP NOT NULL;
ALTER TABLE "public"."activities" ADD CONSTRAINT Activities_task_id_fkey FOREIGN KEY (task_id) REFERENCES "public"."daily_tasks" (id) ON DELETE no action ON UPDATE no action;