import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <main>
      <div className="flex flex-col items-center space-y-4">
        <img src="black.png" alt="crow simple image" width='100px' />
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          CUERVO
        </h1>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-black border border-white/20 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] mt-8">
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-xs text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black text-white border-b border-white/30 focus:border-white px-4 py-3 outline-none transition-colors duration-300 placeholder:text-gray-700"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black text-white border-b border-white/30 focus:border-white px-4 py-3 outline-none transition-colors duration-300 placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-black px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button type="button" className="flex items-center justify-center px-6 py-3 border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-300 text-white group cursor-pointer">
              <span className="font-semibold text-sm">Google</span>
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don't have an account? <Link to="/signup" className="text-white underline underline-offset-4 hover:text-gray-200 cursor-pointer">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
