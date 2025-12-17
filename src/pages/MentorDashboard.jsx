import { useState, useEffect } from 'react'
import { MessageSquare, MessageCircle, Clock, CheckCircle, XCircle, TrendingUp, Star, ArrowRight, AlertCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function MentorDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState({
        pendingRequests: 0,
        completedSessions: 0,
        impactScore: 0
    })
    const [relevantQuestions, setRelevantQuestions] = useState([])
    const [recentRequests, setRecentRequests] = useState([])

    useEffect(() => {
        if (!user) return

        const fetchDashboardData = async () => {
            setLoading(true)

            // 1. Fetch Mentor Profile
            const { data: profileData } = await supabase
                .from('Profile')
                .select('*')
                .eq('userId', user.id)
                .single()
            setProfile(profileData)

            if (profileData) {
                // 2. Fetch Requests Stats
                // Pending
                const { count: pendingCount, data: pendingData } = await supabase
                    .from('GuidanceRequest')
                    .select('*', { count: 'exact' })
                    .eq('mentorId', user.id)
                    .eq('status', 'PENDING')
                    .order('createdAt', { ascending: false })
                    .limit(3)

                // Accepted/Completed (Proxy for Impact)
                const { count: completedCount } = await supabase
                    .from('GuidanceRequest')
                    .select('*', { count: 'exact' })
                    .eq('mentorId', user.id)
                    .eq('status', 'ACCEPTED')

                setStats({
                    pendingRequests: pendingCount || 0,
                    completedSessions: completedCount || 0,
                    impactScore: (completedCount || 0) * 10 // Simple score logic
                })
                setRecentRequests(pendingData || [])

                // 3. Fetch Relevant Questions
                // Fetch recent questions and filter in memory for keyword match (MVP)
                const { data: qData } = await supabase
                    .from('Question')
                    .select('*')
                    .order('createdAt', { ascending: false })
                    .limit(50)

                if (qData) {
                    const keywords = [profileData.course, profileData.university, profileData.currentCountry]
                        .filter(Boolean)
                        .map(k => k.toLowerCase())

                    const relevant = qData.filter(q =>
                        keywords.some(k => q.title.toLowerCase().includes(k) || q.content.toLowerCase().includes(k))
                    ).slice(0, 3) // Top 3 relevant

                    setRelevantQuestions(relevant)
                }
            } else {
                // Fallback for no profile (shouldn't happen for verified mentor but safe to have)
                setStats({ pendingRequests: 0, completedSessions: 0, impactScore: 0 })
            }
            setLoading(false)
        }

        fetchDashboardData()
    }, [user])

    if (loading) return (
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-32 bg-white/5 rounded-2xl" />
            <div className="h-32 bg-white/5 rounded-2xl" />
            <div className="h-32 bg-white/5 rounded-2xl" />
            <div className="col-span-full h-64 bg-white/5 rounded-2xl" />
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome, {profile?.fullName?.split(' ')[0] || 'Mentor'}</h2>
                    <p className="text-gray-400">Ready to make an impact today?</p>
                </div>
                {/* Impact Badge */}
                <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent px-4 py-2 rounded-xl border border-primary/20">
                    <div className="p-2 bg-primary/20 rounded-full">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">Your Impact</p>
                        <p className="font-bold text-white">{stats.completedSessions} Students Guided</p>
                    </div>
                </div>
            </div>

            {/* Actionable Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Requests - ACTIONABLE */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/requests')}
                    className={`text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${stats.pendingRequests > 0
                            ? 'bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/50 hover:border-yellow-400'
                            : 'glass-card border-white/10'
                        }`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stats.pendingRequests > 0 ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400'}`}>
                            <Clock className="w-6 h-6" />
                        </div>
                        {stats.pendingRequests > 0 && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-white">{stats.pendingRequests}</h3>
                        <p className={`text-sm font-medium ${stats.pendingRequests > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                            Pending Requests
                        </p>
                    </div>
                    {stats.pendingRequests > 0 && (
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    )}
                </motion.button>

                {/* Questions to Answer - ACTIONABLE */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/discussions')}
                    className={`text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${relevantQuestions.length > 0
                            ? 'bg-gradient-to-br from-primary/20 to-transparent border-primary/50 hover:border-primary'
                            : 'glass-card border-white/10'
                        }`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${relevantQuestions.length > 0 ? 'bg-primary text-black' : 'bg-white/5 text-gray-400'}`}>
                            <MessageCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-white">{relevantQuestions.length}</h3>
                        <p className={`text-sm font-medium ${relevantQuestions.length > 0 ? 'text-primary' : 'text-gray-400'}`}>
                            Questions for You
                        </p>
                    </div>
                </motion.button>

                {/* Total Reach - PASSIVE */}
                <div className="p-6 rounded-2xl glass-card border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-secondary/20 text-secondary">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-white">{stats.completedSessions}</h3>
                        <p className="text-sm font-medium text-secondary">
                            Mentees Guided
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Pending Requests List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Needs Review
                            {stats.pendingRequests > 0 && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">{stats.pendingRequests}</span>}
                        </h3>
                    </div>

                    {recentRequests.length > 0 ? (
                        <div className="space-y-4">
                            {recentRequests.map(req => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-colors flex items-center justify-between group cursor-pointer"
                                    onClick={() => navigate('/requests')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                                            ?
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">New Mentorship Request</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Waiting for review
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 rounded-2xl text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-bold mb-1">All Caught Up!</h4>
                            <p className="text-sm text-gray-400 mb-4 max-w-xs">You have no pending requests. Improve your profile to attract more mentees.</p>
                            <button onClick={() => navigate('/profile')} className="text-primary text-sm hover:underline">Edit Profile</button>
                        </div>
                    )}
                </section>

                {/* Questions Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            High Impact Questions
                            {relevantQuestions.length > 0 && <span className="text-xs bg-primary text-black px-2 py-0.5 rounded-full font-bold">{relevantQuestions.length}</span>}
                        </h3>
                    </div>

                    {relevantQuestions.length > 0 ? (
                        <div className="space-y-4">
                            {relevantQuestions.map((q, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/question/${q.id}`)}
                                >
                                    <h4 className="text-white font-medium line-clamp-1 mb-2 group-hover:text-primary transition-colors">{q.title}</h4>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="bg-white/5 px-2 py-1 rounded">Relevant to you</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 rounded-2xl text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-bold mb-1">No Urgent Questions</h4>
                            <p className="text-sm text-gray-400 mb-4 max-w-xs">There are no new questions matching your specific expertise right now.</p>
                            <button onClick={() => navigate('/discussions')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all">
                                Browse All Questions
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

