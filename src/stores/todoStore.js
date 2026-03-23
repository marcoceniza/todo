import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/axios';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([]);
  const errors = ref({});
  const loading = ref({ fetch: false, create: false, update: false, delete: false, favorite: false, completed: false });
  const updateData = ref({ id: null, isEditing: false });
  const setEdit = (todo) =>{ updateData.value.id = todo.id; updateData.value.isEditing = true };
  const clearEdit = () =>{ updateData.value.id = null; updateData.value.isEditing = false };

  const index = async () => {
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

  const store = async (formData) => {
    try {
      loading.value.create = true;
      const res = await api.post('/api/todos', formData);
      const newTodo = { completed: 0, favorite: 0, ...res.data.result };

      todos.value.unshift(newTodo);
      formData.title = '';
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

  const update = async (id, formData) => {
    try {
      const { data: res } = await api.put(`/api/todos/${id}`, {
        title: formData
      });

      // sync local list
      const todo = todos.value.find(t => t.id === id);
      if (todo) Object.assign(todo, res.result);

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

  const destroy = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      todos.value = todos.value.filter(t => t.id !== id);
    } catch(error) {
      console.log(error);
    } finally {
      loading.value.delete = false;
    }
  }

  const isFavorite = async (id) => {
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

  const isCompleted = async (id) => {
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
    store,
    index,
    update,
    destroy,
    todos,
    isFavorite,
    isCompleted,
    updateData,
    setEdit,
    clearEdit,
    errors,
    loading
  }
})
