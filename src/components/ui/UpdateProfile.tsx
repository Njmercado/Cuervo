import { type Profile as ProfileType } from '../../objects/profile'
import { ProfileForm } from './ProfileForm'
import { useState } from 'react'

interface ProfileProps {
  profile: ProfileType
  onChosen?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  onSave: (profile: ProfileType) => void
  isChosenable?: boolean
  expand?: boolean
}

export function UpdateProfile({
  profile,
  onChosen,
  onDelete,
  onSave,
  isChosenable = true,
  expand = false,
}: ProfileProps) {
  const [localProfile, setLocalProfile] = useState(profile)
  const [isExpanded, setIsExpanded] = useState(expand)

  return (
    <article
      className={`bg-[#0a0a0a] border ${localProfile.chosen ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'} rounded-xl overflow-hidden transition-all duration-300`}
    >
      {/* Header / Click to Expand */}
      <header
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center group select-none"
      >
        <div className="flex items-center gap-4">
          {
            isChosenable &&
            <button
              onClick={onChosen}
              className={`text-2xl transition-colors hover:scale-110 active:scale-95 ${localProfile.chosen ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500/50'}`}
              title={localProfile.chosen ? "Current Profile" : "Set as Current"}
            >
              ★
            </button>
          }
          <div className="space-y-1">
            <h3 className={`text-lg font-bold transition-colors ${localProfile.chosen ? 'text-yellow-500' : 'group-hover:text-blue-400'}`}>
              {localProfile.profile_title || 'Untitled Profile'}
            </h3>
            <p className="text-sm text-gray-500">{localProfile.profile_description || 'No description'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {
            isChosenable &&
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-500 transition-colors px-2 py-1 text-xs uppercase tracking-widest font-bold z-10"
            >
              Delete
            </button>
          }
          <span className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </header>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <ProfileForm
            profile={localProfile}
            onUpdate={(profile: ProfileType) => setLocalProfile(profile)}
          />
          <button
            onClick={() => onSave(localProfile)}
            className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </article>
  )
}
