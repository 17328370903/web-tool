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
