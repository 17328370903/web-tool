# Web Tool 架构说明

## 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      Web Tool 应用                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    App.vue (根组件)                       │
│                  RouterView (路由视图)                    │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│   HomeView.vue       │        │   ToolView.vue       │
│   (首页)             │        │   (工具详情页)        │
│                      │        │                      │
│  - Hero 区域         │        │  - 动态加载工具组件   │
│  - 工具分类卡片      │        │  - 默认模板          │
│  - 工具列表          │        │                      │
└──────────────────────┘        └──────────────────────┘
            │                               │
            │                               ▼
            │                    ┌──────────────────────┐
            │                    │  具体工具组件         │
            │                    │  - JsonFormatter     │
            │                    │  - Base64Encoder     │
            │                    │  - ColorConverter    │
            │                    │  - PasswordGenerator │
            │                    └──────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│                 AppLayout.vue (布局组件)                  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              顶部导航栏 (Navbar)                  │   │
│  │  - Logo / 菜单按钮 / GitHub 链接                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │   侧边栏         │  │     主内容区             │   │
│  │   (Sidebar)      │  │     (Main Content)       │   │
│  │                  │  │                          │   │
│  │  - 工具分类      │  │   <slot />               │   │
│  │  - 工具列表      │  │   (页面内容)              │   │
│  │                  │  │                          │   │
│  └──────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

## 数据流

用户访问 → Router 匹配路由 → 加载对应 View → 
使用 AppLayout 布局 → 渲染具体内容 → 交互

## 工具加载流程

1. 用户点击工具链接
2. Router 导航到 /tools/:category/:toolId
3. ToolView 根据 toolId 查找工具信息
4. 从 componentMap 中获取对应的组件
5. 动态加载并渲染工具组件
6. 如果组件不存在，显示默认模板

## 文件依赖关系

main.ts
  ├─ App.vue
  │   └─ RouterView
  │       ├─ HomeView.vue
  │       │   ├─ AppLayout.vue
  │       │   │   └─ toolCategories (data/tools.ts)
  │       │   └─ toolCategories (data/tools.ts)
  │       └─ ToolView.vue
  │           ├─ AppLayout.vue
  │           ├─ getToolById (data/tools.ts)
  │           └─ 动态工具组件
  │               └─ JsonFormatter.vue (示例)
  └─ router/index.ts

## 工具数据结构

ToolCategory {
  id: string          // 分类 ID
  name: string        // 分类名称
  description: string // 分类描述
  icon: string        // 分类图标
  tools: Tool[]       // 工具列表
}

Tool {
  id: string          // 工具 ID
  name: string        // 工具名称
  description: string // 工具描述
  icon: string        // 工具图标
  category: string    // 所属分类
  path: string        // 路由路径
}

## 扩展示例

添加新工具的完整流程：

1. 定义工具数据 (src/data/tools.ts)
   ↓
2. 创建工具组件 (src/components/tools/NewTool.vue)
   ↓
3. 注册组件映射 (src/views/ToolView.vue)
   ↓
4. 自动在首页和侧边栏显示

## 技术亮点

✅ 组件化设计：每个工具独立组件，易于维护
✅ 懒加载：路由和组件按需加载，提升性能
✅ 类型安全：完整的 TypeScript 类型定义
✅ 响应式：Tailwind CSS 实现多端适配
✅ 可扩展：清晰的架构，方便添加新工具
✅ 用户体验：流畅的交互和视觉反馈
