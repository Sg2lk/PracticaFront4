import {
  CreateTaskRequest,
  CreateUserRequest,
  MoveTaskRequest,
  Task,
  TaskStatus,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  UpdateUserRequest,
  User,
} from "./types.ts";
import { API_URL } from "./config.ts";

// Tipo para la respuesta completa de la API
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Función para manejar la respuesta de la API
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  return await response.json() as T;
}

// Obtener todos los usuarios
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/users/`);
  const data = await handleResponse<ApiResponse<User[]>>(response);
  return data.data; // Devuelve solo el array de usuarios
}

// Obtener un usuario específico por ID
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/users/${id}`);
  return handleResponse<User>(response);
}

// Crear un nuevo usuario
export async function createUser(userData: CreateUserRequest): Promise<User> {
  const response = await fetch(`${API_URL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse<User>(response);
}

// Actualizar un usuario existente
export async function updateUser(
  id: string,
  userData: UpdateUserRequest,
): Promise<User> {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse<User>(response);
}

// Eliminar un usuario
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
  });
  await handleResponse<void>(response);
}

// Obtener todas las tareas
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/api/tasks/`);
  const data = await handleResponse<ApiResponse<Task[]>>(response); // Cambiar para manejar ApiResponse
  return data.data; // Devuelve solo el array de tareas dentro del campo 'data'
}

// Obtener una tarea específica por ID
export async function fetchTask(id: string): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`);
  const data = await handleResponse<ApiResponse<Task>>(response); // Cambiar para manejar ApiResponse
  return data.data; // Devuelve la tarea dentro del campo 'data'
}

// Función para crear la tarea (Asegúrate de que los datos sean correctos)
export async function createTask(taskData: CreateTaskRequest): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData), // Verifica que el cuerpo de la solicitud esté correctamente formateado
  });

  const data = await handleResponse<ApiResponse<Task>>(response);
  return data.data; // Devuelve la tarea recién creada
}


// Actualizar una tarea existente
export async function updateTask(
  id: string,
  taskData: UpdateTaskRequest,
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  const data = await handleResponse<ApiResponse<Task>>(response); // Cambiar para manejar ApiResponse
  return data.data; // Devuelve la tarea actualizada dentro del campo 'data'
}

// Eliminar una tarea
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });
  await handleResponse<ApiResponse<void>>(response); // Cambiar para manejar ApiResponse
  // No se necesita devolver nada aquí, ya que es un 'void'
}

// Actualizar el estado de una tarea
export async function updateTaskStatus(
  id: string,
  status: UpdateTaskStatusRequest,
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });
  const data = await handleResponse<ApiResponse<Task>>(response); // Cambiar para manejar ApiResponse
  return data.data; // Devuelve la tarea con el nuevo estado dentro del campo 'data'
}

// Mover una tarea a otro usuario
export async function moveTask(id: string, userId: string): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/${id}/move`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  const data = await handleResponse<ApiResponse<Task>>(response); // Cambiar para manejar ApiResponse
  return data.data; // Devuelve la tarea movida dentro del campo 'data'
}

// Función para formatear una fecha
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

// Agrupar tareas por estado
export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped: Record<TaskStatus, Task[]> = {
    [TaskStatus.PENDING]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.COMPLETED]: [],
  };

  for (const task of tasks) {
    grouped[task.status].push(task);
  }

  return grouped;
}

// Validar si un correo electrónico es válido
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar el formulario de creación de un usuario
export function validateUserForm(data: CreateUserRequest): string | null {
  if (!data.name || data.name.trim() === "") {
    return "Name is required";
  }

  if (!data.email || data.email.trim() === "") {
    return "Email is required";
  }

  if (!isValidEmail(data.email)) {
    return "Email format is invalid";
  }

  return null;
}

// Validar el formulario de creación de una tarea
export function validateTaskForm(data: CreateTaskRequest): string | null {
  if (!data.title || data.title.trim() === "") {
    return "Title is required";
  }

  if (!data.user) {
    return "User assignment is required";
  }

  return null;
}