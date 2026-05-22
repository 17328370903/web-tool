<script setup lang="ts">
import { ref, watch } from 'vue'

const inputColor = ref('#3b82f6')
const hex = ref('#3b82f6')
const rgb = ref('rgb(59, 130, 246)')
const hsl = ref('hsl(217, 91%, 60%)')
const error = ref('')

// 将 HEX 转换为 RGB
const hexToRgb = (hexStr: string) => {
  const r = parseInt(hexStr.slice(1, 3), 16)
  const g = parseInt(hexStr.slice(3, 5), 16)
  const b = parseInt(hexStr.slice(5, 7), 16)
  return { r, g, b }
}

// 将 RGB 转换为 HEX
const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 将 RGB 转换为 HSL
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// 将 HSL 转换为 RGB
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  }
}

// 自动识别并更新颜色
const handleInput = () => {
  error.value = ''
  const val = inputColor.value.trim().toLowerCase()

  // 1. 识别 HEX
  const hexMatch = val.match(/^#?([0-9a-f]{6})$|^#?([0-9a-f]{3})$/)
  if (hexMatch) {
    let hexVal = hexMatch[1] || hexMatch[2]
    if (hexVal.length === 3) {
      hexVal = hexVal.split('').map(c => c + c).join('')
    }
    hex.value = '#' + hexVal
    const { r, g, b } = hexToRgb(hex.value)
    rgb.value = `rgb(${r}, ${g}, ${b})`
    const { h, s, l } = rgbToHsl(r, g, b)
    hsl.value = `hsl(${h}, ${s}%, ${l}%)`
    return
  }

  // 2. 识别 RGB
  const rgbMatch = val.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  if (rgbMatch) {
    const r = Math.min(255, parseInt(rgbMatch[1]))
    const g = Math.min(255, parseInt(rgbMatch[2]))
    const b = Math.min(255, parseInt(rgbMatch[3]))
    rgb.value = `rgb(${r}, ${g}, ${b})`
    hex.value = rgbToHex(r, g, b)
    const { h, s, l } = rgbToHsl(r, g, b)
    hsl.value = `hsl(${h}, ${s}%, ${l}%)`
    return
  }

  // 3. 识别 HSL
  const hslMatch = val.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/)
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) % 360
    const s = Math.min(100, parseInt(hslMatch[2]))
    const l = Math.min(100, parseInt(hslMatch[3]))
    hsl.value = `hsl(${h}, ${s}%, ${l}%)`
    const { r, g, b } = hslToRgb(h, s, l)
    rgb.value = `rgb(${r}, ${g}, ${b})`
    hex.value = rgbToHex(r, g, b)
    return
  }

  error.value = '无法识别颜色格式，请尝试 #RRGGBB, rgb(r,g,b) 或 hsl(h,s,l)'
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

// 监听原生颜色选择器的变化
watch(hex, (newHex) => {
  if (inputColor.value !== newHex) {
    inputColor.value = newHex
    handleInput()
  }
})

// 初始更新
handleInput()
</script>

<template>
  <div class="space-y-8">
    <!-- 颜色预览与选择 -->
    <div class="flex flex-col md:flex-row gap-8 items-center">
      <div 
        class="w-48 h-48 rounded-3xl shadow-2xl border-4 border-base-100 transition-colors duration-300 relative group overflow-hidden"
        :style="{ backgroundColor: hex }"
      >
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span class="text-white font-bold text-xs uppercase tracking-tighter">Preview</span>
        </div>
      </div>
      
      <div class="flex-1 space-y-4 w-full">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-lg flex items-center gap-2">
              <span class="text-2xl">🎨</span>
              输入颜色
            </span>
            <span class="label-text-alt text-base-content/60">支持 HEX, RGB, HSL</span>
          </label>
          <div class="flex gap-4 items-center">
            <div class="relative">
              <input 
                type="color" 
                v-model="hex" 
                class="w-16 h-16 rounded-2xl cursor-pointer bg-base-200 p-1 border-2 border-base-300 hover:border-primary/50 transition-colors"
              />
            </div>
            <input 
              type="text" 
              v-model="inputColor" 
              @input="handleInput"
              class="input input-bordered flex-1 font-mono text-xl h-16 focus:ring-4 focus:ring-primary/20 rounded-2xl bg-base-200/50 border-base-300 hover:border-primary/50 transition-all shadow-inner px-6"
              placeholder="例如: #3b82f6, rgb(59, 130, 246)..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 转换结果 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- HEX -->
      <div class="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-lg transition-all group">
        <div class="card-body p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xs font-black opacity-40 uppercase tracking-[0.2em]">HEX</h3>
            <div class="badge badge-primary badge-outline badge-sm opacity-0 group-hover:opacity-100 transition-opacity">CSS</div>
          </div>
          <div class="flex justify-between items-center">
            <code class="text-xl font-bold font-mono tracking-tight">{{ hex }}</code>
            <button @click="copyToClipboard(hex)" class="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- RGB -->
      <div class="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-lg transition-all group">
        <div class="card-body p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xs font-black opacity-40 uppercase tracking-[0.2em]">RGB</h3>
            <div class="badge badge-secondary badge-outline badge-sm opacity-0 group-hover:opacity-100 transition-opacity">Design</div>
          </div>
          <div class="flex justify-between items-center">
            <code class="text-xl font-bold font-mono tracking-tight">{{ rgb }}</code>
            <button @click="copyToClipboard(rgb)" class="btn btn-ghost btn-sm btn-square hover:bg-secondary/10 hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- HSL -->
      <div class="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-lg transition-all group">
        <div class="card-body p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xs font-black opacity-40 uppercase tracking-[0.2em]">HSL</h3>
            <div class="badge badge-accent badge-outline badge-sm opacity-0 group-hover:opacity-100 transition-opacity">Web</div>
          </div>
          <div class="flex justify-between items-center">
            <code class="text-xl font-bold font-mono tracking-tight">{{ hsl }}</code>
            <button @click="copyToClipboard(hsl)" class="btn btn-ghost btn-sm btn-square hover:bg-accent/10 hover:text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error shadow-lg animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
</template>
