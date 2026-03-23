<script setup>
import { useTodoStore } from '@/stores/todoStore';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';

defineProps({
    type: { type: String, default: 'text' },
    title: { type: String, default: '' },
    name: { type: String, default: '' },
    id: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    textarea: { type: Boolean, default: false },
    modelValue: { type: String, default: '' },
    newTitle: { type: String },
    updateData: { type: Object }
});

const emit = defineEmits(['update:modelValue'])
const { updateTodo, cancelUpdate } = useTodoStore();

const clearEdit = () => {
    emit('update:modelValue', '');
    cancelUpdate();
};

</script>

<template>
    <div class="relative">
        <input
            :type="type"
            :title="title"
            :name="name"
            :id="id"
            placeholder="Enter new todo"
            class="p-3 rounded-3xl w-full border border-gray-300"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            v-bind="$attrs"
        >
        <div v-show="updateData.isEditing">
            <CheckIcon @click="updateTodo(updateData.id, newTitle)" class="size-5 text-white bg-green-600 hover:bg-green-700 cursor-pointer absolute top-4 right-12" />
            <XMarkIcon @click="clearEdit(); updateData.isEditing = false" class="size-5 text-white bg-red-600 hover:bg-red-700 cursor-pointer absolute top-4 right-5" />
        </div>
    </div>
</template>