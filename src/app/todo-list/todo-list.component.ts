import { Component, OnInit } from '@angular/core'; // Importa tu servicio
import { Task } from '../models/task'; // Importa la interfaz Task
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: string = '';

  constructor(private todoService: TodoService) {} // Inyecta el servicio

  ngOnInit(): void {
    this.loadTasks(); // Carga las tareas al inicializar el componente
  }

  // Cargar todas las tareas desde el servicio
  loadTasks() {
    this.todoService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  // Añadir una nueva tarea
  addTask() {
    if (this.newTask.trim()) {
      const task: Task = {
        userId: 1, // Ejemplo, puedes ajustar según tu lógica
        id: 0, // El ID será generado por el servidor
        title: this.newTask.trim(),
        completed: false,
      };

      this.todoService.addTask(task).subscribe((newTask) => {
        this.tasks.push(newTask);
        this.newTask = '';
      });
    }
  }

  // Eliminar una tarea
  removeTask(index: number) {
    const taskToDelete = this.tasks[index];
    this.todoService.deleteTask(taskToDelete.id).subscribe(() => {
      this.tasks.splice(index, 1);
    });
  }

  // Marcar una tarea como completada
  toggleTaskCompletion(index: number) {
    const task = this.tasks[index];
    task.completed = !task.completed;

    this.todoService.updateTask(task).subscribe((updatedTask) => {
      this.tasks[index] = updatedTask;
    });
  }
}
