
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."organization"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "logo" text, "logo_square" text, PRIMARY KEY ("id") , UNIQUE ("name"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."project"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "logo" text, "logo_square" text, "description" text, "organization_id" uuid NOT NULL, "issue_link_template" text, "pr_link_template" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("name"), CONSTRAINT "valid_issue_link_template" CHECK (issue_link_template SIMILAR TO 'https?://%\{\{ID\}\}%'), CONSTRAINT "valid_pr_link_template" CHECK (pr_link_template SIMILAR TO 'https?://%\{\{ID\}\}%'));
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
CREATE TRIGGER "set_public_project_updated_at"
BEFORE UPDATE ON "public"."project"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_project_updated_at" ON "public"."project" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
alter table "public"."project" rename to "projects";
alter table "public"."organization" rename to "organizations";
alter table "public"."role" rename to "roles";
alter table "public"."user" rename to "users";