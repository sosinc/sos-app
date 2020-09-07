import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "employees" })
export class Employee extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  ecode: string;

  @Column()
  organization_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  headshot: string;

  @Column()
  user_id: string;
}
