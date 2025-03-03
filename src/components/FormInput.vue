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
    updateData: { type: Object },
    clearFieldHandler: { type: Function }
});

const emit = defineEmits(['update:modelValue'])
const { update } = useTodoStore();

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
        <div v-show="updateData.icon">
            <CheckIcon @click="update(updateData.id, newTitle, updateData.icon = false, clearFieldHandler())" class="size-5 text-green-500 hover:text-green-700 cursor-pointer absolute top-4 right-12" />
            <XMarkIcon @click="updateData.icon = false, clearFieldHandler()" class="size-5 text-red-500 hover:text-red-700 cursor-pointer absolute top-4 right-5" />
        </div>
    </div>
</template>