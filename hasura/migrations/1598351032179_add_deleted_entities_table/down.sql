
alter table "public"."deleted_entities" rename column "deleted_at" to "created_at";
ALTER TABLE "public"."deleted_entities" ADD COLUMN "updated_at" timestamptz;
ALTER TABLE "public"."deleted_entities" ALTER COLUMN "updated_at" DROP NOT NULL;
ALTER TABLE "public"."deleted_entities" ALTER COLUMN "updated_at" SET DEFAULT now();
alter table "public"."deleted_entities" rename column "row" to "payload";
alter table "public"."deleted_entities" rename column "deleted_by" to "user_id";
DROP TABLE "public"."deleted_entities";