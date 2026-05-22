<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@/utils/toast'

const input = ref('')
const output = ref('')
const error = ref('')

const formatJSON = () => {
  error.value = ''
  try {
    if (!input.value.trim()) {
      output.value = ''
      return
    }
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    error.value = `JSON 格式错误: ${(e as Error).message}`
    output.value = ''
  }
}

const compressJSON = () => {
  error.value = ''
  try {
    if (!input.value.trim()) {
      output.value = ''
      return
    }
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = `JSON 格式错误: ${(e as Error).message}`
    output.value = ''
  }
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const copyOutput = async () => {
  if (output.value) {
    try {
      await navigator.clipboard.writeText(output.value)
      showToast('JSON 已复制到剪贴板')
    } catch (err) {
      showToast('复制失败', 'error')
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 输入区域 -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-semibold text-lg flex items-center gap-2">
          <span class="text-2xl">📝</span>
          输入 JSON
        </span>
        <span class="label-text-alt text-base-content/60">粘贴或输入 JSON 数据</span>
      </label>
      <textarea 
        v-model="input"
        class="textarea textarea-bordered font-mono h-48 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all rounded-2xl bg-base-200/50 border-base-300 hover:border-primary/50 text-lg p-4 shadow-inner" 
        placeholder='{"name": "example", "value": 123}'
      ></textarea>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-3">
      <button @click="formatJSON" class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        格式化
      </button>
      <button @click="compressJSON" class="btn btn-secondary btn-lg gap-2 hover:scale-105 transition-transform shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        压缩
      </button>
      <button @click="clearAll" class="btn btn-ghost btn-lg gap-2 hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        清空
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error shadow-lg animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- 输出区域 -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-semibold text-lg flex items-center gap-2">
          <span class="text-2xl">✨</span>
          输出结果
        </span>
        <button 
          v-if="output" 
          @click="copyOutput" 
          class="btn btn-sm btn-success gap-2 hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          复制
        </button>
      </label>
      <pre 
        v-if="output" 
        class="bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-2xl overflow-x-auto font-mono text-base border-2 border-primary/20 shadow-inner min-h-[150px] transition-all"
      >{{ output }}</pre>
      <div v-else class="bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-2xl min-h-[150px] flex items-center justify-center text-base-content/50 border-2 border-dashed border-base-400">
        <p>结果将显示在这里...</p>
      </div>
    </div>
  </div>
</template>
