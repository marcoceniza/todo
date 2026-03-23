<script setup>
import { useTodoStore } from '@/stores/todoStore';
import { StarIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const todoStore = useTodoStore();
const props = defineProps(['todo', 'activeFilter']);
const { loading } = storeToRefs(todoStore);
const { setFavorite, setCompleted, deleteTodo } = todoStore;

const todoCompleted = computed(() => Number(props.todo.completed) === 1);
const todoFavorite = computed(() => Number(props.todo.favorite) === 1);

const showFavoriteActions = computed(() => !todoCompleted.value);
const completedIcon = computed(() => todoCompleted.value && props.activeFilter === 'completed');
const completedClass = computed(() => todoCompleted.value ? 'line-through text-red-500' : '');
const showCheckbox = computed(() => !todoCompleted.value && props.activeFilter !== 'completed');
const canEdit = computed(() => !todoCompleted.value && !todoFavorite.value);

const emit = defineEmits(['getID']);
</script>

<template>
    <li
        class="p-3 mx-auto mb-2 border-b border-gray-400 relative"
        :class="showCheckbox ? '' : 'pl-0'"
    >
        <div class="flex">
            <input v-if="showCheckbox" @change="setCompleted(props.todo.id)" type="checkbox" class="cursor-pointer" :class="{ 'cursor-not-allowed opacity-50': loading.completed }" />
            <p class="pl-2" :class="completedClass">{{ props.todo.title }}</p>
        </div>
        <div v-if="showFavoriteActions">
            <PencilSquareIcon 
                v-if="canEdit"
                @click="emit('getID', [props.todo.id, props.todo.title])"
                class="size-5 absolute right-7 top-[14px] text-green-700 hover:text-green-900 cursor-pointer" 
            />
            <span :title="todoFavorite ? 'Unfavorite' : 'Favorite'" class="absolute right-0 top-[14px]">
                <StarIcon @click="setFavorite(props.todo.id)" class="size-5 text-yellow-500 hover:text-yellow-700 cursor-pointer" />
            </span>
        </div>
        <div v-if="completedIcon" class="flex gap-1 absolute right-1 top-[14px]">
            <span title="Restore">
                <ArrowPathIcon @click="setCompleted(props.todo.id)" class="size-5 text-gray-700 hover:text-yellow-900 cursor-pointer" />
            </span>
            <span title="Delete">
                <TrashIcon @click="deleteTodo(props.todo.id)" class="size-5 text-red-500 hover:text-red-700 cursor-pointer" />
            </span>
        </div>
    </li>
</template>