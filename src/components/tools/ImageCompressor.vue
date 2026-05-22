<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { showToast } from '@/utils/toast'

interface ImageStats {
  name: string
  originalSize: number
  compressedSize: number
  originalWidth: number
  originalHeight: number
  compressedWidth: number
  compressedHeight: number
  type: string
}

const originalImage = ref<string | null>(null)
const compressedImage = ref<string | null>(null)
const isLoading = ref(false)

const settings = reactive({
  quality: 0.8,
  maxWidth: 1920,
  format: 'image/jpeg'
})

const stats = ref<ImageStats | null>(null)

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
    const dataUrl = e.target?.result as string
    originalImage.value = dataUrl
    
    // 获取图片原始尺寸
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      stats.value = {
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
        originalWidth: img.width,
        originalHeight: img.height,
        compressedWidth: 0,
        compressedHeight: 0,
        type: file.type
      }
      settings.maxWidth = img.width
      compressImage()
    }
  }
  reader.readAsDataURL(file)
}

const compressImage = () => {
  if (!originalImage.value || !stats.value) return
  
  isLoading.value = true
  const img = new Image()
  img.src = originalImage.value
  
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 计算缩放比例
    let width = img.width
    let height = img.height
    if (width > settings.maxWidth) {
      const ratio = settings.maxWidth / width
      width = settings.maxWidth
      height = height * ratio
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    // 执行压缩
    const compressedDataUrl = canvas.toDataURL(settings.format, settings.quality)
    compressedImage.value = compressedDataUrl

    // 计算压缩后的大小 (Base64 估算)
    const head = 'data:' + settings.format + ';base64,'
    const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4)

    if (stats.value) {
      stats.value.compressedSize = size
      stats.value.compressedWidth = Math.round(width)
      stats.value.compressedHeight = Math.round(height)
    }
    
    isLoading.value = false
  }
}

// 监听设置变化自动压缩
watch(() => [settings.quality, settings.maxWidth, settings.format], () => {
  if (originalImage.value) {
    compressImage()
  }
})

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadImage = () => {
  if (!compressedImage.value || !stats.value) return
  const link = document.createElement('a')
  const extension = settings.format.split('/')[1]
  link.href = compressedImage.value
  link.download = `compressed_${stats.value.name.split('.')[0]}.${extension}`
  link.click()
  showToast('下载成功')
}

const reset = () => {
  originalImage.value = null
  compressedImage.value = null
  stats.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- 上传区域 -->
    <div v-if="!originalImage" class="flex flex-col items-center justify-center w-full">
      <label 
        for="image-compress-upload" 
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <span class="text-6xl mb-4 group-hover:scale-110 transition-transform">📉</span>
          <p class="mb-2 text-lg font-medium text-base-content/70">上传需要压缩的图片</p>
          <p class="text-sm text-base-content/50">支持 JPG, PNG, WEBP</p>
        </div>
        <input id="image-compress-upload" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
      </label>
    </div>

    <div v-else class="flex flex-col gap-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 控制面板 -->
        <div class="flex flex-col gap-6 lg:col-span-1">
          <div class="card bg-base-100 border border-base-300 shadow-sm">
            <div class="card-body p-6">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚙️</span> 压缩设置
              </h3>
              
              <div class="space-y-6">
                <!-- 质量 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">压缩质量: {{ Math.round(settings.quality * 100) }}%</span>
                  </label>
                  <input type="range" min="0.1" max="1" step="0.05" v-model.number="settings.quality" class="range range-primary range-sm" />
                  <div class="w-full flex justify-between text-xs px-2 mt-1 opacity-50">
                    <span>更小</span>
                    <span>更好</span>
                  </div>
                </div>

                <!-- 尺寸 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">最大宽度: {{ settings.maxWidth }}px</span>
                  </label>
                  <input type="range" min="100" :max="stats?.originalWidth" step="50" v-model.number="settings.maxWidth" class="range range-secondary range-sm" />
                </div>

                <!-- 格式 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">导出格式</span>
                  </label>
                  <select v-model="settings.format" class="select select-bordered select-sm w-full">
                    <option value="image/jpeg">JPEG (体积小)</option>
                    <option value="image/png">PNG (无损/支持透明)</option>
                    <option value="image/webp">WEBP (高压缩率)</option>
                  </select>
                </div>

                <div class="divider"></div>

                <button @click="downloadImage" class="btn btn-primary w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载压缩后的图片
                </button>
                <button @click="reset" class="btn btn-ghost btn-sm w-full text-error">更换图片</button>
              </div>
            </div>
          </div>

          <!-- 数据对比 -->
          <div v-if="stats" class="card bg-base-200 border border-base-300 shadow-sm">
            <div class="card-body p-4">
              <h4 class="font-bold text-sm opacity-60 mb-2 uppercase tracking-wider">压缩详情</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-end">
                  <span class="text-sm">原始大小:</span>
                  <span class="font-mono">{{ formatSize(stats.originalSize) }}</span>
                </div>
                <div class="flex justify-between items-end">
                  <span class="text-sm">压缩后大小:</span>
                  <span class="font-mono text-success font-bold">{{ formatSize(stats.compressedSize) }}</span>
                </div>
                <div class="flex justify-between items-end">
                  <span class="text-sm">压缩率:</span>
                  <span class="badge badge-success">{{ Math.round((1 - stats.compressedSize / stats.originalSize) * 100) }}%</span>
                </div>
                <div class="divider my-1"></div>
                <div class="flex justify-between items-end">
                  <span class="text-sm">原始尺寸:</span>
                  <span class="text-xs opacity-60">{{ stats.originalWidth }} x {{ stats.originalHeight }}</span>
                </div>
                <div class="flex justify-between items-end">
                  <span class="text-sm">压缩尺寸:</span>
                  <span class="text-xs opacity-60">{{ stats.compressedWidth }} x {{ stats.compressedHeight }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览区 -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex flex-col gap-4">
            <h3 class="font-bold text-lg">压缩效果预览</h3>
            <div class="relative bg-base-300 rounded-3xl overflow-hidden border-4 border-base-200 aspect-video flex items-center justify-center shadow-inner">
              <div v-if="isLoading" class="absolute inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <span class="loading loading-spinner loading-lg text-white"></span>
              </div>
              <img v-if="compressedImage" :src="compressedImage" class="max-w-full max-h-full object-contain shadow-2xl" />
            </div>
            <div class="text-center text-xs opacity-40 italic">
              提示：调整左侧参数可实时看到预览效果
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.range {
  height: 1.25rem;
}
</style>
