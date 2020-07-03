
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."daily_tasks"("ecode" text NOT NULL, "team_id" uuid NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "issue_id" text, "pr_id" text, "is_delivered" boolean, "created_by" uuid NOT NULL, "estimated_hours" numeric, "billable_hours" numeric, "date" date NOT NULL DEFAULT now(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT gen_random_uuid(), "organization_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("ecode", "organization_id") REFERENCES "public"."employees"("ecode", "organization_id") ON UPDATE cascade ON DELETE restrict); COMMENT ON TABLE "public"."daily_tasks" IS E'Standup or status denoted by tasks that an employee commits to finish in a day';
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
CREATE TRIGGER "set_public_daily_tasks_updated_at"
BEFORE UPDATE ON "public"."daily_tasks"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_daily_tasks_updated_at" ON "public"."daily_tasks" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."daily_task_notes"("parent_id" uuid NOT NULL, "is_challenge" boolean NOT NULL DEFAULT false, "is_blocker" boolean NOT NULL DEFAULT false, "is_resolved" boolean NOT NULL DEFAULT false, "body" text NOT NULL, "created_by" uuid NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("parent_id") REFERENCES "public"."daily_tasks"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_daily_task_notes_updated_at"
BEFORE UPDATE ON "public"."daily_task_notes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_daily_task_notes_updated_at" ON "public"."daily_task_notes" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';