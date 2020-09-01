import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "team_members" })
export class TeamMember extends BaseEntity {
  @PrimaryColumn()
  ecode: string;

  @PrimaryColumn()
  team_id: string;

  @PrimaryColumn()
  organization_id: string;

  @Column()
  employee_id: string;
}
