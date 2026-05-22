<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toolCategories } from '@/data/tools'

const router = useRouter()
const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleToolClick = (path: string) => {
  router.push(path).catch(err => {
    console.error('路由跳转失败:', err)
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-100/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-base-300/50">
      <div class="navbar-start">
        <button @click="toggleSidebar" class="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <RouterLink to="/" class="btn btn-ghost text-xl ml-2 hover:scale-105 transition-transform duration-300">
          <span class="text-2xl mr-2">🔧</span>
          <span class="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Web Tool</span>
        </RouterLink>
      </div>
      <div class="navbar-end">
        <a href="https://github.com" target="_blank" class="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="flex">
      <!-- 侧边栏 -->
      <aside 
        v-show="isSidebarOpen" 
        class="w-64 bg-base-100/90 backdrop-blur-md shadow-xl transition-all duration-300 border-r border-base-300/50"
      >
        <div class="p-4">
          <h3 class="font-bold text-lg mb-4 flex items-center">
            <span class="mr-2">📚</span>
            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">工具分类</span>
          </h3>
          <div class="space-y-3">
            <div v-for="category in toolCategories" :key="category.id" class="group">
              <div class="font-semibold mb-2 flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
                <span class="text-2xl mr-2 group-hover:scale-110 transition-transform duration-200">{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </div>
              <ul class="menu bg-base-100/50 w-full p-0 rounded-lg">
                <li v-for="tool in category.tools" :key="tool.id">
                  <a @click.prevent="handleToolClick(tool.path)" class="cursor-pointer block hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg">
                    <span class="mr-2">{{ tool.icon }}</span>
                    {{ tool.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-6 animate-fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>
