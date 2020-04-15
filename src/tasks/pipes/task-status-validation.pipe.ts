import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];
    
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`\"${value}\" status is not valid`);
        }

        return value;
    }

    private isStatusValid(status: any): boolean {
        const statusIndex = this.allowedStatuses.indexOf(status);
        console.log(statusIndex);
        return statusIndex != -1;
    }
}