import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ name: "user" })
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

  @Column({ nullable: false })
  passwordHash: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: false })
  role: number;
}
