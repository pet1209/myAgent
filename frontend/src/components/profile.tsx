import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileData } from '@/types'

interface ProfileProps {
  profile: ProfileData
  setProfile: (profile: ProfileData) => void
}

export default function Profile({ profile, setProfile }: ProfileProps) {
  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold">Profile</h3>
      <div className="space-y-4 bg-gray-800 p-6 rounded-lg">
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className="flex flex-col space-y-1.5">
            <label 
              htmlFor={key} 
              className="text-sm font-medium text-gray-300"
            >
              {key.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
               key.split(/(?=[A-Z])/).join(' ').slice(1)}
            </label>
            <Input
              id={key}
              value={value}
              onChange={(e) => updateProfile(key as keyof ProfileData, e.target.value)}
              className="bg-gray-900 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
        <Button 
          className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
