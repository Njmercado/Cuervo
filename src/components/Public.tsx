import { supabase } from "../lib/supabase"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { type Profile } from "../objects/profile"

function InfoField({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="space-y-1">
      <dt className="text-xs font-bold uppercase tracking-widest text-[#666]">
        {label}
      </dt>
      <dd className="text-lg font-medium text-white border-b border-white/10 pb-1">
        {value}
      </dd>
    </div>
  )
}

export function Public() {
  const { token } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('PublicUser')
      .select('*')
      .eq('user_id', token)
      .eq('chosen', true)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(true)
        } else {
          setProfile(data)
        }
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-4 w-48 bg-white/20 rounded mx-auto"></div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading Profile...</div>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-4 bg-[#0a0a0a] p-12 rounded-2xl border border-white/10">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-gray-400 font-mono text-sm">Profile not found or is private.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <article className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Header */}
        <header className="p-8 md:p-12 border-b border-white/10 relative overflow-hidden bg-black/40">
          {/* Abstract Circle Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 text-center space-y-4">
            <div className="inline-block px-3 py-1 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Cuervo Member</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                {profile.profile_title || 'Untitled'}
              </h1>
              <p className="text-lg text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
                {profile.profile_description}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12">

          {/* Personal Info Section */}
          <section aria-label="Personal Information" className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Personal Information</h2>
              <div className="h-px bg-white/10 flex-grow" />
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <InfoField label="Nombre Completo" value={profile.data?.fullName} />
              <InfoField label="Documento" value={`${profile.data?.idType} - ${profile.data?.idNumber}`} />
              <InfoField label="RH" value={profile.data?.rh} />
              <InfoField label="Seguro Médico" value={profile.data?.healthInsurance} />
              {profile.data?.healthInsuranceNumber && (
                <InfoField label="N° Seguro" value={profile.data?.healthInsuranceNumber} />
              )}
            </dl>

            {profile.data?.extraInfo && (
              <div className="pt-4">
                <dt className="text-xs font-bold uppercase tracking-widest text-[#666] mb-2">Información Extra</dt>
                <dd className="bg-white/5 p-4 rounded-lg text-sm text-gray-300 leading-relaxed border border-white/5">
                  {profile.data.extraInfo}
                </dd>
              </div>
            )}
          </section>

          {/* Emergency Info Section */}
          <section aria-label="Emergency Information" className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-500/60">Emergency Contact</h2>
              <div className="h-px bg-red-500/20 flex-grow" />
            </div>

            <div className="bg-gradient-to-br from-red-950/20 to-black border border-red-900/20 p-6 rounded-xl relative overflow-hidden group">
              {/* Red Glow on Hover */}
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                <InfoField label="Nombre Contacto" value={profile.data?.emergencyName} />
                <InfoField label="Numero Contacto" value={profile.data?.emergencyContact} />
                <InfoField label="Parentesco" value={profile.data?.emergencyRelationship} />
              </dl>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-white/10 text-center bg-black/40">
          <p className="text-[10px] uppercase tracking-widest text-gray-700">Protected by Cuervo System</p>
        </footer>

      </article>
    </main>
  )
}