import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/axios';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([]);
  const errors = ref({});
  const title = ref('');
  const loading = ref({ fetch: false, create: false, update: false, delete: false, favorite: false, completed: false });
  const updateData = ref({ id: null, isEditing: false });

  const fetchTodos = async () => {
    try {
      loading.value.fetch = true;
      const res = await api.get('/api/todos');
      todos.value = res.data.result;
    } catch(error) {
      console.error(error);
    } finally {
      loading.value.fetch = false;
    }
  }

  const createTodo = async (newTitle) => {
    try {
      loading.value.create = true;
      const res = await api.post('/api/todos', { title: newTitle });
      const newTodo = { completed: 0, favorite: 0, ...res.data.result };

      todos.value.unshift(newTodo);
      clearEdit();
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        console.error("Something went wrong");
      }
    } finally {
      loading.value.create = false;
    }
  };

  const updateTodo = async (id, title) => {
    try {
      const res = await api.put(`/api/todos/${id}`, { title });
      const updatedTodo = res.data.result;

      const idx = todos.value.findIndex(t => t.id === id);
      if (idx !== -1) {
        todos.value[idx] = { ...todos.value[idx], ...updatedTodo };
      }

      await fetchTodos();
      clearEdit();
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        console.error("Something went wrong");
      }
    } finally {
      console.log('Update todo completed');
    }
  };

  const cancelUpdate = () => {
    title.value = '';
    clearEdit();
  }

  const setEdit = (todo) => {
    updateData.value.id = todo.id;
    updateData.value.isEditing = true;
  };
  
  const clearEdit = () => {
    updateData.value.id = null;
    updateData.value.isEditing = false;
    title.value = '';
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      todos.value = todos.value.filter(t => t.id !== id);
    } catch(error) {
      console.log(error);
    } finally {
      loading.value.delete = false;
    }
  }

  const setFavorite = async (id) => {
    try {
      loading.value.favorite = true;
      const res = await api.post(`/api/favorite/${id}`);

      const index = todos.value.findIndex(t => t.id === id);
      if (index !== -1) {
        todos.value[index] = { ...todos.value[index], ...res.data.result };
      }
      
    } catch(error) {
      console.error(error);
    } finally {
      loading.value.favorite = false;
    }
  }

  const setCompleted = async (id) => {
    try {
      loading.value.completed = true;
      const res = await api.post(`/api/completed/${id}`);

      const index = todos.value.findIndex(t => t.id === id);
      if (index !== -1) {
        todos.value[index] = { ...todos.value[index], ...res.data.result };
      }

    } catch(error) {
      console.error(error);
    } finally {
      loading.value.completed = false;
    }
  };

  return {
    createTodo,
    fetchTodos,
    updateTodo,
    deleteTodo,
    todos,
    setFavorite,
    setCompleted,
    updateData,
    setEdit,
    clearEdit,
    errors,
    loading,
    title,
    cancelUpdate
  }
})
