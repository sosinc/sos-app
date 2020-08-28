import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "deleted_entities" })
export class Deleted extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  deleted_by: string;

  @Column()
  organization_id: string;

  @Column()
  type: string;

  @Column("jsonb")
  row: object;
}
