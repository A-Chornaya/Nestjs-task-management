import { Injectable, NotFoundException} from '@nestjs/common';
import {createTaskDto} from "./dto/create-task.dto";
import {getTasksFilterDto} from "./dto/get-tasks-filter.dto";
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    getTasks(filterTasks: getTasksFilterDto):Promise<Task[]> {
        return this.taskRepository.getTasks(filterTasks);
    }

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksFilter(filterDto: getTasksFilterDto): Task[] {
    //     let tasks = this.getAllTasks();
    //     if (filterDto.status) {
    //         tasks = tasks.filter(task => task.status === filterDto.status);
    //     }
    //     if (filterDto.search) {
    //         tasks = tasks.filter(task => task.title.includes(filterDto.search)
    //                                             || task.description.includes(filterDto.search));
    //     }

    //     return tasks
    // }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw  new NotFoundException(`Task with id "${id}" not found`);
        }
        return found;
    }

    async createTask(createTaskDto: createTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task> {
        let task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }
}
