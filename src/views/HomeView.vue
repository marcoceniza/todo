<script setup>
import { computed, onMounted, provide, ref, watch } from 'vue';
import FormInput from '@/components/FormInput.vue';
import TodoList from '@/components/TodoList.vue';
import { useTodoStore } from '@/stores/todoStore';
import { storeToRefs } from 'pinia';

const todoStore = useTodoStore();
const { todos, updateData, loading, title } = storeToRefs(todoStore);
const { fetchTodos, createTodo, updateTodo, setEdit } = todoStore;
const currentPage = ref(1);
const itemsPerPage = 5;
const activeFilter = ref('all');

const normalizedTodos = computed(() => {
  return todos.value.map(todo => ({
    ...todo,
    completed: Number(todo.completed) === 1,
    favorite: Number(todo.favorite) === 1,
  }));
});

const counts = computed(() => {
  const favorite = normalizedTodos.value.filter(t => t.favorite).length;
  const completed = normalizedTodos.value.filter(t => t.completed).length;
  const all = normalizedTodos.value.filter(t => !t.completed && !t.favorite).length;
  return { all, favorite, completed };
});

const filteredTodos = computed(() => {
  if (!normalizedTodos.value) return [];

  if (activeFilter.value === 'favorite') {
    return normalizedTodos.value.filter(todo => todo.favorite);
  } else if (activeFilter.value === 'completed') {
    return normalizedTodos.value.filter(todo => todo.completed);
  } else {
    return normalizedTodos.value.filter(todo => !todo.completed && !todo.favorite);
  }
});

const emptyMessage = computed(() => {
  if (!filteredTodos.value.length) {
    if (activeFilter.value === 'favorite') return 'No Favorite';
    if (activeFilter.value === 'completed') return 'No Completed';
    return 'No Data';
  }
  return '';
});

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTodos.value.slice(start, start + itemsPerPage);
});

watch(activeFilter, () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTodos.value.length / itemsPerPage)));

const getIdHandler = ([id, newTitle]) => {
  title.value = newTitle;
  setEdit({ id });
};

const submitHandler = () => {
  if (updateData.value.id) {
    updateTodo(updateData.value.id, title.value);
  } else {
    createTodo(title.value);
  }
};

const clearEdit = () => title.value = '';

provide('clearEdit', clearEdit);

onMounted(() => fetchTodos() );
</script>

<template>
  <div class="container mx-auto mt-4">
    <div class="w-[500px] text-center mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl my-4 font-semibold">Todo</h1>
        <ul class="flex gap-2 text-sm text-gray-600">
          <li>
            <a href="#" 
                :class="{ 'font-bold text-black': activeFilter === 'all' }" 
                @click.prevent="activeFilter = 'all'">
                All ({{ counts.all }})
            </a>
          </li>
          <li>
            <a href="#" 
                :class="{ 'font-bold text-black': activeFilter === 'favorite' }" 
                @click.prevent="activeFilter = 'favorite'">
                Favorite ({{ counts.favorite }})
            </a>
          </li>
          <li>
            <a href="#" 
                :class="{ 'font-bold text-black': activeFilter === 'completed' }" 
                @click.prevent="activeFilter = 'completed'">
                Completed ({{ counts.completed }})
            </a>
          </li>
        </ul>
      </div>

      <form 
        v-if="activeFilter === 'all' && !(updateData.value?.completed) && !(updateData.value?.favorite)" 
        @submit.prevent="submitHandler"
      >
        <FormInput
          v-model="title"
          :updateData="updateData"
          :newTitle="title"
          :class="{ 'cursor-not-allowed opacity-50': loading.create }"
        />
      </form>

      <p v-if="loading.fetch" class="text-center text-gray-400 py-5 mb-4 border-b relative text-[15px]">Loading...</p>
      <p v-else-if="!filteredTodos.length" class="text-center text-gray-400 py-5 mb-4 border-b relative text-[15px]">{{ emptyMessage }}</p>
      <div
        v-else
        :class="{ 'pointer-events-none cursor-not-allowed opacity-50': updateData.isEditing }"
      >
        <ul class="mt-4 text-left">
          <li v-for="todo in paginatedTodos" :key="todo.id">
            <TodoList 
              :todo="todo" 
              @get-ID="getIdHandler" 
              :activeFilter="activeFilter"
            />
          </li>
        </ul>
      </div>

      <div class="flex justify-center mt-6">
        <button 
          @click="currentPage--" 
          :disabled="currentPage <= 1" 
          class="px-3 py-1 mx-1 border rounded cursor-pointer disabled:opacity-50"
        >Prev</button>
        <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages || !filteredTodos.length" 
          class="px-3 py-1 mx-1 border rounded cursor-pointer disabled:opacity-50"
        >Next</button>
      </div>
    </div>
  </div>
</template>