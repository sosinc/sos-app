
ALTER TABLE ONLY "public"."projects" ALTER COLUMN "is_deleted" DROP DEFAULT;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."projects" ALTER COLUMN "is_deleted" TYPE boolean;
ALTER TABLE "public"."projects" DROP COLUMN "is_deleted";