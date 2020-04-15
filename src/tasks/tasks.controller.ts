import {Controller, Get, Post, Body, Param, Delete, Patch, Query} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {Task, TaskStatus} from "./task.model";
import {createTaskDto} from "./dto/create-task.dto";
import {getTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterTasks: getTasksFilterDto): Task[] {
        if (Object.keys(filterTasks).length) {
            return this.tasksService.getTasksFilter(filterTasks);
        } else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: createTaskDto): Task{
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
        return this.tasksService.updateTask(id, status)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }
}
