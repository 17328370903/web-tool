<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@/utils/toast'

const originalImage = ref<string | null>(null)
const isLoading = ref(false)

// 九宫格数据
const gridImages = ref<string[]>([])

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请上传图片文件', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string
    gridImages.value = [] // 重置
  }
  reader.readAsDataURL(file)
}

// 九宫格切分逻辑
const sliceNineGrid = () => {
  if (!originalImage.value) return
  isLoading.value = true

  const img = new Image()
  img.src = originalImage.value
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 九宫格通常按原图比例平均切成 3x3 的 9 份
    const w = img.width / 3
    const h = img.height / 3
    
    canvas.width = w
    canvas.height = h

    const results: string[] = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(
          img,
          col * w, row * h, w, h, // 源位置
          0, 0, w, h             // 目标位置
        )
        results.push(canvas.toDataURL('image/png'))
      }
    }
    gridImages.value = results
    isLoading.value = false
    showToast('切分成功')
  }
}

const downloadImage = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

const downloadAllGrid = () => {
  gridImages.value.forEach((url, index) => {
    setTimeout(() => {
      downloadImage(url, `grid-${index + 1}.png`)
    }, index * 200) // 延迟下载防止浏览器拦截
  })
}

const reset = () => {
  originalImage.value = null
  gridImages.value = []
}
</script>

<template>
  <div class="space-y-6">
    <!-- 上传区域 -->
    <div v-if="!originalImage" class="flex flex-col items-center justify-center w-full">
      <label 
        for="image-upload" 
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <span class="text-6xl mb-4 group-hover:scale-110 transition-transform">🖼️</span>
          <p class="mb-2 text-lg font-medium text-base-content/70">点击或拖拽上传图片</p>
          <p class="text-sm text-base-content/50">支持 JPG, PNG, WEBP 等格式</p>
        </div>
        <input id="image-upload" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
      </label>
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- 提示语 -->
      <div class="alert alert-info shadow-sm py-4 px-6 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <h3 class="font-bold">图片九宫格切分</h3>
          <p class="text-xs opacity-70">上传一张图片，系统会自动将其均匀切分为 9 张图，方便在社交媒体发布。</p>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：预览/原图 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <span>🖼️</span> 原始图片
            </h3>
            <button @click="reset" class="btn btn-ghost btn-sm text-error">更换图片</button>
          </div>
          <div class="relative bg-base-300 rounded-3xl overflow-hidden border-4 border-base-200 aspect-square flex items-center justify-center shadow-inner">
            <img :src="originalImage" class="max-w-full max-h-full object-contain" />
          </div>
        </div>

        <!-- 右侧：结果/控制 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <span>✂️</span> 切分结果
            </h3>
            <div class="flex gap-2">
              <button 
                v-if="gridImages.length === 0"
                @click="sliceNineGrid" 
                class="btn btn-primary btn-sm gap-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
                立即切分
              </button>
              <button 
                v-else
                @click="downloadAllGrid" 
                class="btn btn-secondary btn-sm gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载全部
              </button>
            </div>
          </div>

          <div class="bg-base-200 rounded-3xl p-6 aspect-square border-4 border-base-100 shadow-inner">
            <div v-if="gridImages.length > 0" class="grid grid-cols-3 gap-3 h-full">
              <div 
                v-for="(img, index) in gridImages" 
                :key="index"
                class="relative group rounded-xl overflow-hidden border-2 border-white/20 shadow-md hover:scale-105 transition-transform duration-300"
              >
                <img :src="img" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click="downloadImage(img, `grid-${index+1}.png`)" class="btn btn-circle btn-sm btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-base-content/20 gap-4">
              <span class="text-7xl">🧩</span>
              <p class="font-medium">点击“立即切分”生成九宫格</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
