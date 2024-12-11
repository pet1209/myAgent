import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Property } from '@/types'
import { formatDate } from '@/utils/dateUtils'

interface PropertyListProps {
  properties: Property[]
  deleteProperty: (id: string) => void
  openProperty: (propertyId: string) => void
}

export default function PropertyList({ properties, deleteProperty, openProperty }: PropertyListProps) {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold">All Properties</h3>
      {properties.map(property => (
        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md hover:bg-gray-750">
          <div className="flex-1">
            <h4 className="font-semibold">{property.address}</h4>
            <p className="text-sm text-gray-400">
              Created: {formatDate(property.createdAt)} | 
              Last Modified: {formatDate(property.modifiedAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => openProperty(property.id)}
              className="hover:bg-gray-700"
            >
              Open
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteProperty(property.id)}
              className="hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
