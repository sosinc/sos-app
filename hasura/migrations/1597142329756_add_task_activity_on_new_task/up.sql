
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."Activities"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "project_id" uuid NOT NULL, "task_id" uuid, "type" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("task_id") REFERENCES "public"."daily_tasks"("id") ON UPDATE no action ON DELETE no action);
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
CREATE TRIGGER "set_public_Activities_updated_at"
BEFORE UPDATE ON "public"."Activities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_Activities_updated_at" ON "public"."Activities" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
alter table "public"."Activities" rename to "activities";
ALTER TABLE "public"."activities" ADD COLUMN "payload" jsonb NULL;