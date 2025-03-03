<script setup>
import { useTodoStore } from '@/stores/todoStore';
import { StarIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';

const { todo, activeFilter } = defineProps(['todo', 'activeFilter']);
const { isFavorite, isCompleted, destroy } = useTodoStore();

const favoriteIcon = computed(() => {
    return (todo.completed === 0 && activeFilter === 'all') || activeFilter === 'favorite';
});

const completedIcon = computed(() => {
    return todo.completed === 1 && activeFilter === 'completed';
});

const emit = defineEmits(['getID']);

</script>

<template>
    <li class="p-3 mx-auto mb-2 border-b border-gray-400 relative">
        <div class="flex">
            <input @change="isCompleted(todo.id)" type="checkbox" class="cursor-pointer">
            <p class="pl-2" :class="{ 'line-through text-red-500': todo.completed === 1 }">{{ todo.title }}</p>
        </div>
        <div v-show="favoriteIcon">
            <PencilSquareIcon @click="emit('getID', [todo.id, todo.title])" class="size-5 absolute right-7 top-[14px] text-green-700 hover:text-green-900 cursor-pointer" />
            <StarIcon @click="isFavorite(todo.id)" class="size-5 absolute right-0 top-[14px] text-yellow-500 hover:text-yellow-700 cursor-pointer" />
        </div>
        <div v-if="completedIcon" class="flex gap-1 absolute right-1 top-[14px]">
            <ArrowPathIcon @click="isCompleted(todo.id)" class="size-5 text-gray-700 hover:text-yellow-900 cursor-pointer" />
            <TrashIcon @click="destroy(todo.id)" class="size-5 text-red-500 hover:text-red-700 cursor-pointer" />
        </div>
    </li>
</template>