<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from '@/utils/toast'

// 当前时间
const now = ref(new Date())
let timer: number | null = null

// 转换状态
const timestampInput = ref(Math.floor(Date.now() / 1000).toString())
const dateInput = ref('')
const convertedDate = ref('')
const convertedTimestamp = ref('')

// 更新当前时间
const updateNow = () => {
  now.value = new Date()
}

// 时间戳转日期
const convertToDate = () => {
  try {
    const ts = parseInt(timestampInput.value)
    if (isNaN(ts)) throw new Error('无效的时间戳')
    
    // 自动判断秒还是毫秒
    const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000)
    convertedDate.value = formatDate(date)
  } catch (err) {
    showToast('时间戳格式错误', 'error')
  }
}

// 日期转时间戳
const convertToTimestamp = () => {
  try {
    const date = new Date(dateInput.value)
    if (isNaN(date.getTime())) throw new Error('无效的日期格式')
    convertedTimestamp.value = Math.floor(date.getTime() / 1000).toString()
  } catch (err) {
    showToast('日期格式错误', 'error')
  }
}

// 格式化日期
const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  showToast('已复制到剪贴板')
}

// 快捷操作：当前时间戳
const setNowTimestamp = () => {
  timestampInput.value = Math.floor(Date.now() / 1000).toString()
  convertToDate()
}

// 快捷操作：当前日期
const setNowDate = () => {
  dateInput.value = formatDate(new Date())
  convertToTimestamp()
}

onMounted(() => {
  timer = window.setInterval(updateNow, 1000)
  dateInput.value = formatDate(new Date())
  convertToDate()
  convertToTimestamp()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="space-y-8">
    <!-- 当前时间显示 -->
    <div class="stats shadow bg-base-200 w-full">
      <div class="stat place-items-center">
        <div class="stat-title">当前本地时间 (Local)</div>
        <div class="stat-value text-primary font-mono">{{ formatDate(now) }}</div>
        <div class="stat-desc mt-2">北京时间 (GMT+8)</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">当前时间戳 (Seconds)</div>
        <div class="stat-value text-secondary font-mono">{{ Math.floor(now.getTime() / 1000) }}</div>
        <div class="stat-actions">
          <button class="btn btn-ghost btn-xs" @click="copyToClipboard(Math.floor(now.getTime() / 1000).toString())">复制</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 时间戳 -> 日期 -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-primary mb-4">
            <span class="text-2xl">🕒</span> 时间戳转日期
          </h2>
          <div class="form-control gap-6">
            <div class="flex flex-col gap-2">
              <span class="text-xs font-bold opacity-50 uppercase tracking-wider">时间戳输入</span>
              <div class="join w-full shadow-sm">
                <input 
                  type="text" 
                  v-model="timestampInput" 
                  placeholder="输入时间戳 (秒或毫秒)" 
                  class="input input-bordered join-item w-full focus:outline-none"
                  @keyup.enter="convertToDate"
                />
                <button class="btn btn-primary join-item px-6" @click="convertToDate">转换</button>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-xs" @click="setNowTimestamp">当前时间戳</button>
            </div>
            
            <div class="mt-4 p-4 bg-base-200 rounded-xl relative group">
              <div class="text-xs opacity-50 mb-1">转换结果 (YYYY-MM-DD HH:mm:ss)</div>
              <div class="text-xl font-mono break-all min-h-[1.75rem]">
                {{ convertedDate || '等待转换...' }}
              </div>
              <button 
                v-if="convertedDate"
                @click="copyToClipboard(convertedDate)"
                class="absolute right-2 top-2 btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >复制</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 日期 -> 时间戳 -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-secondary mb-4">
            <span class="text-2xl">📅</span> 日期转时间戳
          </h2>
          <div class="form-control gap-6">
            <div class="flex flex-col gap-2">
              <span class="text-xs font-bold opacity-50 uppercase tracking-wider">日期时间输入</span>
              <div class="join w-full shadow-sm">
                <input 
                  type="text" 
                  v-model="dateInput" 
                  placeholder="YYYY-MM-DD HH:mm:ss" 
                  class="input input-bordered join-item w-full focus:outline-none"
                  @keyup.enter="convertToTimestamp"
                />
                <button class="btn btn-secondary join-item px-6" @click="convertToTimestamp">转换</button>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-xs" @click="setNowDate">当前时间</button>
            </div>

            <div class="mt-4 p-4 bg-base-200 rounded-xl relative group">
              <div class="text-xs opacity-50 mb-1">转换结果 (Unix Timestamp)</div>
              <div class="text-xl font-mono break-all min-h-[1.75rem]">
                {{ convertedTimestamp || '等待转换...' }}
              </div>
              <button 
                v-if="convertedTimestamp"
                @click="copyToClipboard(convertedTimestamp)"
                class="absolute right-2 top-2 btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >复制</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用参考 -->
    <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
      <div class="card-body p-0">
        <div class="bg-base-200 px-6 py-3 border-b border-base-300">
          <h3 class="font-bold opacity-70">常用单位参考</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>单位</th>
                <th>时间戳 (秒)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 分钟</td>
                <td class="font-mono">60</td>
              </tr>
              <tr>
                <td>1 小时</td>
                <td class="font-mono">3,600</td>
              </tr>
              <tr>
                <td>1 天</td>
                <td class="font-mono">86,400</td>
              </tr>
              <tr>
                <td>1 周</td>
                <td class="font-mono">604,800</td>
              </tr>
              <tr>
                <td>1 月 (30天)</td>
                <td class="font-mono">2,592,000</td>
              </tr>
              <tr>
                <td>1 年 (365天)</td>
                <td class="font-mono">31,536,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
