import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, GraduationCap, Check, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Onboarding() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole)
        setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())


        const profileData = {
            id: crypto.randomUUID(),
            userId: user.id,
            fullName: data.fullName,
            isStudyingAbroad: role === 'MENTOR',
            // Aspirant Fields
            targetCountry: role === 'ASPIRANT' ? data.targetCountry : null,
            intendedCourse: role === 'ASPIRANT' ? data.intendedCourse : null,
            budgetRange: role === 'ASPIRANT' ? data.budgetRange : null,
            // Mentor Fields
            currentCountry: role === 'MENTOR' ? data.currentCountry : null,
            university: role === 'MENTOR' ? data.university : null,
            course: role === 'MENTOR' ? data.course : null,
            yearOfStudy: role === 'MENTOR' ? data.yearOfStudy : null,
        }

        // 1. Ensure User exists in public.User (to satisfy FK)
        const { error: userError } = await supabase.from('User').upsert({
            id: user.id,
            email: user.email,
            role: role,
        })

        if (userError) {
            console.error('Error creating public user:', userError)
            alert('Failed to initialize user record: ' + userError.message)
            setLoading(false)
            return
        }

        // 2. Create Profile
        const { error } = await supabase.from('Profile').insert([profileData])

        if (error) {
            console.error('Error creating profile:', error)
            alert('Failed to save profile: ' + error.message)
            setLoading(false)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-white to-secondary" />

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl"
            >
                {step === 1 ? (
                    <div className="text-center space-y-12">
                        <h2 className="text-4xl font-bold text-white">Choose your path</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Aspirant Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleRoleSelect('ASPIRANT')}
                                className="cursor-pointer glass-card p-10 rounded-2xl flex flex-col items-center gap-6 group hover:border-primary/50"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Aspirant</h3>
                                    <p className="text-gray-400">I am planning to study abroad.</p>
                                </div>
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex items-center gap-2 text-sm font-medium">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>

                            {/* Mentor Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleRoleSelect('MENTOR')}
                                className="cursor-pointer glass-card p-10 rounded-2xl flex flex-col items-center gap-6 group hover:border-secondary/50"
                            >
                                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                    <GraduationCap className="w-10 h-10 text-secondary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Mentor</h3>
                                    <p className="text-gray-400">I am already studying abroad.</p>
                                </div>
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-secondary flex items-center gap-2 text-sm font-medium">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                            Complete your profile
                            <span className="block text-sm font-normal text-gray-400 mt-1">
                                Tell us a bit about yourself to get started.
                            </span>
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input name="fullName" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                            </div>

                            {role === 'ASPIRANT' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Country</label>
                                        <input name="targetCountry" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Intended Course</label>
                                        <input name="intendedCourse" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                                        <input name="budgetRange" className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" placeholder="e.g. 20-30 Lakhs" />
                                    </div>
                                </>
                            )}

                            {role === 'MENTOR' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Current Country</label>
                                        <input name="currentCountry" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
                                        <input name="university" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Course / Major</label>
                                        <input name="course" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                                        <input name="yearOfStudy" required className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none" />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors mt-6"
                            >
                                {loading ? 'Saving...' : 'Finish Setup'}
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
