import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, Plus, User, Clock, ChevronRight } from 'lucide-react'

export default function Discussions() {
    const { user } = useAuth()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAskModal, setShowAskModal] = useState(false)
    const [newQuestion, setNewQuestion] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [userRole, setUserRole] = useState('ASPIRANT')

    useEffect(() => {
        if (user) {
            fetchQuestions()
            checkUserRole()
        }
    }, [user])

    const checkUserRole = async () => {
        const { data } = await supabase
            .from('Profile')
            .select('isStudyingAbroad')
            .eq('userId', user.id)
            .single()

        if (data) setUserRole(data.isStudyingAbroad ? 'MENTOR' : 'ASPIRANT')
    }

    const fetchQuestions = async () => {
        setLoading(true)
        // Fetch Questions with Author Details
        // Since we can't easily join count in one query without a view/function, we might need a separate count or just list them.
        // For MVP, we'll fetch questions and then fetch profiles.

        const { data: qData, error } = await supabase
            .from('Question')
            .select('*')
            .order('createdAt', { ascending: false })

        if (error) {
            console.error('Error fetching questions:', error)
        } else if (qData) {
            // Fetch Authors
            const authorIds = [...new Set(qData.map(q => q.authorId))]
            const { data: profiles } = await supabase
                .from('Profile')
                .select('userId, fullName, targetCountry')
                .in('userId', authorIds)

            // Merge
            const enriched = qData.map(q => ({
                ...q,
                author: profiles?.find(p => p.userId === q.authorId)
            }))

            setQuestions(enriched)
        }
        setLoading(false)
    }

    const handleAskQuestion = async (e) => {
        e.preventDefault()
        if (!newQuestion.trim() || !newTitle.trim()) return

        setSubmitting(true)
        const { error } = await supabase
            .from('Question')
            .insert({
                id: crypto.randomUUID(),
                title: newTitle,
                content: newQuestion,
                authorId: user.id,
                // createdAt defaults to now
            })

        if (error) {
            alert('Failed to post question: ' + error.message)
        } else {
            setNewTitle('')
            setNewQuestion('')
            setShowAskModal(false)
            fetchQuestions() // Refresh
        }
        setSubmitting(false)
    }

    const filteredQuestions = questions.filter(q =>
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Discussions</h1>
                        <p className="text-gray-400">
                            {userRole === 'MENTOR'
                                ? "Share your expertise and guide aspirants."
                                : "Ask questions, share experiences, and get guidance."}
                        </p>
                    </div>
                    {userRole === 'ASPIRANT' && (
                        <button
                            onClick={() => setShowAskModal(true)}
                            className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" /> Ask Question
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                </div>

                {/* Questions Grid */}
                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading discussions...</div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-gray-400">No questions found. Be the first to ask!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredQuestions.map(q => (
                            <Link key={q.id} to={`/question/${q.id}`}>
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 text-xs text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full">
                                                    <User className="w-3 h-3" />
                                                    {q.author?.fullName || 'Anonymous'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(q.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {q.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-2">
                                                {q.content}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Ask Question Modal */}
            <AnimatePresence>
                {showAskModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg glass-card p-6 rounded-2xl border border-white/10"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Ask a Question</h2>
                            <form onSubmit={handleAskQuestion} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="e.g., How to apply for MS in CS?"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Details
                                    </label>
                                    <textarea
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="Elaborate on your question..."
                                        rows={5}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAskModal(false)}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-primary hover:bg-primary/90 text-black font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Posting...' : 'Post Question'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
