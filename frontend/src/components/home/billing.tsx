import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

export default function Billing() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold">Billing</h3>
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2 rounded-full">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Professional Plan</h4>
            <p className="text-sm text-gray-400">$49/month</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Next billing date</span>
            <span>June 1, 2023</span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Manage Subscription
          </Button>
          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
            View Billing History
          </Button>
        </div>
      </div>
    </div>
  )
}
