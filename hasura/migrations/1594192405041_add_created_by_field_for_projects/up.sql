
ALTER TABLE "public"."projects" ADD COLUMN "created_by" uuid NULL;
ALTER TABLE "public"."projects" ALTER COLUMN "created_by" SET NOT NULL;
alter table "public"."projects"
           add constraint "projects_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update restrict on delete set null;