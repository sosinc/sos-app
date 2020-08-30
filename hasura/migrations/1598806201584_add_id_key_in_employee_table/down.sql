
alter table "public"."employees" drop constraint "employees_organization_id_email_key";
alter table "public"."employees" drop constraint "employees_ecode_organization_id_key";
alter table "public"."employees" drop constraint "employees_pkey";
alter table "public"."employees"
    add constraint "employees_pkey" 
    primary key ( "organization_id", "ecode" );
alter table "public"."team_members" drop constraint "team_members_employee_id_fkey",
          add constraint "team_members_ecode_organization_id_fkey"
          foreign key ("ecode", "organization_id")
          references "public"."employees"
          ("ecode", "organization_id")
          on update cascade
          on delete restrict;
ALTER TABLE "public"."team_members" DROP COLUMN "employee_id";
ALTER TABLE "public"."employees" DROP COLUMN "id";
ALTER TABLE "public"."employees" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "public"."employees" ALTER COLUMN "user_id" DROP NOT NULL;