import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Task } from '../models/task';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: string = '';
  errorMessage: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService
      .getTasks()
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Error al cargar las tareas.';
          console.error(error);
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.tasks = tasks.map((task) => ({
          ...task,
          showSubTaskInput: false,
          subTask: '',
        }));
      });
  }

  addTask() {
    if (this.newTask.trim()) {
      const task: Task = {
        userId: 1,
        id: 0,
        title: this.newTask.trim(),
        completed: false,
        showSubTaskInput: false,
        subTask: '',
      };

      this.todoService
        .addTask(task)
        .pipe(
          catchError((error) => {
            this.errorMessage = 'Error al añadir la tarea.';
            console.error(error);
            return of(task);
          })
        )
        .subscribe((newTask) => {
          this.tasks.push(newTask);
          this.newTask = '';
        });
    }
  }

  removeTask(index: number) {
    const taskToDelete = this.tasks[index];
    this.todoService
      .deleteTask(taskToDelete.id)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Error al eliminar la tarea.';
          console.error(error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.tasks.splice(index, 1);
      });
  }

  toggleTaskCompletion(index: number) {
    const task = this.tasks[index];
    task.completed = !task.completed;
    this.tasks[index].showSubTaskInput = task.completed;

    this.todoService
      .updateTask(task)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Error al actualizar la tarea.';
          console.error(error);
          return of(task);
        })
      )
      .subscribe((updatedTask) => {
        this.tasks[index] = updatedTask;
      });
  }

  addSubTask(index: number) {
    const task = this.tasks[index];
    if (task.subTask?.trim()) {
      const subTask: Task = {
        userId: 1,
        id: 0,
        title: task.subTask.trim(),
        completed: false,
        showSubTaskInput: false,
        subTask: '',
      };

      this.todoService
        .addTask(subTask)
        .pipe(
          catchError((error) => {
            this.errorMessage = 'Error al añadir la sub-tarea.';
            console.error(error);
            return of(null);
          })
        )
        .subscribe((newTask) => {
          task.subTask = '';
          task.showSubTaskInput = false;
          this.tasks[index] = { ...this.tasks[index] };
        });
    }
  }
}
