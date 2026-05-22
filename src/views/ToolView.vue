<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { getToolById } from '@/data/tools'

const route = useRoute()

// 使用 computed 使 toolId 响应路由变化
const toolId = computed(() => route.params.toolId as string)
const tool = computed(() => getToolById(toolId.value))

// 动态加载工具组件
const toolComponent = computed(() => {
  if (!tool.value) return null
  
  // 根据工具 ID 动态加载对应的组件
  const componentMap: Record<string, any> = {
    'json-format': defineAsyncComponent(() => import('@/components/tools/JsonFormatter.vue')),
    'base64-encode': defineAsyncComponent(() => import('@/components/tools/Base64Encoder.vue')),
    'color-converter': defineAsyncComponent(() => import('@/components/tools/ColorConverter.vue')),
    'password-generator': defineAsyncComponent(() => import('@/components/tools/PasswordGenerator.vue')),
    // 在这里添加更多工具组件的映射
  }
  
  return componentMap[toolId.value]
})
</script>

<template>
  <AppLayout>
    <div v-if="tool" class="max-w-6xl mx-auto animate-fade-in">
      <!-- 工具标题 -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-6xl filter drop-shadow-lg animate-bounce">{{ tool.icon }}</span>
          <div>
            <h1 class="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {{ tool.name }}
            </h1>
            <p class="text-base-content/70 mt-2 text-lg">{{ tool.description }}</p>
          </div>
        </div>
      </div>

      <!-- 工具内容区域 -->
      <div class="card bg-base-100 shadow-2xl border border-base-300/50 hover:shadow-3xl transition-shadow duration-300">
        <div class="card-body p-4 sm:p-8">
          <!-- 动态加载工具组件 -->
          <component v-if="toolComponent" :is="toolComponent" />
          
          <!-- 默认模板（当没有具体组件时显示） -->
          <div v-else class="space-y-6">
            <div class="alert alert-info shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">提示</h3>
                <div class="text-xs">这是一个工具模板页面，你可以在这里实现具体的工具功能。</div>
              </div>
            </div>

            <!-- 示例：工具使用区域 -->
            <div class="mt-8 space-y-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-lg">📝 输入</span>
                </label>
                <textarea 
                  class="textarea textarea-bordered h-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="在这里输入内容..."
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  执行操作
                </button>
                <button class="btn btn-outline btn-lg gap-2 hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  清空
                </button>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-lg">✨ 输出</span>
                </label>
                <div class="bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-xl min-h-[100px] border-2 border-dashed border-base-400">
                  <p class="text-base-content/50 text-center">结果将显示在这里...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 animate-fade-in">
      <div class="text-8xl mb-6">😕</div>
      <h2 class="text-3xl font-bold mb-4">工具未找到</h2>
      <p class="text-base-content/70 mb-8 text-lg">抱歉，你访问的工具不存在</p>
      <router-link to="/" class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        返回首页
      </router-link>
    </div>
  </AppLayout>
</template>
