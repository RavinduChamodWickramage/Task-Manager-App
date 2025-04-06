import { Pipe, PipeTransform } from "@angular/core";
import { TaskStatus } from "../../models/task.model";

@Pipe({
  name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
  transform(value: TaskStatus | string): string {
    switch (value) {
      case TaskStatus.NOT_STARTED:
        return 'Not Started';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return value.toString();
    }
  }
}
