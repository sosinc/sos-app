
alter table "public"."users" rename to "user";
alter table "public"."roles" rename to "role";
alter table "public"."organizations" rename to "organization";
alter table "public"."projects" rename to "project";
DROP TABLE "public"."project";
DROP TABLE "public"."organization";