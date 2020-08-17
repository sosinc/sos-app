

ALTER TABLE "public"."activities" DROP COLUMN "payload";
alter table "public"."activities" rename to "Activities";
DROP TABLE "public"."Activities";