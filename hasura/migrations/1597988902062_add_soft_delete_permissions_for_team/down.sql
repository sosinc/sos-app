

ALTER TABLE ONLY "public"."teams" ALTER COLUMN "is_deleted" DROP DEFAULT;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" TYPE boolean;
ALTER TABLE "public"."teams" DROP COLUMN "is_deleted";