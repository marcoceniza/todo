<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import FormInput from '@/components/FormInput.vue';
import TodoList from '@/components/TodoList.vue';
import { useTodoStore } from '@/stores/todoStore';
import { storeToRefs } from 'pinia';

const todoStore = useTodoStore();
const { todos, updateData, loading } = storeToRefs(todoStore);

const formData = reactive({ title: '' });
const currentPage = ref(1);
const itemsPerPage = 5;
const activeFilter = ref('all');
const emptyMessage = ref('');

// Compute counts for each category
const counts = computed(() => {
  const favorite = todos.value.filter(t => Number(t.favorite) === 1).length;
  const completed = todos.value.filter(t => Number(t.completed) === 1).length;
  const all = todos.value.filter(t => Number(t.completed) === 0 && Number(t.favorite) === 0).length;
  return { all, favorite, completed };
});

// Filter todos based on activeFilter
const filteredTodos = computed(() => {
  let filtered = todos.value || [];

  if (activeFilter.value === 'favorite') {
    filtered = filtered.filter(todo => Number(todo.favorite) === 1);
    emptyMessage.value = filtered.length === 0 ? 'No Favorite' : '';
  } else if (activeFilter.value === 'completed') {
    filtered = filtered.filter(todo => Number(todo.completed) === 1);
    emptyMessage.value = filtered.length === 0 ? 'No Completed' : '';
  } else if (activeFilter.value === 'all') {
    filtered = filtered.filter(todo => Number(todo.completed) === 0 && Number(todo.favorite) === 0);
    emptyMessage.value = filtered.length === 0 ? 'No Data' : '';
  }

  return filtered;
});

// Reset current page when filter or data changes
watch([activeFilter, filteredTodos], () => {
  currentPage.value = 1;
});

// Pagination
const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTodos.value.slice(start, start + itemsPerPage);
});

// Total pages
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTodos.value.length / itemsPerPage)));

// Handlers
const getIdHandler = ([id, title]) => {
  formData.title = title;
  todoStore.setEdit({ id });
};

const submitHandler = () => {
  if (updateData.value.id) {
    todoStore.update(updateData.value.id, formData.title);
  } else {
    todoStore.store(formData);
  }
};

onMounted(() => {
  todoStore.index();
});
</script>

<template>
  <div class="container mx-auto mt-4">
    <div class="w-[500px] text-center mx-auto">
      <!-- Header + Filter -->
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

      <!-- Form -->
      <form @submit.prevent="submitHandler">
        <FormInput
          v-model="formData.title"
          :updateData="updateData"
          :newTitle="formData.title"
          :class="{ 'cursor-not-allowed opacity-50': loading.create }"
        />
      </form>

      <!-- Todo List -->
      <p v-if="loading.fetch" class="text-center text-gray-400 py-5 mb-4 border-b relative text-[15px]">Loading...</p>
      <p v-else-if="!filteredTodos.length" class="text-center text-gray-400 py-5 mb-4 border-b relative text-[15px]">{{ emptyMessage }}</p>
      <div v-else>
        <ul v-for="todo in paginatedTodos" :key="todo.id" class="mt-4 text-left">
          <TodoList :todo="todo" @get-ID="getIdHandler" :activeFilter="activeFilter"/>
        </ul>
      </div>

      <!-- Pagination -->
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