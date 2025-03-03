<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import TodoList from '@/components/TodoList.vue';
import { useTodoStore } from '@/stores/todoStore';
import { storeToRefs } from 'pinia';

const { store, index } = useTodoStore();
const { todos } = storeToRefs(useTodoStore());
const formData = reactive({ title: '' });
const currentPage = ref(1);
const itemsPerPage = 5;
const activeFilter = ref('all');
const updateData = reactive({ id: null, icon: false });
const emptyMessage = ref('');

const filteredTodos = computed(() => {
  let filtered = todos.value;

  if (activeFilter.value === 'favorite') {
    filtered = filtered.filter(todo => todo.favorite);
    
    emptyMessage.value = filtered.length === 0 ? 'No Favorite' : '';
  } else if (activeFilter.value === 'completed') {
    filtered = filtered.filter(todo => todo.completed);

    emptyMessage.value = filtered.length === 0 ? 'No Completed' : '';
  } else if (activeFilter.value === 'all') {
    filtered = filtered.filter(todo => !todo.completed && !todo.favorite);

    emptyMessage.value = filtered.length === 0 ? 'No Data' : '';
  }

  return filtered;
});


const getIdHandler = ([id, title]) => {
  formData.title = title;
  updateData.id = id;
  updateData.icon = true;
}

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTodos.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / itemsPerPage));
const clearFieldHandler = () => formData.title = '';

onMounted(() =>{ index() });
</script>

<template>
  <div class="container mx-auto mt-4">
    <div class="w-[500px] text-center mx-auto">
      <div class="flex justify-between items-center">
          <h1 class="text-2xl my-4 font-semibold">Todo</h1>
          <ul class="flex gap-2 text-sm text-gray-600">
            <li><a href="#" :class="{'font-bold text-black': activeFilter === 'all'}" @click.prevent="activeFilter = 'all'">All</a></li>
            <li><a href="#" :class="{'font-bold text-black': activeFilter === 'favorite'}" @click.prevent="activeFilter = 'favorite'">Favorite</a></li>
            <li><a href="#" :class="{'font-bold text-black': activeFilter === 'completed'}" @click.prevent="activeFilter = 'completed'">Completed</a></li>
          </ul>
      </div>
      <form @submit.prevent="store(formData)">
        <FormInput v-model="formData.title" :updateData="updateData" :clearFieldHandler="clearFieldHandler" :newTitle="formData.title" />
      </form>
      <ul v-for="todo in paginatedTodos" :key="todo.id" class="mt-4 text-left">
        <TodoList :todo="todo" @get-ID="getIdHandler" :activeFilter="activeFilter"/>
      </ul>

      <p v-if="!filteredTodos.length" class="text-center text-gray-400 py-5 mb-4 border-b relative text-[15px]">{{ emptyMessage }}</p>

      <div class="flex justify-center mt-6">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 mx-1 border rounded cursor-pointer disabled:opacity-50" > Prev </button>
          <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 mx-1 border rounded cursor-pointer disabled:opacity-50" > Next </button>
      </div>
  </div>
    </div>
</template>
