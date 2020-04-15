import { Injectable, NotFoundException} from '@nestjs/common';
import {Task, TaskStatus} from './task.model';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
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
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
            throw  new NotFoundException(`Task with id "${id}" not found`);
        }
        return found;
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
        const found = this.getTaskById(id)
        const taskIndex = this.tasks.findIndex(task => task.id === found.id);
        this.tasks.splice(taskIndex, 1);
        // or instead
        // this.tasks = this.tasks.filter(task => task.id !== id)
    }
}
