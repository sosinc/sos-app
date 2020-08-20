
ALTER TABLE "public"."teams" ADD COLUMN "is_delteted" boolean NULL;
alter table "public"."teams" rename column "is_delteted" to "is_deleted";
ALTER TABLE ONLY "public"."teams" ALTER COLUMN "is_deleted" SET DEFAULT False;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" SET NOT NULL;