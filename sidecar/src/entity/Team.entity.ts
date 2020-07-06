import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "teams" })
export class Team extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  project_id: string;
}
