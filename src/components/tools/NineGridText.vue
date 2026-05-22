<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { showToast } from '@/utils/toast'

const textInput = ref('')
const gridImages = ref<string[]>([])
const isLoading = ref(false)

const settings = reactive({
  bgColor: '#ffffff',
  textColor: '#000000',
  borderColor: '#e5e7eb',
  borderWidth: 2,
  borderRadius: 20,
  fontSize: 280,
  fontWeight: 'bold',
  fontFamily: 'system-ui',
  customFont: '', // 自定义字体名称
  gridSize: 500,
  yOffset: 0,
})

const currentFontFamily = computed(() => {
  if (settings.fontFamily === 'custom' && settings.customFont) {
    return settings.customFont
  }
  return settings.fontFamily
})

const generateGrid = () => {
  if (!textInput.value.trim()) {
    gridImages.value = []
    return
  }

  isLoading.value = true
  const chars = textInput.value.trim().split('').slice(0, 9)
  const results: string[] = []

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = settings.gridSize
  canvas.height = settings.gridSize

  chars.forEach((char) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制背景
    ctx.fillStyle = settings.bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制圆角边框
    if (settings.borderWidth > 0) {
      ctx.strokeStyle = settings.borderColor
      ctx.lineWidth = settings.borderWidth
      const r = settings.borderRadius
      const w = canvas.width - settings.borderWidth
      const h = canvas.height - settings.borderWidth
      const x = settings.borderWidth / 2
      const y = settings.borderWidth / 2

      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.stroke()
    }

    // 绘制文字
    ctx.fillStyle = settings.textColor
    ctx.font = `${settings.fontWeight} ${settings.fontSize}px ${currentFontFamily.value}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 使用 measureText 进行更精确的垂直居中计算
    const metrics = ctx.measureText(char)
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    // 计算视觉中心偏移：(上升高度 - 下降高度) / 2
    // 这样可以将字符的几何中心对齐到画布中心
    const visualCenterOffset = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    
    ctx.fillText(
      char, 
      canvas.width / 2, 
      canvas.height / 2 + visualCenterOffset + settings.yOffset
    )

    results.push(canvas.toDataURL('image/png'))
  })

  gridImages.value = results
  isLoading.value = false
}

// 监听所有设置变化自动更新
watch(() => [
  textInput.value, 
  settings.bgColor, 
  settings.textColor, 
  settings.borderColor, 
  settings.borderWidth, 
  settings.borderRadius, 
  settings.fontSize,
  settings.fontWeight,
  settings.fontFamily,
  settings.customFont,
  settings.yOffset
], () => {
  generateGrid()
}, { deep: true })

const downloadImage = (url: string, index: number) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `text-grid-${index + 1}.png`
  link.click()
}

const downloadAll = () => {
  if (gridImages.value.length === 0) return
  gridImages.value.forEach((url, index) => {
    setTimeout(() => {
      downloadImage(url, index)
    }, index * 200)
  })
  showToast('正在批量导出...')
}

onMounted(() => {
  textInput.value = '九宫格文字'
})
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧：设置面板 -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <span>✍️</span> 文字内容
            </h3>
            <div class="form-control">
              <input 
                v-model="textInput" 
                type="text" 
                maxlength="9"
                placeholder="最多输入 9 个汉字..." 
                class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <label class="label">
                <span class="label-text-alt opacity-50">每个汉字将生成一张独立图片</span>
              </label>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🎨</span> 样式自定义
            </h3>
            
            <div class="space-y-4">
              <!-- 颜色选择 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">背景颜色</span></label>
                  <input type="color" v-model="settings.bgColor" class="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">文字颜色</span></label>
                  <input type="color" v-model="settings.textColor" class="w-full h-10 rounded-lg cursor-pointer" />
                </div>
              </div>

              <!-- 边框颜色 -->
              <div class="form-control">
                <label class="label"><span class="label-text">边框颜色</span></label>
                <input type="color" v-model="settings.borderColor" class="w-full h-10 rounded-lg cursor-pointer" />
              </div>

              <!-- 边框样式 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">边框宽度: {{ settings.borderWidth }}px</span></label>
                  <input type="range" min="0" max="20" v-model.number="settings.borderWidth" class="range range-primary range-xs" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">圆角大小: {{ settings.borderRadius }}px</span></label>
                  <input type="range" min="0" max="250" v-model.number="settings.borderRadius" class="range range-secondary range-xs" />
                </div>
              </div>

              <!-- 字体大小与偏移 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">文字大小: {{ settings.fontSize }}px</span></label>
                  <input type="range" min="50" max="450" v-model.number="settings.fontSize" class="range range-accent range-xs" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">上下偏移: {{ settings.yOffset }}px</span></label>
                  <input type="range" min="-100" max="100" v-model.number="settings.yOffset" class="range range-info range-xs" />
                </div>
              </div>

              <!-- 字体粗细与字体族 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">字体粗细</span></label>
                  <select v-model="settings.fontWeight" class="select select-bordered select-sm">
                    <option value="normal">正常</option>
                    <option value="bold">加粗</option>
                    <option value="900">超粗</option>
                  </select>
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">字体系列</span></label>
                  <select v-model="settings.fontFamily" class="select select-bordered select-sm">
                    <option value="system-ui">系统默认</option>
                    <option value="'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif">现代黑体</option>
                    <option value="'Noto Serif SC', 'SimSun', serif">雅致宋体</option>
                    <option value="'KaiTi', serif">经典楷体</option>
                    <option value="'FangSong', serif">清秀仿宋</option>
                    <option value="serif">标准衬线</option>
                    <option value="monospace">等宽字体</option>
                    <option value="custom">✨ 自定义字体</option>
                  </select>
                </div>
              </div>

              <!-- 自定义字体输入 -->
              <div v-if="settings.fontFamily === 'custom'" class="form-control animate-in fade-in slide-in-from-top-2 duration-300">
                <label class="label">
                  <span class="label-text">输入字体名称 (需系统中已安装)</span>
                </label>
                <input 
                  v-model="settings.customFont" 
                  type="text" 
                  placeholder="例如: 'Source Han Sans SC' 或 'STHeiti'" 
                  class="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <div class="divider"></div>

            <button 
              @click="downloadAll" 
              class="btn btn-primary w-full gap-2"
              :disabled="gridImages.length === 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载全部九宫格
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：预览区 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-6">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span>📱</span> 九宫格预览
            </h3>
            
            <div class="bg-base-200 rounded-3xl p-4 sm:p-8 aspect-square w-full max-w-2xl mx-auto shadow-inner border border-base-300">
              <div class="grid grid-cols-3 gap-2 sm:gap-4 h-full">
                <div 
                  v-for="(img, index) in gridImages" 
                  :key="index"
                  class="relative group rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 bg-white"
                >
                  <img :src="img" class="w-full h-full object-contain" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button @click="downloadImage(img, index)" class="btn btn-circle btn-xs btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- 空占位符 -->
                <div 
                  v-for="i in Math.max(0, 9 - gridImages.length)" 
                  :key="'empty-' + i"
                  class="bg-base-300/30 rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center text-base-content/10"
                >
                  <span class="text-2xl font-bold">{{ gridImages.length + i }}</span>
                </div>
              </div>
            </div>
            <p class="text-center text-xs opacity-40 mt-6 italic">
              提示：九宫格发布顺序为从左到右、从上到下
            </p>
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
