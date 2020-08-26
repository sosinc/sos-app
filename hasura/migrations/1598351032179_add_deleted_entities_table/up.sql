
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."deleted_entities"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "type" text NOT NULL, "payload" json NOT NULL, "organization_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON UPDATE no action ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_deleted_entities_updated_at"
BEFORE UPDATE ON "public"."deleted_entities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_deleted_entities_updated_at" ON "public"."deleted_entities" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
alter table "public"."deleted_entities" rename column "user_id" to "deleted_by";
alter table "public"."deleted_entities" rename column "payload" to "row";
ALTER TABLE "public"."deleted_entities" DROP COLUMN "updated_at" CASCADE;
alter table "public"."deleted_entities" rename column "created_at" to "deleted_at";