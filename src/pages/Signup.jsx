import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Signup() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const roleParam = searchParams.get('role') // 'aspirant' or 'mentor'

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')

        const { error: authError } = await signUp({ email, password })
        if (authError) {
            setError(authError.message)
            setLoading(false)
        } else {
            navigate('/login')
            alert("Check your email for confirmation! (For MVP demo you might need to confirm email manually in Supabase dashboard if strict)")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full animate-blob mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full animate-blob animation-delay-2000 mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="glass-card p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary via-white to-primary bg-clip-text text-transparent">Join Indiverse</h2>
                        <p className="mt-2 text-sm text-gray-400">
                            {roleParam ? `Sign up as an ${roleParam.charAt(0).toUpperCase() + roleParam.slice(1)}` : 'Create your account'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-secondary to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-secondary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-medium text-secondary hover:text-green-400 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
