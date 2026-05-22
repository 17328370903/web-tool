# 🔧 Web Tool - 在线工具集合

一个简洁、高效的在线工具类网站，基于 Vue 3 + TypeScript + Vite 构建。

## ✨ 特性

- 🎨 现代化 UI 设计（Tailwind CSS + DaisyUI）
- 📱 完全响应式，支持移动端
- 🚀 快速加载，路由懒加载
- 🔍 类型安全，TypeScript 开发
- 📦 组件化架构，易于扩展
- 🌙 支持暗色/亮色主题

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **路由**: Vue Router 4
- **样式**: Tailwind CSS + DaisyUI

## 📦 安装与运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/       # 组件
│   ├── AppLayout.vue    # 主布局
│   └── tools/           # 工具组件
├── views/            # 页面视图
│   ├── HomeView.vue     # 首页
│   └── ToolView.vue     # 工具页
├── router/           # 路由配置
├── types/            # 类型定义
├── data/             # 数据文件
└── assets/           # 静态资源
```

## 🎯 可用工具

### 文本工具
- JSON 格式化 ✅
- Base64 编解码 🚧

### 转换工具
- 颜色转换器 🚧

### 生成工具
- 密码生成器 🚧

*✅ 已完成 | 🚧 开发中*

## 📖 添加新工具

详细教程请查看 [PROJECT.md](./PROJECT.md)

## 📄 许可证

MIT License
