import type { ToolCategory } from '@/types/tool'

export const toolCategories: ToolCategory[] = [
  {
    id: 'text',
    name: '文本工具',
    description: '文本处理、格式化、转换等工具',
    icon: '📝',
    tools: [
      {
        id: 'json-format',
        name: 'JSON 格式化',
        description: '格式化和验证 JSON 数据',
        icon: '🔧',
        category: 'text',
        path: '/tools/text/json-format'
      },
      {
        id: 'base64-encode',
        name: 'Base64 编解码',
        description: 'Base64 编码和解码工具',
        icon: '🔐',
        category: 'text',
        path: '/tools/text/base64-encode'
      },
      {
        id: 'csv-parser',
        name: 'CSV 解析器',
        description: '解析 CSV 文件并展示内容',
        icon: '📊',
        category: 'text',
        path: '/tools/text/csv-parser'
      },
      {
        id: 'timestamp-converter',
        name: '时间戳转换',
        description: 'Unix 时间戳与日期格式互相转换',
        icon: '🕒',
        category: 'text',
        path: '/tools/text/timestamp-converter'
      }
    ]
  },
  {
    id: 'image',
    name: '图片工具',
    description: '图片裁剪、切分、转换等工具',
    icon: '🖼️',
    tools: [
      {
        id: 'image-processor',
        name: '图片九宫格切分',
        description: '一键将图片切分为 9 张图，支持批量下载',
        icon: '✂️',
        category: 'image',
        path: '/tools/image/image-processor'
      },
      {
        id: 'image-compressor',
        name: '图片压缩',
        description: '在线压缩图片大小，支持质量与尺寸调整',
        icon: '📉',
        category: 'image',
        path: '/tools/image/image-compressor'
      },
      {
        id: 'image-base64',
        name: '图片 Base64',
        description: '将图片转换为 Base64 编码，支持文件和 URL',
        icon: '🔗',
        category: 'image',
        path: '/tools/image/image-base64'
      },
      {
        id: 'favicon-generator',
        name: 'Favicon 在线制作',
        description: '快速将图片转换为多种尺寸的浏览器图标',
        icon: '🎯',
        category: 'image',
        path: '/tools/image/favicon-generator'
      },
      {
        id: 'nine-grid-text',
        name: '九宫格文字',
        description: '生成精美的九宫格文字切片图片',
        icon: '✍️',
        category: 'image',
        path: '/tools/image/nine-grid-text'
      }
    ]
  },
  {
    id: 'convert',
    name: '转换工具',
    description: '单位转换、格式转换等工具',
    icon: '🔄',
    tools: [
      {
        id: 'color-converter',
        name: '颜色转换器',
        description: 'HEX、RGB、HSL 颜色格式转换',
        icon: '🎨',
        category: 'convert',
        path: '/tools/convert/color-converter'
      }
    ]
  },
  {
    id: 'generator',
    name: '生成工具',
    description: '密码生成、二维码生成等工具',
    icon: '⚡',
    tools: [
      {
        id: 'password-generator',
        name: '密码生成器',
        description: '生成安全的随机密码',
        icon: '🔑',
        category: 'generator',
        path: '/tools/generator/password-generator'
      }
    ]
  }
]

export function getAllTools() {
  return toolCategories.flatMap(category => category.tools)
}

export function getToolById(toolId: string) {
  return getAllTools().find(tool => tool.id === toolId)
}

export function getCategoryById(categoryId: string) {
  return toolCategories.find(category => category.id === categoryId)
}
