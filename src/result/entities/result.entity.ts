import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('result')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { default: 0 })
  result: number;

  @Column()
  idExamen: string;

  @Column()
  idusuario: string;
}
