
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" DROP NOT NULL;
ALTER TABLE ONLY "public"."teams" ALTER COLUMN "is_deleted" DROP DEFAULT;
alter table "public"."teams" rename column "is_deleted" to "is_delteted";
ALTER TABLE "public"."teams" DROP COLUMN "is_delteted";