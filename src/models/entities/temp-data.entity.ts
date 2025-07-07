import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('temp_data')
@Unique(['key'])
export class TempData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column('text')
    data: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
