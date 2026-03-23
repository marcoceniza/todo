<script setup>
import { useTodoStore } from '@/stores/todoStore';
import { StarIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const todoStore = useTodoStore();
const { todo, activeFilter } = defineProps(['todo', 'activeFilter']);
const { loading } = storeToRefs(todoStore);

const favoriteIcon = computed(() => {
    return (Number(todo.completed) === 0 && activeFilter === 'all') || activeFilter === 'favorite';
});

const completedIcon = computed(() => {
    return Number(todo.completed) === 1 && activeFilter === 'completed';
});

const completedClass = computed(() => {
    return Number(todo.completed) === 1 ? 'line-through text-red-500' : '';
});

const showCheckbox = computed(() => {
    return Number(todo.completed) === 0 && activeFilter !== 'completed';
});

const emit = defineEmits(['getID']);

</script>

<template>
    <li
        class="p-3 mx-auto mb-2 border-b border-gray-400 relative"
        :class="showCheckbox ? '' : 'pl-0'"
    >
        <div class="flex">
            <input v-show="showCheckbox" @change="todoStore.isCompleted(todo.id)" type="checkbox" class="cursor-pointer" :class="{ 'cursor-not-allowed opacity-50': loading.completed }" />
            <p class="pl-2" :class="completedClass">{{ todo.title }}</p>
        </div>
        <div v-show="favoriteIcon">
            <PencilSquareIcon @click="emit('getID', [todo.id, todo.title])" class="size-5 absolute right-7 top-[14px] text-green-700 hover:text-green-900 cursor-pointer" />
            <StarIcon @click="todoStore.isFavorite(todo.id)" class="size-5 absolute right-0 top-[14px] text-yellow-500 hover:text-yellow-700 cursor-pointer" />
        </div>
        <div v-if="completedIcon" class="flex gap-1 absolute right-1 top-[14px]">
            <ArrowPathIcon @click="todoStore.isCompleted(todo.id)" class="size-5 text-gray-700 hover:text-yellow-900 cursor-pointer" />
            <TrashIcon @click="todoStore.destroy(todo.id)" class="size-5 text-red-500 hover:text-red-700 cursor-pointer" />
        </div>
    </li>
</template>