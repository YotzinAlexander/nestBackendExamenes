import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
//Esta es la estructura para la Tabla de la DB.
@Entity({ name: 'exams' })
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  data: string;
}
