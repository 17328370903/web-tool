# 🚀 快速启动指南

## 第一步：安装依赖

打开终端，在项目根目录运行：

```bash
npm install
```

这会安装所有必要的依赖，包括：
- Vue 3
- Vue Router 4
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI

## 第二步：启动开发服务器

```bash
npm run dev
```

启动成功后，你会看到类似这样的输出：

```
VITE v8.0.12  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 第三步：访问应用

在浏览器中打开：**http://localhost:5173/**

你应该能看到：
- 🎨 漂亮的首页
- 📱 响应式布局
- 🔧 工具分类卡片
- 📋 侧边栏导航

## 第四步：体验功能

### 1. 浏览首页
- 查看工具分类
- 点击任意工具卡片

### 2. 测试 JSON 格式化工具
1. 点击 "文本工具" → "JSON 格式化"
2. 在输入框粘贴 JSON 数据，例如：
   ```json
   {"name":"test","value":123,"items":[1,2,3]}
   ```
3. 点击 "格式化" 按钮
4. 查看美化后的输出
5. 尝试 "压缩" 和 "清空" 功能

### 3. 测试导航
- 点击顶部 Logo 返回首页
- 使用侧边栏切换工具
- 点击菜单按钮折叠/展开侧边栏

## 第五步：开始开发

### 添加你的第一个工具

#### 1. 创建 Base64 编解码工具

创建文件 `src/components/tools/Base64Encoder.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
const output = ref('')

const encode = () => {
  try {
    output.value = btoa(input.value)
  } catch (e) {
    output.value = '编码失败'
  }
}

const decode = () => {
  try {
    output.value = atob(input.value)
  } catch (e) {
    output.value = '解码失败'
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">输入文本</span>
      </label>
      <textarea 
        v-model="input"
        class="textarea textarea-bordered h-32" 
        placeholder="输入要编码或解码的内容..."
      ></textarea>
    </div>

    <div class="flex gap-2">
      <button @click="encode" class="btn btn-primary">Base64 编码</button>
      <button @click="decode" class="btn btn-secondary">Base64 解码</button>
      <button @click="clear" class="btn btn-ghost">清空</button>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">结果</span>
      </label>
      <div class="bg-base-200 p-4 rounded-lg min-h-[100px] whitespace-pre-wrap">
        {{ output || '结果将显示在这里...' }}
      </div>
    </div>
  </div>
</template>
```

#### 2. 注册工具组件

编辑 `src/views/ToolView.vue`，在 componentMap 中添加：

```typescript
const componentMap: Record<string, any> = {
  'json-format': defineAsyncComponent(() => import('@/components/tools/JsonFormatter.vue')),
  'base64-encode': defineAsyncComponent(() => import('@/components/tools/Base64Encoder.vue')), // 新增
}
```

#### 3. 刷新页面

访问 http://localhost:5173/tools/text/base64-encode

恭喜！你已经成功添加了第一个工具！🎉

## 常见问题

### Q: 端口被占用怎么办？
A: Vite 会自动尝试下一个可用端口，或者指定端口：
```bash
npm run dev -- --port 3000
```

### Q: 如何修改主题颜色？
A: 编辑 `src/style.css`，添加 DaisyUI 主题配置。

### Q: 如何添加新的工具分类？
A: 编辑 `src/data/tools.ts`，在 `toolCategories` 数组中添加新分类。

### Q: 类型错误怎么办？
A: 确保 TypeScript 类型定义正确，可以参考现有代码。

### Q: 样式不生效？
A: 检查是否使用了正确的 Tailwind CSS 类名，参考 [Tailwind 文档](https://tailwindcss.com/)。

## 开发技巧

### 1. 使用 Vue DevTools
安装 [Vue DevTools](https://devtools.vuejs.org/) 浏览器扩展，方便调试。

### 2. 热重载
Vite 支持热模块替换（HMR），修改代码后会自动刷新，无需手动刷新页面。

### 3. TypeScript 提示
使用 VS Code + Volar 插件，获得完整的 TypeScript 智能提示。

### 4. 组件复用
参考 `JsonFormatter.vue` 的设计模式：
- 使用 `ref` 管理状态
- 清晰的函数命名
- 完善的错误处理
- 友好的用户反馈

### 5. 响应式设计
使用 Tailwind 的响应式前缀：
- `sm:` - 小屏幕（≥640px）
- `md:` - 中等屏幕（≥768px）
- `lg:` - 大屏幕（≥1024px）
- `xl:` - 超大屏幕（≥1280px）

## 下一步

- ✅ 熟悉项目结构
- ✅ 体验现有工具
- ✅ 尝试添加新工具
- 📖 阅读 [PROJECT.md](./PROJECT.md) 了解详细说明
- 🏗️ 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解架构设计

## 需要帮助？

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [DaisyUI 文档](https://daisyui.com/)
- [Vite 文档](https://cn.vitejs.dev/)

祝你开发愉快！🚀
