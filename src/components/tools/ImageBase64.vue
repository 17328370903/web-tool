<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@/utils/toast'

const imageUrl = ref('')
const base64Result = ref('')
const previewUrl = ref('')
const isLoading = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请上传图片文件', 'error')
    return
  }

  isLoading.value = true
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    // 修复属性访问错误，删除重复赋值
    previewUrl.value = result
    base64Result.value = result
    isLoading.value = false
    showToast('转换成功')
  }
  reader.onerror = () => {
    showToast('读取文件失败', 'error')
    isLoading.value = false
  }
  reader.readAsDataURL(file)
}

const convertUrlToBase64 = async () => {
  if (!imageUrl.value.trim()) {
    showToast('请输入图片 URL', 'warning')
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(imageUrl.value)
    if (!response.ok) throw new Error('网络请求失败')
    const blob = await response.blob()
    
    if (!blob.type.startsWith('image/')) {
      throw new Error('该链接不是有效的图片地址')
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      base64Result.value = result
      previewUrl.value = result
      isLoading.value = false
      showToast('转换成功')
    }
    reader.readAsDataURL(blob)
  } catch (err) {
    console.error(err)
    showToast(`转换失败: ${err instanceof Error ? err.message : '请确保图片允许跨域访问'}`, 'error')
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  if (!base64Result.value) return
  try {
    await navigator.clipboard.writeText(base64Result.value)
    showToast('已复制到剪贴板')
  } catch (err) {
    showToast('复制失败', 'error')
  }
}

const clearAll = () => {
  imageUrl.value = ''
  base64Result.value = ''
  previewUrl.value = ''
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 输入端 -->
      <div class="space-y-6">
        <!-- 文件上传 -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📁</span> 本地图片上传
            </h3>
            <label 
              class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-base-200/30 border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div class="flex flex-col items-center justify-center pt-4 pb-4">
                <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                <p class="text-sm text-base-content/60">点击或拖拽图片到这里</p>
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
            </label>
          </div>
        </div>

        <!-- URL 转换 -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🌐</span> 图片 URL 转换
            </h3>
            <div class="flex flex-col gap-3">
              <div class="join w-full shadow-sm">
                <input 
                  v-model="imageUrl"
                  type="text" 
                  placeholder="请输入图片 URL 地址..." 
                  class="input input-bordered join-item w-full focus:outline-none"
                  @keyup.enter="convertUrlToBase64"
                />
                <button 
                  @click="convertUrlToBase64"
                  class="btn btn-primary join-item px-6"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
                  转换
                </button>
              </div>
              <p class="text-xs opacity-50 px-1 italic">注意：远程图片需支持跨域 (CORS) 才能转换</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 预览端 -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🖼️</span> 效果预览
          </h3>
          <div class="relative bg-base-200 rounded-2xl aspect-video w-full overflow-hidden border border-base-300 flex items-center justify-center shadow-inner">
            <img v-if="previewUrl" :src="previewUrl" class="max-w-full max-h-full object-contain" />
            <div v-else class="text-base-content/20 flex flex-col items-center gap-2">
              <span class="text-5xl">🔭</span>
              <p class="text-sm">暂无预览</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果展示 -->
    <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
      <div class="card-body p-0">
        <div class="bg-base-200 px-6 py-4 flex justify-between items-center border-b border-base-300">
          <div class="flex flex-col">
            <h3 class="font-bold text-lg">Base64 结果</h3>
            <p class="text-xs opacity-50" v-if="base64Result">长度: {{ base64Result.length }} 字符</p>
          </div>
          <div class="flex gap-2">
            <button 
              v-if="base64Result"
              @click="copyToClipboard" 
              class="btn btn-success btn-sm gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制结果
            </button>
            <button @click="clearAll" class="btn btn-ghost btn-sm text-error">清空</button>
          </div>
        </div>
        <div class="p-6">
          <textarea 
            v-model="base64Result"
            readonly
            class="textarea textarea-bordered w-full h-48 font-mono text-xs focus:outline-none bg-base-200/50"
            placeholder="转换后的 Base64 编码将显示在这里..."
          ></textarea>
          
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 class="font-bold text-xs text-primary uppercase mb-2 tracking-wider">HTML 示例</h4>
              <code class="text-[10px] break-all opacity-70">
                &lt;img src="{{ base64Result.substring(0, 50) }}..." /&gt;
              </code>
            </div>
            <div class="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
              <h4 class="font-bold text-xs text-secondary uppercase mb-2 tracking-wider">CSS 示例</h4>
              <code class="text-[10px] break-all opacity-70">
                background-image: url("{{ base64Result.substring(0, 50) }}...");
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
