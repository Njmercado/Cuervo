import { useState } from "react"
import { ProfileForm } from "./ProfileForm"
import { type Profile as ProfileType } from '../../objects/profile'

interface CreateProfileProps {
  onSave: (profile: ProfileType) => void
}

export function CreateProfile({ onSave }: CreateProfileProps) {
  const [profile, setProfile] = useState<ProfileType>()

  const onUpdate = (profile: ProfileType) => {
    setProfile(profile)
  }

  const handleSave = () => {
    if (!profile) return
    onSave(profile)
  }

  return (
    <div className="flex flex-col gap-4">
      <ProfileForm
        profile={{
          id: '',
          profile_title: '',
          profile_description: '',
          data: {
            fullName: '',
            rh: '',
            idType: '',
            idNumber: '',
            healthInsurance: '',
            healthInsuranceNumber: '',
            extraInfo: '',
            emergencyName: '',
            emergencyContact: '',
            emergencyRelationship: '',
          },
          chosen: false,
        }}
        onUpdate={onUpdate}
      />
      <button
        onClick={handleSave}
        className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
      >
        Crear perfil
      </button>
    </div>
  )
}