

ALTER TABLE "public"."employees" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "public"."employees" ALTER COLUMN "user_id" DROP NOT NULL;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "public"."employees" ADD COLUMN "id" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();
ALTER TABLE "public"."team_members" ADD COLUMN "employee_id" uuid NOT NULL;
alter table "public"."team_members" drop constraint "team_members_ecode_organization_id_fkey",
             add constraint "team_members_employee_id_fkey"
             foreign key ("employee_id")
             references "public"."employees"
             ("id") on update cascade on delete restrict;
alter table "public"."employees" drop constraint "employees_pkey";
alter table "public"."employees"
    add constraint "employees_pkey" 
    primary key ( "id" );
alter table "public"."employees" add constraint "employees_ecode_organization_id_key" unique ("ecode", "organization_id");
alter table "public"."employees" add constraint "employees_organization_id_email_key" unique ("organization_id", "email");