import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from "./tasks.service";
import { TaskStatus } from "./task-status.enum";
import { Task } from './task.entity';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterTasks: getTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterTasks);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: createTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return this.tasksService.updateTask(id, status)
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }
}
