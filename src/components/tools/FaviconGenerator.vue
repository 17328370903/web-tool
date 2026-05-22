<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from '@/utils/toast'

const originalImage = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const isLoading = ref(false)

const sizes = [
  { label: '16x16', value: 16 },
  { label: '32x32', value: 32 },
  { label: '48x48', value: 48 },
  { label: '64x64', value: 64 },
  { label: '128x128', value: 128 },
]

const selectedSize = ref(32)

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
    generatePreview()
  }
  reader.readAsDataURL(file)
}

const generatePreview = () => {
  if (!originalImage.value) return
  
  const img = new Image()
  img.src = originalImage.value
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = selectedSize.value
    canvas.height = selectedSize.value

    // 居中裁剪并缩放
    const size = Math.min(img.width, img.height)
    const x = (img.width - size) / 2
    const y = (img.height - size) / 2

    ctx.drawImage(img, x, y, size, size, 0, 0, selectedSize.value, selectedSize.value)
    previewUrl.value = canvas.toDataURL('image/png')
  }
}

const downloadFavicon = () => {
  if (!previewUrl.value) return
  
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = `favicon-${selectedSize.value}x${selectedSize.value}.png`
  link.click()
  showToast('Favicon 已导出')
}

const reset = () => {
  originalImage.value = null
  previewUrl.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- 上传区域 -->
    <div v-if="!originalImage" class="flex flex-col items-center justify-center w-full">
      <label 
        for="favicon-upload" 
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <span class="text-6xl mb-4 group-hover:scale-110 transition-transform">🎯</span>
          <p class="mb-2 text-lg font-medium text-base-content/70">上传图片制作 Favicon</p>
          <p class="text-sm text-base-content/50">推荐使用正方形图片，支持 PNG, JPG, WEBP</p>
        </div>
        <input id="favicon-upload" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
      </label>
    </div>

    <div v-else class="flex flex-col gap-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：设置 -->
        <div class="space-y-6">
          <div class="card bg-base-100 border border-base-300 shadow-sm">
            <div class="card-body p-6">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚙️</span> 导出设置
              </h3>
              
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">选择尺寸 (px)</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="size in sizes" 
                    :key="size.value"
                    @click="selectedSize = size.value; generatePreview()"
                    class="btn btn-sm"
                    :class="selectedSize === size.value ? 'btn-primary' : 'btn-outline'"
                  >
                    {{ size.label }}
                  </button>
                </div>
              </div>

              <div class="divider"></div>

              <div class="flex flex-col gap-3">
                <button @click="downloadFavicon" class="btn btn-primary w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  导出 PNG 图标
                </button>
                <button @click="reset" class="btn btn-ghost btn-sm w-full text-error">更换图片</button>
              </div>
            </div>
          </div>

          <div class="alert alert-info shadow-sm rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div class="text-xs">
              提示：现代浏览器推荐使用 32x32 的 PNG 作为 Favicon。
            </div>
          </div>
        </div>

        <!-- 右侧：预览 -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <span>👀</span> 实时预览
            </h3>
            
            <div class="flex flex-col items-center gap-8 py-4">
              <!-- 浏览器标签页模拟 -->
              <div class="w-full max-w-xs bg-base-200 rounded-t-lg p-2 border-x border-t border-base-300">
                <div class="flex items-center gap-2 bg-base-100 rounded px-3 py-1.5 shadow-sm w-40">
                  <img v-if="previewUrl" :src="previewUrl" class="w-4 h-4" />
                  <div v-else class="w-4 h-4 bg-base-300 rounded-full animate-pulse"></div>
                  <span class="text-[10px] truncate opacity-60">我的新网站</span>
                </div>
              </div>

              <!-- 放大预览 -->
              <div class="flex flex-col items-center gap-4">
                <div class="p-8 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
                  <img 
                    v-if="previewUrl" 
                    :src="previewUrl" 
                    class="shadow-xl bg-white" 
                    :style="{ width: '64px', height: '64px', imageRendering: 'pixelated' }" 
                  />
                  <div v-else class="w-16 h-16 bg-base-300 rounded-xl animate-pulse"></div>
                </div>
                <p class="text-xs opacity-50">放大 2 倍预览 ({{ selectedSize }}x{{ selectedSize }})</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
