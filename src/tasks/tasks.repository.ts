import { Repository, EntityRepository } from "typeorm";
import { createTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTask(createTaskDto: createTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        let task = new Task;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }

    async getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        let query = this.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', {status});
        }
        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }
        const tasks = await query.getMany();

        return tasks;
    }
}