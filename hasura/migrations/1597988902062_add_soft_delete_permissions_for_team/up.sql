

ALTER TABLE "public"."teams" ADD COLUMN "is_deleted" Boolean NULL;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" TYPE Boolean;
ALTER TABLE ONLY "public"."teams" ALTER COLUMN "is_deleted" SET DEFAULT False;
ALTER TABLE "public"."teams" ALTER COLUMN "is_deleted" SET NOT NULL;