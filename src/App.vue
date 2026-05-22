<script setup lang="ts">
import { RouterView } from 'vue-router'
import { toasts } from '@/utils/toast'
</script>

<template>
  <RouterView />
  
  <!-- 全局 Toast 容器 -->
  <div class="toast toast-end toast-bottom z-[100] p-4">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      class="alert shadow-lg animate-fade-in-up"
      :class="{
        'alert-success': toast.type === 'success',
        'alert-error': toast.type === 'error',
        'alert-info': toast.type === 'info',
        'alert-warning': toast.type === 'warning'
      }"
    >
      <div class="flex items-center gap-2">
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <svg v-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
