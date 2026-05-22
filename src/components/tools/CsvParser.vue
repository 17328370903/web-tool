<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast } from '@/utils/toast'

interface CsvData {
  id: string
  name: string
  headers: string[]
  rows: string[][]
}

const fileList = ref<CsvData[]>([])
const activeFileIndex = ref(0)
const isLoading = ref(false)

// 当前选中的文件数据
const currentFileData = computed(() => fileList.value[activeFileIndex.value] || null)

// 导出格式选项
type ExportFormat = 'objects' | 'values' | 'keyValue' | 'flat' | 'nestedArray'
const exportFormat = ref<ExportFormat>('objects')
const exportFormats = [
  { id: 'objects', label: '对象数组 [{}, {}]', desc: '每行作为一个对象，列名为键' },
  { id: 'nestedArray', label: '二维数组 [[], []]', desc: '每一行作为一个数组导出' },
  { id: 'values', label: '仅提取值 ["", ""]', desc: '提取最后一列的所有值生成数组 (最常用)' },
  { id: 'keyValue', label: '键值对象 {k: v}', desc: '第一列为键，第二列为值 (需至少2列)' },
  { id: 'flat', label: '全量平铺 [a, b, c]', desc: '提取所有单元格内容并扁平化' }
]

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [10, 20, 50, 100]

const totalPages = computed(() => {
  if (!currentFileData.value) return 0
  return Math.ceil(currentFileData.value.rows.length / pageSize.value)
})

const paginatedRows = computed(() => {
  if (!currentFileData.value) return []
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return currentFileData.value.rows.slice(start, end)
})

// 当切换文件、页码超出总页数或切换每页条数时，重置页码
watch([totalPages, pageSize, activeFileIndex], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  isLoading.value = true
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.name.endsWith('.csv')) {
      failCount++
      continue
    }

    try {
      const text = await readFileAsText(file)
      const parsed = parseCsv(text, file.name)
      if (parsed) {
        // 检查是否已存在同名文件，如果存在则替换，否则添加
        const existingIndex = fileList.value.findIndex(f => f.name === file.name)
        if (existingIndex !== -1) {
          fileList.value[existingIndex] = parsed
          activeFileIndex.value = existingIndex
        } else {
          fileList.value.push(parsed)
          activeFileIndex.value = fileList.value.length - 1
        }
        successCount++
      }
    } catch (err) {
      failCount++
      console.error(`解析文件 ${file.name} 失败:`, err)
    }
  }

  if (successCount > 0) {
    showToast(`成功解析 ${successCount} 个文件${failCount > 0 ? `，${failCount} 个失败` : ''}`)
    currentPage.value = 1
  } else if (failCount > 0) {
    showToast(`${failCount} 个文件解析失败`, 'error')
  }

  isLoading.value = false
  target.value = '' // 清空 input 允许再次上传同名文件
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}

const parseCsv = (text: string, name: string): CsvData | null => {
  const lines = text.split(/\r?\n/).filter(line => line.trim())
  if (lines.length === 0) return null

  const parseLine = (line: string) => {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map(line => parseLine(line))

  return {
    id: crypto.randomUUID(),
    name,
    headers,
    rows
  }
}

const removeFile = (index: number) => {
  fileList.value.splice(index, 1)
  if (activeFileIndex.value >= fileList.value.length) {
    activeFileIndex.value = Math.max(0, fileList.value.length - 1)
  }
  currentPage.value = 1
}

const clearAllFiles = () => {
  fileList.value = []
  activeFileIndex.value = 0
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const exportToJson = (file: CsvData) => {
  try {
    let jsonData: any

    if (exportFormat.value === 'nestedArray') {
      // 二维数组：每一行作为一个数组
      jsonData = file.rows
    } else if (exportFormat.value === 'values') {
      // 仅提取值：提取最后一列的所有数据
      const lastColIndex = file.headers.length - 1
      jsonData = file.rows.map(row => row[lastColIndex]).filter(val => val !== undefined && val !== '')
    } else if (exportFormat.value === 'flat') {
      // 全量平铺：提取所有行的数据并扁平化
      jsonData = file.rows.flat().filter(val => val !== '')
    } else if (exportFormat.value === 'keyValue') {
      // 键值对象：第一列为键，第二列为值
      if (file.headers.length < 2) {
        showToast('键值对象模式需要至少 2 列数据', 'error')
        return
      }
      const obj: Record<string, string> = {}
      file.rows.forEach(row => {
        if (row[0]) {
          obj[row[0]] = row[1] || ''
        }
      })
      jsonData = obj
    } else {
      // 默认：对象数组
      jsonData = file.rows.map(row => {
        const obj: Record<string, string> = {}
        file.headers.forEach((header, index) => {
          obj[header || `column_${index + 1}`] = row[index] || ''
        })
        return obj
      })
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${file.name.replace('.csv', '')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('JSON 导出成功')
  } catch (err) {
    showToast('导出失败', 'error')
    console.error(err)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 上传区域 -->
    <div class="flex flex-col items-center justify-center w-full">
      <label 
        for="csv-upload" 
        class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <span class="text-5xl mb-3 group-hover:scale-110 transition-transform">📂</span>
          <p class="mb-2 text-sm text-base-content/70">
            <span class="font-bold">点击上传</span> 或拖拽多个文件到这里
          </p>
          <p class="text-xs text-base-content/50">支持多个 .csv 文件同时解析</p>
        </div>
        <input id="csv-upload" type="file" class="hidden" accept=".csv" multiple @change="handleFileUpload" />
      </label>
    </div>

    <!-- 文件标签页切换 -->
    <div v-if="fileList.length > 0" class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="tabs tabs-boxed bg-base-200/50 p-1 gap-1 overflow-x-auto w-full md:w-auto md:max-w-[calc(100%-140px)] flex-nowrap">
          <div 
            v-for="(file, index) in fileList" 
            :key="file.id"
            class="tab tab-sm h-10 gap-2 px-4 rounded-lg transition-all no-animation whitespace-nowrap"
            :class="{ 'tab-active bg-primary text-primary-content shadow-sm': activeFileIndex === index }"
            @click="activeFileIndex = index"
          >
            <span class="max-w-[120px] sm:max-w-[200px] truncate">{{ file.name }}</span>
            <button 
              @click.stop="removeFile(index)" 
              class="btn btn-ghost btn-xs btn-circle hover:bg-black/10 text-current"
            >✕</button>
          </div>
        </div>
        <button @click="clearAllFiles" class="btn btn-ghost btn-sm text-error gap-2 self-end md:self-auto whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          清空全部
        </button>
      </div>

      <!-- 当前文件操作栏 -->
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-base-200 pb-6">
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-6">
          <!-- 每页显示 -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold opacity-50 uppercase tracking-wider">每页显示</span>
            <select v-model="pageSize" class="select select-bordered select-sm w-full md:w-[120px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }} 条</option>
            </select>
          </div>
          
          <!-- 导出配置 -->
          <div class="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:border-l md:border-base-300 md:pl-6">
            <div class="flex flex-col gap-2">
              <span class="text-xs font-bold opacity-50 uppercase tracking-wider">JSON 导出格式</span>
              <select v-model="exportFormat" class="select select-bordered select-sm w-full md:w-[180px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option v-for="fmt in exportFormats" :key="fmt.id" :value="fmt.id">{{ fmt.label }}</option>
              </select>
            </div>
            <button 
              v-if="currentFileData"
              @click="exportToJson(currentFileData)" 
              class="btn btn-primary btn-sm gap-2 shadow-md h-8 px-6"
              :title="exportFormats.find(f => f.id === exportFormat)?.desc"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 JSON
            </button>
          </div>
        </div>

        <!-- 当前文件名展示 -->
        <div class="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl xl:bg-transparent xl:p-0">
          <span class="text-3xl xl:text-2xl">📄</span>
          <div class="flex flex-col">
            <span class="text-xs opacity-50 xl:hidden">当前正在解析</span>
            <span class="font-bold text-primary truncate max-w-[200px] sm:max-w-md xl:max-w-xs">{{ currentFileData?.name }}</span>
          </div>
        </div>
      </div>

      <!-- 数据展示区域 -->
      <div v-if="isLoading" class="flex flex-col items-center py-12 gap-4">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-base-content/60">正在解析文件...</p>
      </div>

      <div v-else-if="currentFileData" class="flex flex-col gap-4">
        <div class="overflow-x-auto border border-base-300 rounded-2xl shadow-inner bg-base-100">
          <table class="table table-zebra table-pin-rows">
            <thead>
              <tr class="bg-base-200">
                <th v-for="(header, index) in currentFileData.headers" :key="index" class="text-base-content/80 font-bold py-4">
                  {{ header || `列 ${index + 1}` }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex" class="hover">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="max-w-xs truncate">
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="currentFileData.rows.length === 0" class="text-center py-12 text-base-content/40">
            文件为空或解析不到数据
          </div>
          
          <div class="p-4 bg-base-200/50 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-base-content/60">
            <span>共计 {{ currentFileData.rows.length }} 行数据</span>
            <span>当前显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, currentFileData.rows.length) }} 行</span>
          </div>
        </div>

        <!-- 分页控制 -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 py-2 overflow-x-auto">
          <div class="join shadow-sm">
            <button 
              class="join-item btn btn-sm btn-outline" 
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >«</button>
            
            <template v-for="page in totalPages" :key="page">
              <button 
                v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
                class="join-item btn btn-sm"
                :class="{ 'btn-active btn-primary': page === currentPage, 'btn-outline': page !== currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button 
                v-else-if="page === 2 && currentPage > 3"
                class="join-item btn btn-sm btn-disabled"
              >...</button>
              <button 
                v-else-if="page === totalPages - 1 && currentPage < totalPages - 2"
                class="join-item btn btn-sm btn-disabled"
              >...</button>
            </template>

            <button 
              class="join-item btn btn-sm btn-outline" 
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >»</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 初始提示 -->
    <div v-else-if="!isLoading" class="hero bg-base-200/30 rounded-2xl py-12 border border-dashed border-base-300">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <span class="text-5xl mb-4 block">📊</span>
          <h2 class="text-xl font-bold opacity-60">暂无数据</h2>
          <p class="py-4 opacity-50">请上传一个或多个 CSV 文件来查看其内容。所有的解析都在本地进行，您的数据非常安全。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-pin-rows thead tr th {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 隐藏横向滚动条但保持可滚动 */
.tabs {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}
.tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
