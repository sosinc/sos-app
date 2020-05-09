import { Entity, BaseEntity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Role } from "./Role.entity";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column({ nullable: false })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field(type => Role)
  @ManyToOne(type => Role)
  @JoinColumn({
    name: "role_id",
    referencedColumnName: "id",
  })
  role: Role;

  @Column()
  role_id: string;
}
