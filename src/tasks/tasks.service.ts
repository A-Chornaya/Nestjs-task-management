import { Injectable } from '@nestjs/common';
import {Task, TaskStatus} from './task.model';
import * as uuid from 'uuid/v1'
import {createTaskDto} from "./dto/create-task.dto";
import {getTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksFilter(filterDto: getTasksFilterDto): Task[] {
        let tasks = this.getAllTasks();
        if (filterDto.status) {
            tasks = tasks.filter(task => task.status === filterDto.status);
        }
        if (filterDto.search) {
            tasks = tasks.filter(task => task.title.includes(filterDto.search)
                                                || task.description.includes(filterDto.search));
        }

        return tasks
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: createTaskDto): Task {
        const {title, description} = createTaskDto
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);

        return task;
    }

    updateTask(id: string, status: TaskStatus) {
        // const taskIndex = this.tasks.findIndex(task => task.id === id);
        // this.tasks[taskIndex].status = status;
        // return this.tasks[taskIndex];
        let task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string): void {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        this.tasks.splice(taskIndex, 1);
        // or instead
        // this.tasks = this.tasks.filter(task => task.id !== id)
    }
}
