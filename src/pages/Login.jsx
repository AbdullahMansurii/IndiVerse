import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')

        const { error: authError } = await signIn({ email, password })
        if (authError) {
            setError(authError.message)
            setLoading(false)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full animate-blob mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full animate-blob animation-delay-2000 mix-blend-screen" />

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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-400">Sign in to continue your journey</p>
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
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link to="/signup" className="font-medium text-primary hover:text-orange-400 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
