import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Bookmark, MapPin, BookOpen, GraduationCap, X } from 'lucide-react'

export default function SavedMentors() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchSavedMentors()
        }
    }, [user])

    const fetchSavedMentors = async () => {
        setLoading(true)

        // 1. Fetch Saved IDs
        const { data: savedData, error: savedError } = await supabase
            .from('SavedMentor')
            .select('mentorId')
            .eq('aspirantId', user.id)

        if (savedError) {
            console.error('Error fetching saved mentors:', savedError)
            setLoading(false)
            return
        }

        if (savedData && savedData.length > 0) {
            const mentorIds = savedData.map(item => item.mentorId)

            // 2. Fetch Profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('Profile')
                .select('*')
                .in('userId', mentorIds)

            if (profiles) {
                setMentors(profiles)
            }
        } else {
            setMentors([])
        }
        setLoading(false)
    }

    const handleRemove = async (e, mentorId) => {
        e.preventDefault() // Prevent navigation if button clicked
        e.stopPropagation()

        const { error } = await supabase
            .from('SavedMentor')
            .delete()
            .eq('aspirantId', user.id)
            .eq('mentorId', mentorId)

        if (error) {
            alert('Error removing mentor: ' + error.message)
        } else {
            setMentors(prev => prev.filter(m => m.userId !== mentorId))
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Saved Mentors</h1>
                    <p className="text-gray-400">Your shortlisted mentors for quick access.</p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                ) : mentors.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-gray-400">You haven't saved any mentors yet.</p>
                        <Link to="/dashboard" className="text-primary hover:underline mt-2 inline-block">
                            Browse Mentors
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map(mentor => (
                            <Link key={mentor.id} to={`/mentor/${mentor.id}`}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group relative"
                                >
                                    <button
                                        onClick={(e) => handleRemove(e, mentor.userId)}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-colors z-10"
                                        title="Remove from saved"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shrink-0">
                                            {mentor.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                                                {mentor.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-400">{mentor.university}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-400">
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-4 h-4 text-secondary" />
                                            <span>{mentor.course}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-blue-400" />
                                            <span>{mentor.currentCountry}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
