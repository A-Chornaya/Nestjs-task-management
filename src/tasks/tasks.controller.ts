import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from "./tasks.service";
import { TaskStatus } from "./task-status.enum";
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger();
    
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterTasks: getTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" get tasks with filter ${JSON.stringify(filterTasks)}`);
        return this.tasksService.getTasks(filterTasks, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" get task with id=${JSON.stringify(id)}`);
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: createTaskDto, @GetUser() user:User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creat a new task with data ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" update task with id=${JSON.stringify(id)}, new status is ${JSON.stringify(status)}`);
        return this.tasksService.updateTask(id, status, user)
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number,@GetUser() user: User): Promise<void> {
        this.logger.verbose(`User "${user.username}" delete task with id=${JSON.stringify(id)}`);
        return this.tasksService.deleteTask(id, user);
    }
}
