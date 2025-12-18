import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_MENTORS } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, BookOpen, GraduationCap, Globe, MessageSquare, Bookmark, Clock, ShieldCheck, CheckCircle2, Award, Calendar as CalendarIcon, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MentorProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [mentor, setMentor] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const { data: profile } = await supabase
                    .from('Profile')
                    .select('*')
                    .eq('userId', user.id)
                    .single()
                setUserProfile(profile)
            }

            // 1. Check Mock Data first
            const mockMentor = MOCK_MENTORS.find(m => m.id === id)
            if (mockMentor) {
                setMentor(mockMentor)
                setLoading(false)
                return
            }

            // 2. Fetch from Supabase
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('id', id)
                .single()

            if (!error && data) {
                setMentor(data)
            }
            setLoading(false)
        }

        fetchData()
    }, [id, user])

    const calculateCompleteness = (profile) => {
        if (!profile) return 0
        let score = 0
        const totalFields = 7
        const metadata = profile.metadata || {}

        if (profile.fullName) score += 1
        if (profile.targetCountry) score += 1
        if (profile.intendedCourse) score += 1
        if (profile.budgetRange) score += 1
        if (metadata.intakeYear) score += 1
        if (metadata.examsTaken) score += 1
        if (metadata.shortGoal) score += 1

        return Math.round((score / totalFields) * 100)
    }

    const completeness = calculateCompleteness(userProfile)
    const canConnect = completeness >= 70

    const [requestStatus, setRequestStatus] = useState(null)
    const [connecting, setConnecting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return
            if (MOCK_MENTORS.find(m => m.id === id)) return

            if (mentor && mentor.userId) {
                const { data: reqData } = await supabase
                    .from('GuidanceRequest')
                    .select('status')
                    .eq('aspirantId', user.id)
                    .eq('mentorId', mentor.userId)
                    .single()

                if (reqData) setRequestStatus(reqData.status)

                const { data: savedData } = await supabase
                    .from('SavedMentor')
                    .select('id')
                    .eq('aspirantId', user.id)
                    .eq('mentorId', mentor.userId)
                    .single()

                if (savedData) setIsSaved(true)
            }
        }

        checkStatus()
    }, [user, id, mentor])

    const handleSave = async () => {
        if (!user || !mentor || !mentor.userId) return
        if (MOCK_MENTORS.find(m => m.id === id)) {
            alert("You can only save real mentors.")
            return
        }

        if (isSaved) {
            const { error } = await supabase
                .from('SavedMentor')
                .delete()
                .eq('aspirantId', user.id)
                .eq('mentorId', mentor.userId)
            if (!error) setIsSaved(false)
        } else {
            const { error } = await supabase
                .from('SavedMentor')
                .insert({
                    id: crypto.randomUUID(),
                    aspirantId: user.id,
                    mentorId: mentor.userId
                })
            if (!error) setIsSaved(true)
        }
    }

    const handleConnect = async () => {
        if (!user || !mentor) return

        if (MOCK_MENTORS.find(m => m.id === id)) {
            alert("This is a demo mentor. You can only send requests to real mentors.")
            return
        }

        if (!mentor.userId) {
            alert("Error: Invalid mentor profile (missing User ID).")
            return
        }

        setConnecting(true)
        const { error } = await supabase
            .from('GuidanceRequest')
            .insert({
                id: crypto.randomUUID(),
                aspirantId: user.id,
                mentorId: mentor.userId,
                status: 'PENDING',
                updatedAt: new Date().toISOString()
            })

        if (error) {
            console.error('Error sending request:', error)
            alert('Failed to send request: ' + error.message)
        } else {
            setRequestStatus('PENDING')
        }
        setConnecting(false)
    }

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
    }

    if (!mentor) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Mentor not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Return to Dashboard</button>
                </div>
            </div>
        )
    }

    const verificationStatus = mentor.verificationStatus || mentor.metadata?.verificationStatus || 'UNVERIFIED'
    const isVerified = verificationStatus === 'VERIFIED'
    const stats = mentor.stats || { questionsAnswered: 0, requestsAccepted: 0, conversationsHelped: 0 }

    // Parse help tags safely
    let helpTags = []
    if (mentor.helpTags) {
        helpTags = Array.isArray(mentor.helpTags) ? mentor.helpTags : mentor.helpTags.split(',')
    } else if (mentor.metadata?.helpTags) {
        helpTags = Array.isArray(mentor.metadata.helpTags) ? mentor.metadata.helpTags : mentor.metadata.helpTags.split(',')
    }

    // Parse joined date
    const joinedDate = mentor.joinedAt || mentor.metadata?.joinedAt ? new Date(mentor.joinedAt || mentor.metadata.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Subtle background graphic */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {/* Main Profile Card */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                    {/* Verification Strip (Mobile) */}
                    {isVerified && (
                        <div className="md:hidden bg-green-900/20 border-b border-green-500/20 py-2 px-6 flex items-center gap-2 text-green-400 text-sm font-bold justify-center">
                            <ShieldCheck className="w-4 h-4" /> Verified Mentor
                        </div>
                    )}

                    <div className="p-8 md:p-12 grid md:grid-cols-[300px_1fr] gap-12">
                        {/* Left Column: Avatar & Quick Info */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                                    <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-5xl font-bold">
                                        {mentor.fullName.charAt(0)}
                                    </div>
                                </div>
                                {isVerified && (
                                    <div className="absolute bottom-2 right-2 md:right-4 bg-[#0A0A0A] p-1.5 rounded-full border border-white/10 shadow-lg" title="Identity Verified">
                                        <div className="bg-green-500 rounded-full p-1">
                                            <CheckCircle2 className="w-4 h-4 text-black" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{mentor.fullName}</h1>
                                {isVerified ? (
                                    <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider cursor-help" title="University email verified.">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 italic">Unverified Profile</span>
                                )}
                                <p className="text-gray-400 text-sm mt-3 flex items-center justify-center md:justify-start gap-2">
                                    <CalendarIcon className="w-4 h-4" /> Member since {joinedDate}
                                </p>
                            </div>

                            <div className="w-full space-y-3 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span>{mentor.currentCountry}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <GraduationCap className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span>{mentor.university}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <BookOpen className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span>{mentor.course}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Credibility & Content */}
                        <div className="space-y-10">
                            {/* Trust Signals / Activity Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.questionsAnswered}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium">Questions<br />Answered</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.requestsAccepted}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium">Requests<br />Accepted</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.conversationsHelped}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium">People<br />Helped</div>
                                </div>
                            </div>

                            {/* Experience Summary */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-white">Experience Summary</h3>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    {mentor.bio || "This mentor hasn't added a summary yet, but they are verified to be studying at the stated university."}
                                </p>
                            </div>

                            {/* I Can Help With */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-secondary" />
                                    <h3 className="text-lg font-bold text-white">I can help with</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {helpTags.length > 0 ? (
                                        helpTags.map(tag => (
                                            <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                                                {tag.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic text-sm">No specific topics listed.</span>
                                    )}
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                {!canConnect && (
                                    <div className="flex items-center gap-3 text-orange-400 text-xs bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        Complete your profile to 70% to connect
                                    </div>
                                )}

                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={handleSave}
                                        className={`flex-1 md:flex-none py-3 px-6 rounded-xl border font-semibold transition-all flex items-center justify-center gap-2 ${isSaved ? 'bg-white text-black border-white hover:bg-gray-200' : 'bg-transparent text-white border-white/20 hover:bg-white/5'}`}
                                    >
                                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                        {isSaved ? 'Saved' : 'Save'}
                                    </button>

                                    <button
                                        onClick={handleConnect}
                                        disabled={!canConnect || requestStatus === 'PENDING' || requestStatus === 'ACCEPTED' || connecting}
                                        className={`
                                            flex-[2] md:flex-none py-3 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                            ${requestStatus === 'ACCEPTED' ? 'bg-green-500 text-black cursor-default' :
                                                requestStatus === 'PENDING' ? 'bg-white/10 text-white cursor-default' :
                                                    !canConnect ? 'bg-primary/20 text-gray-400 cursor-not-allowed' :
                                                        'bg-primary text-black hover:bg-primary/90'}
                                        `}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        {requestStatus === 'ACCEPTED' ? 'Chat Open' :
                                            requestStatus === 'PENDING' ? 'Request Sent' :
                                                connecting ? 'Sending...' : 'Request Guidance'}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
