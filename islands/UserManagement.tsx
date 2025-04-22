import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import UserForm from "./UserForm.tsx"; // Asegúrate de importar el formulario
import { User } from "../types.ts";
import { fetchUsers, deleteUser } from "../utils.ts"; // Importa también deleteUser

export default function UserManagement() {
  const showForm = useSignal<boolean>(false);
  const userToEdit = useSignal<User | null>(null);  // Si necesitas editar, aquí se gestiona el usuario
  const editingUserId = useSignal<string | null>(null);
  const users = useSignal<User[]>([]);  // Lista de usuarios almacenados

  // Cargar los usuarios cuando el componente se monta
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsers();  // Usar fetchUsers desde utils.ts
        console.log(usersList);
        users.value = usersList;
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, []);  // Solo se ejecuta una vez al montar el componente

  const handleCreateNewUser = () => {
    // Muestra el formulario para crear un nuevo usuario
    showForm.value = true;
    userToEdit.value = null;  // Asegúrate de limpiar cualquier usuario a editar
    editingUserId.value = null;  // Y también limpiar el id de edición
  };

  const handleUserSaved = () => {
    // Oculta el formulario después de guardar
    showForm.value = false;

    // Recargar la lista de usuarios después de guardar (si es necesario)
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsers();
        users.value = usersList;
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  };

  const handleCancel = () => {
    // Oculta el formulario sin guardar
    showForm.value = false;
  };

  const handleEditUser = (user: User) => {
    // Muestra el formulario para editar un usuario
    showForm.value = true;
    userToEdit.value = user;
    editingUserId.value = user._id;
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);  // Llama a la función deleteUser de utils.ts
      // Después de eliminar el usuario, recargamos la lista de usuarios
      const updatedUsers = users.value.filter((user) => user._id !== userId);
      users.value = updatedUsers;
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateNewUser} class="btn btn-primary">
        Create New User
      </button>

      {showForm.value ? (
        <UserForm
          editingUserId={editingUserId.value}
          userToEdit={userToEdit.value}
          onUserSaved={handleUserSaved}
          onCancel={handleCancel}
        />
      ) : (
        <div>
          <h2>List of Users</h2>
          {users.value.length > 0 ? (
            <ul>
              {users.value.map((user) => (
                <li key={user._id}>
                  <div>
                    <strong>{user.name}</strong> - {user.email}
                    <button onClick={() => handleEditUser(user)} class="btn btn-secondary">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)} 
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}