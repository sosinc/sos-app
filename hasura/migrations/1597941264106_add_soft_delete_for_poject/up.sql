
ALTER TABLE "public"."projects" ADD COLUMN "is_deleted" boolean NULL;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" TYPE boolean;
ALTER TABLE ONLY "public"."projects" ALTER COLUMN "is_deleted" SET DEFAULT False;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" SET NOT NULL;