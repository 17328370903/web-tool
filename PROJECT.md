# Web Tool 项目框架说明

## 📋 项目概述

这是一个基于 Vue 3 + TypeScript + Vite + Tailwind CSS + DaisyUI 构建的在线工具类网站框架。

## 🏗️ 项目结构

```
src/
├── components/          # 组件目录
│   ├── AppLayout.vue   # 主布局组件（导航栏 + 侧边栏）
│   └── tools/          # 工具组件目录
│       └── JsonFormatter.vue  # JSON 格式化工具示例
├── views/              # 页面视图
│   ├── HomeView.vue    # 首页
│   └── ToolView.vue    # 工具详情页
├── router/             # 路由配置
│   └── index.ts
├── types/              # TypeScript 类型定义
│   └── tool.ts
├── data/               # 数据文件
│   └── tools.ts        # 工具列表数据
├── App.vue             # 根组件
├── main.ts             # 入口文件
└── style.css           # 全局样式
```

## 🎯 核心功能

### 1. 路由系统
- 首页：`/` - 展示所有工具分类和工具列表
- 工具页：`/tools/:category/:toolId` - 具体工具页面

### 2. 工具分类
目前预设了三个分类：
- **文本工具**：JSON 格式化、Base64 编解码
- **转换工具**：颜色转换器
- **生成工具**：密码生成器

### 3. 布局组件
- 顶部导航栏：包含 Logo、菜单切换按钮、GitHub 链接
- 侧边栏：可折叠的工具分类导航
- 主内容区：动态渲染页面内容

### 4. 工具组件系统
采用动态组件加载机制，每个工具都是独立的 Vue 组件，便于扩展和维护。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 📝 如何添加新工具

### 步骤 1：在工具数据中注册
编辑 `src/data/tools.ts`，添加工具信息：

```typescript
{
  id: 'your-tool-id',
  name: '工具名称',
  description: '工具描述',
  icon: '🔧',
  category: 'text',  // 分类 ID
  path: '/tools/text/your-tool-id'
}
```

### 步骤 2：创建工具组件
在 `src/components/tools/` 目录下创建新组件：

```vue
<script setup lang="ts">
// 你的工具逻辑
</script>

<template>
  <div class="space-y-4">
    <!-- 工具 UI -->
  </div>
</template>
```

### 步骤 3：注册组件映射
编辑 `src/views/ToolView.vue`，在 `componentMap` 中添加映射：

```typescript
const componentMap: Record<string, any> = {
  'json-format': defineAsyncComponent(() => import('@/components/tools/JsonFormatter.vue')),
  'your-tool-id': defineAsyncComponent(() => import('@/components/tools/YourTool.vue')),
}
```

## 🎨 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vite**: 下一代前端构建工具
- **Vue Router 4**: 官方路由管理器
- **Tailwind CSS**: 实用优先的 CSS 框架
- **DaisyUI**: Tailwind CSS 组件库

## 📦 已安装的依赖

### 运行时依赖
- vue: ^3.5.34
- vue-router: ^4.5.0
- tailwindcss: ^4.3.0
- @tailwindcss/vite: ^4.3.0

### 开发依赖
- typescript: ~6.0.2
- vite: ^8.0.12
- vue-tsc: ^3.2.8
- daisyui: ^5.5.20
- @vitejs/plugin-vue: ^6.0.6

## 🔧 配置说明

### 路径别名
项目配置了 `@` 作为 `src` 目录的别名：
```typescript
import Component from '@/components/Component.vue'
```

### TypeScript 配置
- 启用了严格模式
- 配置了路径映射
- 支持 Vue 文件类型检查

## 📱 响应式设计

项目使用 Tailwind CSS 的响应式类，支持：
- 移动端：单列布局
- 平板端：双列布局
- 桌面端：三列布局

## 🌟 特性

✅ 现代化的技术栈  
✅ 类型安全的 TypeScript  
✅ 响应式设计  
✅ 组件化架构  
✅ 路由懒加载  
✅ 可扩展的工具系统  
✅ 美观的 UI（DaisyUI）  
✅ 暗色/亮色主题支持  

## 📄 示例工具

项目包含一个完整的 JSON 格式化工具示例（`JsonFormatter.vue`），展示了：
- 输入/输出区域设计
- 错误处理
- 复制功能
- 按钮交互
- 响应式布局

你可以参考这个示例来开发新的工具。

## 🎯 下一步建议

1. 实现 Base64 编解码工具
2. 实现颜色转换器
3. 实现密码生成器
4. 添加工具搜索功能
5. 添加收藏功能
6. 添加最近使用记录
7. 支持 PWA（离线使用）
8. 添加统计分析

## 📞 技术支持

如有问题，请查看：
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [DaisyUI 文档](https://daisyui.com/)
