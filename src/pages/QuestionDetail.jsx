import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Clock, MapPin, Award, Send, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function QuestionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [question, setQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const [loading, setLoading] = useState(true)
    const [newAnswer, setNewAnswer] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [userRole, setUserRole] = useState(null) // 'ASPIRANT' or 'MENTOR'
    const [authorProfile, setAuthorProfile] = useState(null)

    useEffect(() => {
        if (user && id) {
            fetchQuestionDetails()
        }
    }, [user, id])

    const fetchQuestionDetails = async () => {
        setLoading(true)

        // 0. Get User Role
        const { data: uData } = await supabase.from('User').select('role').eq('id', user.id).single()
        setUserRole(uData?.role)

        // 1. Fetch Question
        const { data: qData, error: qError } = await supabase
            .from('Question')
            .select('*')
            .eq('id', id)
            .single()

        if (qError) {
            console.error('Error fetching question:', qError)
            setLoading(false)
            return
        }

        // 2. Fetch Author Profile (Aspirant)
        const { data: authProfile } = await supabase
            .from('Profile')
            .select('*')
            .eq('userId', qData.authorId)
            .single()

        setQuestion(qData)
        setAuthorProfile(authProfile)

        // 3. Fetch Answers
        const { data: aData, error: aError } = await supabase
            .from('Answer')
            .select('*')
            .eq('questionId', id)
            .order('isPinned', { ascending: false }) // Pinned first
            .order('createdAt', { ascending: true }) // Then chronological

        if (aData) {
            // Need to fetch Mentor profiles for these answers
            const mentorIds = [...new Set(aData.map(a => a.authorId))]
            if (mentorIds.length > 0) {
                const { data: mentors } = await supabase
                    .from('Profile')
                    .select('userId, fullName, university, course, currentCountry')
                    .in('userId', mentorIds)

                // Merge profile into answer
                const enrichedAnswers = aData.map(ans => ({
                    ...ans,
                    author: mentors?.find(m => m.userId === ans.authorId)
                }))
                setAnswers(enrichedAnswers)
            } else {
                setAnswers(aData)
            }
        }
        setLoading(false)
    }

    const handleSubmitAnswer = async (e) => {
        e.preventDefault()
        if (!newAnswer.trim()) return

        setSubmitting(true)
        const { error } = await supabase
            .from('Answer')
            .insert({
                id: crypto.randomUUID(),
                content: newAnswer,
                questionId: id,
                authorId: user.id,
                isPinned: false
            })

        if (error) {
            alert('Failed to post answer: ' + error.message)
        } else {
            setNewAnswer('')
            fetchQuestionDetails() // Refresh
        }
        setSubmitting(false)
    }

    const handlePinAnswer = async (answerId) => {
        // Only author can pin
        if (question.authorId !== user.id) return

        // Unpin all others first (optional, ensures only one best answer)
        await supabase.from('Answer').update({ isPinned: false }).eq('questionId', id)

        // Pin this one
        const { error } = await supabase
            .from('Answer')
            .update({ isPinned: true })
            .eq('id', answerId)

        if (error) {
            alert('Error updating answer: ' + error.message)
        } else {
            fetchQuestionDetails()
        }
    }

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>

    if (!question) return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Question not found</h1>
            <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
        </div>
    )

    const isAuthor = question.authorId === user.id
    const hasBestAnswer = answers.some(a => a.isPinned)
    const userHasAnswered = answers.some(a => a.authorId === user.id)

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Discussions
                </button>

                {/* Question Card */}
                <div className="glass-card p-8 rounded-2xl border-l-4 border-primary">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {authorProfile?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{authorProfile?.fullName || 'Anonymous'}</h3>
                                <p className="text-xs text-gray-400">
                                    Aspirant • {authorProfile?.targetCountry ? `Targeting ${authorProfile.targetCountry}` : 'Exploring'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                        {question.title}
                    </h1>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                        {question.content}
                    </p>

                    <div className="flex gap-2">
                        {/* Tags placeholder if we had them */}
                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                            Study Abroad
                        </span>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                        </h2>
                    </div>

                    {answers.length === 0 ? (
                        <div className="text-center py-12 glass-card rounded-2xl border-dashed border-white/20">
                            <p className="text-gray-400">No answers yet. Mentors will respond soon.</p>
                        </div>
                    ) : (
                        answers.map(answer => (
                            <motion.div
                                key={answer.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass-card p-6 rounded-2xl ${answer.isPinned
                                    ? 'border border-green-500/50 bg-green-500/5'
                                    : 'border border-white/10'
                                    }`}
                            >
                                {answer.isPinned && (
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold mb-4 bg-green-500/10 w-fit px-3 py-1 rounded-full">
                                        <Award className="w-4 h-4" /> Best Answer
                                    </div>
                                )}

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                                        {answer.author?.fullName?.charAt(0) || 'M'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                {answer.author?.fullName || 'Mentor'}
                                            </h3>
                                            {(answer.author?.verificationStatus === 'VERIFIED' || answer.author?.metadata?.verificationStatus === 'VERIFIED') && (
                                                <div className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                                                    <ShieldCheck className="w-3 h-3" /> Verified Student
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {answer.author?.university} • {answer.author?.currentCountry}
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {new Date(answer.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {answer.content}
                                </div>

                                {isAuthor && !answer.isPinned && (
                                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                                        <button
                                            onClick={() => handlePinAnswer(answer.id)}
                                            className="text-sm text-gray-400 hover:text-green-400 flex items-center gap-2 transition-colors"
                                        >
                                            <Award className="w-4 h-4" /> Mark as Best Answer
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Answer Input (Mentors Only) */}
                {userRole === 'MENTOR' && !userHasAnswered && (
                    <div className="glass-card p-6 rounded-2xl border border-white/10 sticky bottom-6 bg-black/80 backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white mb-4">Write your answer</h3>
                        <form onSubmit={handleSubmitAnswer} className="space-y-4">
                            <textarea
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="Share your guidance clearly and professionally..."
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none h-32"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting || !newAnswer.trim()}
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitting ? 'Posting...' : 'Post Answer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
