import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "activities" })
export class Activities extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  task_id: string;

  @Column()
  user_id: string;

  @Column()
  project_id: string;

  @Column()
  type: string;
}
