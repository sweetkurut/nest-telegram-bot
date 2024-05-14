import { TaskEntity } from './task.entity';

export function showList(todos: TaskEntity[]): string {
  return todos
    .map((todo) => `${todo.name} ${todo.isCompleted ? '✅' : '❌'}`)
    .join('\n');
}
