import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepositry: TaskRepository) {}

    getTasks(filterDto: getTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepositry.getTasks(filterDto, user);
    }
    
    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepositry.findOne({ where: { id, userId: user.id }});
        if (!found) {
            throw  new NotFoundException(`Task with id "${id}" not found`);
        }
        return found;
    }

    createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
        return this.taskRepositry.createTask(createTaskDto, user);
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
        let task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();

        return task;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepositry.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }
}
