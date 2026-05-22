<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@/utils/toast'

const input = ref('')
const output = ref('')
const error = ref('')

const encodeBase64 = () => {
  error.value = ''
  try {
    if (!input.value) {
      output.value = ''
      return
    }
    // 使用 btoa 进行编码，处理 Unicode 字符
    const encoded = btoa(encodeURIComponent(input.value).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    }))
    output.value = encoded
  } catch (e) {
    error.value = `编码失败: ${(e as Error).message}`
    output.value = ''
  }
}

const decodeBase64 = () => {
  error.value = ''
  try {
    if (!input.value) {
      output.value = ''
      return
    }
    // 使用 atob 进行解码，处理 Unicode 字符
    const decoded = decodeURIComponent(atob(input.value).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    output.value = decoded
  } catch (e) {
    error.value = `解码失败: 可能是无效的 Base64 字符串 (${(e as Error).message})`
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
      showToast('结果已复制到剪贴板')
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
          输入文本
        </span>
        <span class="label-text-alt text-base-content/60">输入要编码或解码的内容</span>
      </label>
      <textarea 
        v-model="input"
        class="textarea textarea-bordered font-mono h-48 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all rounded-2xl bg-base-200/50 border-base-300 hover:border-primary/50 text-lg p-4 shadow-inner" 
        placeholder="在这里输入内容..."
      ></textarea>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-3">
      <button @click="encodeBase64" class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Base64 编码
      </button>
      <button @click="decodeBase64" class="btn btn-secondary btn-lg gap-2 hover:scale-105 transition-transform shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        Base64 解码
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
      <div 
        v-if="output" 
        class="bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-2xl overflow-x-auto font-mono text-lg border-2 border-primary/20 shadow-inner break-all whitespace-pre-wrap min-h-[150px] transition-all"
      >{{ output }}</div>
      <div v-else class="bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-2xl min-h-[150px] flex items-center justify-center text-base-content/50 border-2 border-dashed border-base-400">
        <p>结果将显示在这里...</p>
      </div>
    </div>
  </div>
</template>
