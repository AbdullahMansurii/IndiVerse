import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, BookOpen, GraduationCap, ChevronRight, Search, Plane, Trophy, ClipboardList, PenTool, ArrowRight, MessageCircle, PiggyBank, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { MOCK_MENTORS } from '../lib/constants'
import { SCHOLARSHIPS } from '../lib/scholarshipData'
import { EXAMS } from '../lib/examData'

export default function AspirantDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // Data States
    const [profile, setProfile] = useState(null)
    const [mentors, setMentors] = useState([])
    const [questions, setQuestions] = useState([])
    const [journeyStats, setJourneyStats] = useState({ progress: 0, nextStep: null })
    const [selectedExam, setSelectedExam] = useState(null)

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

                // Ranking Logic: Country Match (High Priority) -> Verification (Medium) -> Course Match (Low)
                const rankedMentors = [...allMentors].sort((a, b) => {
                    let scoreA = 0
                    let scoreB = 0

                    // 1. Country Match (20 pts)
                    if (profileData.targetCountry && a.currentCountry?.toLowerCase() === profileData.targetCountry.toLowerCase()) scoreA += 20
                    if (profileData.targetCountry && b.currentCountry?.toLowerCase() === profileData.targetCountry.toLowerCase()) scoreB += 20

                    // 2. Verification Status (Verified = 10 pts, Pending = 3 pts)
                    const statusA = a.verificationStatus || a.metadata?.verificationStatus
                    const statusB = b.verificationStatus || b.metadata?.verificationStatus

                    if (statusA === 'VERIFIED') scoreA += 10
                    if (statusA === 'PENDING') scoreA += 3

                    if (statusB === 'VERIFIED') scoreB += 10
                    if (statusB === 'PENDING') scoreB += 3

                    // 3. Course Match (5 pts)
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
                        {mentors.map((mentor, index) => {
                            const isVerified = (mentor.verificationStatus || mentor.metadata?.verificationStatus) === 'VERIFIED'
                            return (
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
                                        <div className="absolute top-0 right-0 bg-secondary text-black text-[10px] font-bold px-2 py-1 rounded-bl-xl z-10">
                                            MATCH
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                                                {mentor.fullName[0]}
                                            </div>
                                            {isVerified && (
                                                <div className="absolute -bottom-1 -right-1 bg-[#0A0A0A] p-0.5 rounded-full border border-white/10">
                                                    <div className="bg-green-500 rounded-full p-0.5">
                                                        <CheckCircle2 className="w-3 h-3 text-black" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                                                {mentor.fullName}
                                                {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-400" />}
                                            </h4>
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
                            )
                        })}
                    </div>
                </div>



                {/* Scholarship Section */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-green-400" /> Scholarships for {profile.targetCountry || 'You'}
                        </h3>
                        <Link to="/scholarships" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Valued Opportunities <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SCHOLARSHIPS
                            .filter(s => !profile.targetCountry || s.country === profile.targetCountry || s.tags.includes('All Degrees'))
                            .slice(0, 3)
                            .map(scholarship => (
                                <motion.div
                                    key={scholarship.id}
                                    whileHover={{ y: -5 }}
                                    className="glass-card p-5 rounded-xl border border-white/5 hover:border-green-500/30 transition-all cursor-pointer relative overflow-hidden group"
                                    onClick={() => navigate('/scholarships')}
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-4xl">{scholarship.flag}</span>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20">
                                                {scholarship.amount}
                                            </span>
                                            <h4 className="font-bold text-white mt-3 group-hover:text-green-400 transition-colors line-clamp-1">
                                                {scholarship.name}
                                            </h4>
                                            <p className="text-xs text-gray-400 line-clamp-1">{scholarship.provider}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="text-xs text-gray-500">
                                                Deadline: <span className="text-gray-300">{scholarship.deadline}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>

                {/* Exam Eligibility Widget */}
                <div className="lg:col-span-3">
                    <div className="glass-card p-8 rounded-2xl border border-white/5 bg-gradient-to-r from-red-500/5 to-transparent relative overflow-hidden">
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            {/* Left Side: Header & Exam List */}
                            <div className="flex-1 space-y-6 w-full">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Check Your Eligibility</h3>
                                    <p className="text-gray-400 text-sm mb-4">Select an exam to see which top universities accept it.</p>
                                    <Link to="/exams" className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1">
                                        View Full Exam Guide <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {EXAMS.map(exam => (
                                        <button
                                            key={exam.id}
                                            onClick={() => setSelectedExam(exam.id === selectedExam?.id ? null : exam)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedExam?.id === exam.id
                                                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25'
                                                : 'bg-white/5 border-white/10 text-gray-300 hover:border-red-500/50 hover:text-white'
                                                }`}
                                        >
                                            {exam.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Results Area */}
                            <div className="flex-1 w-full min-h-[160px]">
                                <AnimatePresence mode="wait">
                                    {selectedExam ? (
                                        <motion.div
                                            key={selectedExam.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="bg-black/40 p-5 rounded-xl border border-white/10"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-white text-lg">{selectedExam.fullName}</h4>
                                                <span className="text-[10px] text-gray-400 border border-white/10 px-2 py-1 rounded bg-white/5">{selectedExam.id.toUpperCase()}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4">{selectedExam.description}</p>

                                            <div>
                                                <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-3">
                                                    <Globe className="w-3 h-3" /> Accepted By
                                                </h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {selectedExam.universities.slice(0, 4).map((uni, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-2 rounded">
                                                            <span>{uni.countryFlag}</span>
                                                            <span className="truncate">{uni.name}</span>
                                                            <span className="ml-auto text-[10px] text-red-400 font-mono">{uni.minScore}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl p-6">
                                            <Trophy className="w-8 h-8 mb-3 opacity-20" />
                                            <p className="text-sm">Select an exam to view details</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
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

