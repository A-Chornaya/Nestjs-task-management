import { Repository, EntityRepository } from "typeorm";
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger();
    
    async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        let task = new Task;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        try {
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to save task for user "${user.username}"`, error.stack);
            throw new InternalServerErrorException();
        }

        delete task.user;

        return task;
    }

    async getTasks(filterDto: getTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        let query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', {userId: user.id})
        if (status) {
            query.andWhere('task.status = :status', {status});
        }
        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }
        try {
            const tasks = await query.getMany();

            return tasks;
        } catch (error) {
            this.logger.error(`Fsiled to get tasks for user "${user.username}" with filters ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}