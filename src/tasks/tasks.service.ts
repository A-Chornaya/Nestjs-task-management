import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepositry: TaskRepository) {}

    getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
        return this.taskRepositry.getTasks(filterDto);
    }
    
    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepositry.findOne(id);
        if (!found) {
            throw  new NotFoundException(`Task with id "${id}" not found`);
        }
        return found;
    }

    createTask(createTaskDto: createTaskDto): Promise<Task> {
        return this.taskRepositry.createTask(createTaskDto);
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task> {
        let task = await this.getTaskById(id);
        task.status = status;

        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepositry.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }
}
