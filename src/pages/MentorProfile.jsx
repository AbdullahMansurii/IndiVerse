import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_MENTORS } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, BookOpen, GraduationCap, Globe, Mail, MessageSquare, Bookmark, Star, Clock } from 'lucide-react'
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
        const totalFields = 7 // fullName, targetCountry, intendedCourse, budgetRange, intakeYear, examsTaken, shortGoal

        // Unpack metadata
        const metadata = profile.metadata || {}

        if (profile.fullName) score += 1
        if (profile.targetCountry) score += 1
        if (profile.intendedCourse) score += 1
        if (profile.budgetRange) score += 1

        // Check metadata fields
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
            // Skip for mock mentors
            if (MOCK_MENTORS.find(m => m.id === id)) return

            // Check Connect Status
            if (mentor && mentor.userId) {
                const { data: reqData } = await supabase
                    .from('GuidanceRequest')
                    .select('status')
                    .eq('aspirantId', user.id)
                    .eq('mentorId', mentor.userId)
                    .single()

                if (reqData) setRequestStatus(reqData.status)

                // Check Saved Status
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
            // Unsave
            const { error } = await supabase
                .from('SavedMentor')
                .delete()
                .eq('aspirantId', user.id)
                .eq('mentorId', mentor.userId)

            if (!error) setIsSaved(false)
        } else {
            // Save
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

        // Mock mentor handling
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
                mentorId: mentor.userId, // Use User ID
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
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-primary hover:underline"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="glass-card rounded-3xl overflow-hidden">
                    {/* Header/Banner Area */}
                    <div className="h-48 bg-gradient-to-r from-primary/20 via-purple-900/20 to-secondary/20 relative">
                        <div className="absolute -bottom-16 left-8 md:left-12">
                            <div className="w-32 h-32 rounded-full bg-black p-1">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold">
                                    {mentor.fullName.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 md:px-12 pb-12">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{mentor.fullName}</h1>
                                <div className="flex items-center gap-2 text-secondary font-medium">
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                    Verified Mentor
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {!canConnect && (
                                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 max-w-sm text-right">
                                        <p className="text-orange-400 text-sm font-medium mb-1">Incomplete Profile ({completeness}%)</p>
                                        <p className="text-xs text-gray-400 mb-2">Complete your profile to at least 70% to connect.</p>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="text-xs text-white underline hover:text-primary"
                                        >
                                            Complete Profile
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    {/* Bookmark Button */}
                                    <button
                                        onClick={handleSave}
                                        className={`p-3 rounded-xl border transition-colors ${isSaved
                                            ? 'bg-white/10 text-primary border-primary/50'
                                            : 'bg-transparent text-gray-400 border-white/10 hover:text-white'
                                            }`}
                                        title={isSaved ? "Unsave Mentor" : "Save Mentor"}
                                    >
                                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                    </button>

                                    <button
                                        onClick={handleConnect}
                                        disabled={!canConnect || requestStatus === 'PENDING' || requestStatus === 'ACCEPTED' || connecting}
                                        className={`
                                            font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2
                                            ${requestStatus === 'ACCEPTED' ? 'bg-green-500 text-black cursor-default' :
                                                requestStatus === 'PENDING' ? 'bg-white/10 text-white cursor-default' :
                                                    !canConnect ? 'bg-primary/50 text-black cursor-not-allowed' :
                                                        'bg-primary hover:bg-primary/90 text-black'}
                                        `}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        {requestStatus === 'ACCEPTED' ? 'Connected' :
                                            requestStatus === 'PENDING' ? 'Requested' :
                                                connecting ? 'Sending...' : 'Connect Now'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-200 border-b border-white/10 pb-4">Academic Profile</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">University</p>
                                            <p className="font-lg font-medium">{mentor.university}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Course</p>
                                            <p className="font-lg font-medium">{mentor.course}</p>
                                        </div>
                                    </div>

                                    {/* Expertise */}
                                    {mentor.metadata?.expertise && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                <Star className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Expertise</p>
                                                <p className="font-lg font-medium">{mentor.metadata.expertise}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-200 border-b border-white/10 pb-4">Location & Details</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Current Location</p>
                                            <p className="font-lg font-medium">{mentor.currentCountry}</p>
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    {mentor.metadata?.languages && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                <Globe className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Languages</p>
                                                <p className="font-lg font-medium">{mentor.metadata.languages}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability */}
                                    {mentor.metadata?.availability && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Availability</p>
                                                <p className="font-lg font-medium">{mentor.metadata.availability} / week</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio Section - Full Width */}
                            {mentor.bio && (
                                <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/10">
                                    <h3 className="text-xl font-bold text-gray-200">About Me</h3>
                                    <p className="text-gray-300 leading-relaxed max-w-3xl">
                                        {mentor.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
