<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from '@/utils/toast'

const password = ref('')
const length = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='
  
  let characters = ''
  if (includeUppercase.value) characters += uppercase
  if (includeLowercase.value) characters += lowercase
  if (includeNumbers.value) characters += numbers
  if (includeSymbols.value) characters += symbols
  
  if (characters.length === 0) {
    password.value = ''
    return
  }
  
  let result = ''
  const array = new Uint32Array(length.value)
  window.crypto.getRandomValues(array)
  
  for (let i = 0; i < length.value; i++) {
    result += characters.charAt(array[i] % characters.length)
  }
  
  password.value = result
}

const copyPassword = async () => {
  if (password.value) {
    try {
      await navigator.clipboard.writeText(password.value)
      showToast('密码已复制到剪贴板')
    } catch (err) {
      showToast('复制失败', 'error')
      console.error('Failed to copy: ', err)
    }
  }
}

onMounted(() => {
  generatePassword()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 结果显示区域 -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-semibold text-lg flex items-center gap-2">
          <span class="text-2xl">🔑</span>
          生成的密码
        </span>
      </label>
      <div class="flex flex-col sm:flex-row gap-3">
        <div 
          class="flex-1 bg-gradient-to-br from-base-200 to-base-300 p-6 rounded-2xl font-mono text-2xl border-2 border-primary/20 shadow-inner break-all flex items-center justify-center min-h-[120px] text-center"
        >
          {{ password || '请选择选项生成密码' }}
        </div>
        <div class="flex sm:flex-col gap-3">
          <button 
            @click="generatePassword" 
            class="flex-1 sm:flex-none btn btn-primary btn-lg px-6 hover:scale-105 transition-transform shadow-lg"
            title="重新生成"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="sm:hidden ml-2">重新生成</span>
          </button>
          <button 
            v-if="password" 
            @click="copyPassword" 
            class="flex-1 sm:flex-none btn btn-success btn-lg px-6 hover:scale-105 transition-transform shadow-lg"
            title="复制密码"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="sm:hidden ml-2">复制密码</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 配置区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-200/50 p-8 rounded-3xl border border-base-300 shadow-sm">
      <div class="space-y-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold text-lg">密码长度: <span class="text-primary">{{ length }}</span></span>
          </label>
          <input 
            v-model.number="length" 
            type="range" 
            min="4" 
            max="64" 
            class="range range-primary range-lg" 
            step="1" 
            @input="generatePassword"
          />
          <div class="w-full flex justify-between text-xs px-2 mt-2 font-mono opacity-60">
            <span>4</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <label class="label py-0">
          <span class="label-text font-bold text-lg">包含字符</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors cursor-pointer group">
            <input type="checkbox" v-model="includeUppercase" class="checkbox checkbox-primary" @change="generatePassword" />
            <span class="label-text font-medium group-hover:text-primary transition-colors">大写字母 (A-Z)</span>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors cursor-pointer group">
            <input type="checkbox" v-model="includeLowercase" class="checkbox checkbox-primary" @change="generatePassword" />
            <span class="label-text font-medium group-hover:text-primary transition-colors">小写字母 (a-z)</span>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors cursor-pointer group">
            <input type="checkbox" v-model="includeNumbers" class="checkbox checkbox-primary" @change="generatePassword" />
            <span class="label-text font-medium group-hover:text-primary transition-colors">数字 (0-9)</span>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors cursor-pointer group">
            <input type="checkbox" v-model="includeSymbols" class="checkbox checkbox-primary" @change="generatePassword" />
            <span class="label-text font-medium group-hover:text-primary transition-colors">特殊符号</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
