<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { toolCategories } from '@/data/tools'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleToolClick = (path: string) => {
  router.push(path).catch(err => {
    console.error('路由跳转失败:', err)
  })
}
</script>

<template>
  <AppLayout>
    <div>
      <!-- Hero 区域 -->
      <div class="hero min-h-[400px] rounded-2xl mb-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-gradient shadow-2xl">
        <div class="hero-content text-center">
          <div class="max-w-2xl">
            <h1 class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              🔧 Web Tool
            </h1>
            <p class="py-6 text-xl text-base-content/80 leading-relaxed">
              一个简洁、高效的在线工具集合<br/>
              <span class="text-lg">为你的日常工作提供便利，让效率提升不止一点点 ✨</span>
            </p>
            <div class="flex justify-center gap-4 mt-4">
              <div class="badge badge-lg badge-primary gap-2">
                <span>🚀</span> 快速
              </div>
              <div class="badge badge-lg badge-secondary gap-2">
                <span>💡</span> 实用
              </div>
              <div class="badge badge-lg badge-accent gap-2">
                <span>🎨</span> 美观
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具分类展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(category, index) in toolCategories" 
          :key="category.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300/50 group"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-3 group-hover:scale-105 transition-transform duration-300">
              <span class="text-5xl mr-3 filter drop-shadow-lg">{{ category.icon }}</span>
              <div>
                <div class="font-bold">{{ category.name }}</div>
                <div class="text-xs text-base-content/60 font-normal">{{ category.tools.length }} 个工具</div>
              </div>
            </h2>
            <p class="text-base-content/70 mb-4 text-sm">{{ category.description }}</p>
            
            <div class="space-y-2">
              <div 
                v-for="tool in category.tools" 
                :key="tool.id"
                @click="handleToolClick(tool.path)"
                class="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/30 group/tool"
              >
                <div class="flex items-center">
                  <span class="text-3xl mr-3 group-hover/tool:scale-125 transition-transform duration-200">{{ tool.icon }}</span>
                  <div class="flex-1">
                    <div class="font-semibold group-hover/tool:text-primary transition-colors duration-200">{{ tool.name }}</div>
                    <div class="text-sm text-base-content/60">{{ tool.description }}</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/30 group-hover/tool:text-primary group-hover/tool:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="mt-12 text-center text-base-content/50 pb-8">
        <p>Made with ❤️ | 持续更新中...</p>
      </div>
    </div>
  </AppLayout>
</template>
