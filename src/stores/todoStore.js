import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([]);
  const urlLink = 'https://todo.mc-dev.site/api-v1/api';

  const index = async () => {
    try {
      const res = await axios.get(`${urlLink}/todos`);

      todos.value = res.data.result
    }catch(error) {
      console.error(error);
    }
  }

  const store = async (formData) => {
    try {
      await axios.post(`${urlLink}/todos`, formData);

      formData.title = '';
      await index();
    }catch(error) {
      console.error(error);
    }
  }

  const update = async (id, title) => {
    try {
      await axios.put(`${urlLink}/todos/${id}`, { title: title });

      title = '';
      await index();
    }catch(error) {
      console.log(error);
    }
  }

  const destroy = async (id) => {
    try {
      await axios.delete(`${urlLink}/todos/${id}`);
      await index();
    }catch(error) {
      console.log(error);
    }
  }

  const isFavorite = async (id) => {
    try {
      await axios.post(`${urlLink}/favorite/${id}`);
      await index();
    }catch(error) {
      console.error(error);
    }
  }

  const isCompleted = async (id) => {
    try {
      await axios.post(`${urlLink}/completed/${id}`);
      index();
    }catch(error) {
      console.error(error);
    }
  }

  return { store, index, update, destroy, todos, isFavorite, isCompleted }
})
