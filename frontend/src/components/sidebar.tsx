import { Tool, ToolDetails } from '@/types'
import { HelpCircle, Home, FileText, Mail } from 'lucide-react'

const tools: Record<Tool, ToolDetails> = {
  'general-assistant': {
    name: 'General Assistant',
    icon: <HelpCircle className="h-6 w-6" />,
    description: 'Get help with various real estate tasks',
  },
  'property-valuation': {
    name: 'Property Valuation',
    icon: <Home className="h-6 w-6" />,
    description: 'Get property valuations with supporting information',
  },
  'property-description': {
    name: 'Property Description Generator',
    icon: <FileText className="h-6 w-6" />,
    description: 'Generate compelling property descriptions',
  },
  'generate-marketing-email': {
    name: 'Generate Marketing Email',
    icon: <Mail className="h-6 w-6" />,
    description: 'Create marketing emails for potential buyers',
  },
}

interface SidebarProps {
  selectedTool: Tool
  setSelectedTool: (tool: Tool) => void
}

export default function Sidebar({ selectedTool, setSelectedTool }: SidebarProps) {
  return (
    <div className="w-64 border-r border-gray-700 h-full">
      <div className="p-6">
        <h1 className="text-xl font-semibold">myAgent Tools</h1>
      </div>
      <nav className="space-y-1">
        {(Object.entries(tools) as [Tool, ToolDetails][]).map(([key, tool]) => (
          <button
            key={key}
            onClick={() => setSelectedTool(key)}
            className={`flex items-center gap-3 w-full px-6 py-3 text-sm text-left transition-colors ${
              selectedTool === key ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {tool.icon}
            <span>{tool.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export { tools }
