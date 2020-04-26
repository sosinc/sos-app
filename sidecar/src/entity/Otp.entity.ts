import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";

@Entity({ name: "otp" })
export class Otp {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  otp: string;

  @Column({ name: "type", nullable: false })
  otpType: string;

  @Column({ nullable: false })
  userId: string;
}
