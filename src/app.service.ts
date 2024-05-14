import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  async getById(id: number): Promise<TaskEntity> {
    return await this.taskRepository.findOneBy({ id });
  }

  async createTask(name: string): Promise<TaskEntity[]> {
    const task = this.taskRepository.create({ name });
    await this.taskRepository.save(task);
    return this.getAll();
  }

  async doneTask(id: number): Promise<TaskEntity[]> {
    const task = await this.getById(id);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    await this.taskRepository.save(task);

    return this.getAll();
  }

  async editTask(id: number, name: string): Promise<TaskEntity[]> {
    const task = await this.getById(id);
    if (!task) return null;

    task.name = name;
    await this.taskRepository.save(task);

    return this.getAll();
  }

  async deleteTask(id: number): Promise<TaskEntity[]> {
    const task = await this.getById(id);
    if (!task) return null;

    await this.taskRepository.delete({ id });
    return this.getAll();
  }
}
