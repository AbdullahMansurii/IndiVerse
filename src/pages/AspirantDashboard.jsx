import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, BookOpen, GraduationCap, ChevronRight, Search, Plane, Trophy, ClipboardList, PenTool, ArrowRight, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { MOCK_MENTORS } from '../lib/constants'

export default function AspirantDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // Data States
    const [profile, setProfile] = useState(null)
    const [mentors, setMentors] = useState([])
    const [questions, setQuestions] = useState([])
    const [journeyStats, setJourneyStats] = useState({ progress: 0, nextStep: null })

    useEffect(() => {
        if (!user) return

        const loadDashboardData = async () => {
            setLoading(true)

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('Profile')
                .select('*')
                .eq('userId', user.id)
                .single()

            setProfile(profileData)

            if (profileData) {
                // 2. Process Journey Stats
                const checklist = profileData.metadata?.journeyChecklist || {
                    exams: false,
                    sop: false,
                    lor: false,
                    applications: false
                }
                const steps = [
                    { key: 'exams', label: 'Entrance Exams' },
                    { key: 'sop', label: 'SOP Drafting' },
                    { key: 'lor', label: 'Letters of Rec.' },
                    { key: 'applications', label: 'Applications' }
                ]
                const completed = Object.values(checklist).filter(Boolean).length
                const progress = Math.round((completed / steps.length) * 100)
                const nextStep = steps.find(s => !checklist[s.key]) || { label: 'All Set!' }

                setJourneyStats({ progress, nextStep })

                // 3. Smart Mentor Matching
                const { data: mentorData } = await supabase
                    .from('Profile')
                    .select('*')
                    .eq('isStudyingAbroad', true)

                const allMentors = mentorData?.length ? mentorData : MOCK_MENTORS

                // Ranking Logic: Country Match (High Priority) -> Course Match (Medium)
                const rankedMentors = [...allMentors].sort((a, b) => {
                    let scoreA = 0
                    let scoreB = 0

                    if (profileData.targetCountry && a.currentCountry?.toLowerCase() === profileData.targetCountry.toLowerCase()) scoreA += 10
                    if (profileData.targetCountry && b.currentCountry?.toLowerCase() === profileData.targetCountry.toLowerCase()) scoreB += 10

                    // Simple string includes check for course (can be improved with fuzzy search)
                    if (profileData.intendedCourse && a.course?.toLowerCase().includes(profileData.intendedCourse.toLowerCase())) scoreA += 5
                    if (profileData.intendedCourse && b.course?.toLowerCase().includes(profileData.intendedCourse.toLowerCase())) scoreB += 5

                    return scoreB - scoreA
                })
                setMentors(rankedMentors)

                // 4. Contextual Questions
                if (profileData.targetCountry || profileData.intendedCourse) {
                    const { data: qData } = await supabase
                        .from('Question')
                        .select('*')
                        .order('createdAt', { ascending: false })
                        .limit(20) // Fetch strict limit then filter in JS for now (MVP)

                    if (qData) {
                        // Filter based on Title keywords
                        const keywords = [profileData.targetCountry, profileData.intendedCourse].filter(Boolean).map(k => k.toLowerCase())
                        const relevant = qData.filter(q =>
                            keywords.some(k => q.title.toLowerCase().includes(k))
                        ).slice(0, 3) // Top 3
                        setQuestions(relevant)
                    }
                }
            } else {
                // Fallback if no profile (just show all mentors unranked)
                const { data: mentorData } = await supabase.from('Profile').select('*').eq('isStudyingAbroad', true)
                setMentors(mentorData?.length ? mentorData : MOCK_MENTORS)
            }

            setLoading(false)
        }

        loadDashboardData()
    }, [user])

    if (loading) return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="col-span-full h-32 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
    )

    // Incomplete Profile State
    if (!profile || (!profile.targetCountry && !profile.intendedCourse)) {
        return (
            <div className="space-y-8">
                <div className="glass-card p-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Tell us about your dreams! 🚀</h2>
                    <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                        To match you with the best mentors and show relevant discussions, we need to know where you want to go and what you want to study.
                    </p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-primary text-black font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
                    >
                        Complete Profile <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                {/* Show generic mentor list below so it's not empty */}
                <div className="opacity-50 pointer-events-none filter blur-sm select-none">
                    <h3 className="text-xl font-bold text-white mb-4">Trending Mentors</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {mentors.slice(0, 3).map(m => (
                            <div key={m.id} className="h-48 bg-white/5 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header & Journey Widget */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                    <h2 className="text-3xl font-bold text-white">
                        Hi, {profile.fullName.split(' ')[0]} 👋
                    </h2>
                    <p className="text-gray-400">
                        Top {mentors[0]?.currentCountry === profile.targetCountry ? 'local' : ''} mentors in
                        <span className="text-primary font-bold"> {profile.targetCountry}</span> are ready to help you.
                    </p>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-md mt-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search mentors, universities in ${profile.targetCountry}...`}
                            className="w-full bg-surface/50 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Journey Widget */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Plane className="w-4 h-4 text-secondary" /> Your Journey
                        </h3>
                        <Link to="/my-journey" className="text-xs text-primary hover:underline">View Full</Link>
                    </div>

                    <div className="space-y-4">
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${journeyStats.progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">Progress</div>
                            <div className="font-bold text-white">{journeyStats.progress}%</div>
                        </div>

                        {journeyStats.progress < 100 && (
                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                    <ArrowRight className="w-4 h-4 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Up Next</p>
                                    <p className="font-medium text-sm text-white">{journeyStats.nextStep.label}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Mentors */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Recommended Mentors</h3>
                        {profile.targetCountry && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                                Prioritizing {profile.targetCountry}
                            </span>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {mentors.map((mentor, index) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-5 rounded-xl group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                                onClick={() => navigate(`/mentor/${mentor.id}`)}
                            >
                                {/* Match Badge */}
                                {mentor.currentCountry === profile.targetCountry && (
                                    <div className="absolute top-0 right-0 bg-secondary text-black text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                                        MATCH
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                                        {mentor.fullName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{mentor.fullName}</h4>
                                        <p className="text-xs text-gray-400">{mentor.university}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="bg-white/5 px-2 py-1 rounded text-gray-300 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> {mentor.course}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded text-gray-300 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-blue-400" /> {mentor.currentCountry}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Contextual Questions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Discussions for You</h3>
                    {questions.length > 0 ? (
                        <div className="space-y-4">
                            {questions.map(q => (
                                <Link key={q.id} to={`/question/${q.id}`}>
                                    <div className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group">
                                        <h4 className="font-medium text-white text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {q.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MessageCircle className="w-3 h-3" />
                                            <span>Active Discussion</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-6 rounded-xl border border-dashed border-white/10 text-center">
                            <p className="text-gray-400 text-sm mb-4">No discussions found for your target.</p>
                            <button
                                onClick={() => navigate('/discussions')}
                                className="text-primary text-sm font-bold hover:underline"
                            >
                                Start a Discussion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

