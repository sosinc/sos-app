import { Entity, Column, PrimaryColumn, BaseEntity } from "typeorm";

@Entity({ name: "user_logins" })
export class UserLogin extends BaseEntity {
  @PrimaryColumn()
  provider: string;

  @PrimaryColumn()
  public_key: string;

  @Column()
  private_key: string;

  @Column()
  user_id: string;
}
