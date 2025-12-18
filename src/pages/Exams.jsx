import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, BookOpen, Clock, Award, ChevronRight, ExternalLink, StickyNote, CheckCircle, ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { EXAMS } from '../lib/examData'

export default function Exams() {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedExamId, setSelectedExamId] = useState(EXAMS[0]?.id || 'ielts')

    // Handle initial selection from navigation state if passed
    useEffect(() => {
        if (location.state?.selectedExamId) {
            setSelectedExamId(location.state.selectedExamId)
        }
    }, [location.state])

    const selectedExam = EXAMS.find(e => e.id === selectedExamId)

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Sidebar (Desktop) / Topbar (Mobile) */}
            <div className="w-full md:w-80 border-r border-white/10 bg-black/50 backdrop-blur-xl md:h-screen sticky top-0 md:overflow-y-auto z-20 shrink-0">
                <div className="p-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ChevronLeft className="w-5 h-5" /> Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-white mb-2">Exams Guide</h1>
                    <p className="text-xs text-gray-400">Everything you need to know about entrance tests.</p>
                </div>

                <div className="px-3 pb-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
                    {EXAMS.map(exam => (
                        <button
                            key={exam.id}
                            onClick={() => setSelectedExamId(exam.id)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left group whitespace-nowrap md:whitespace-normal min-w-[200px] md:min-w-0 ${selectedExamId === exam.id
                                ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${selectedExamId === exam.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10'}`}>
                                {exam.id.substring(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <div className="font-bold">{exam.label}</div>
                                <div className="text-[10px] opacity-60 truncate max-w-[120px] hidden md:block">{exam.fullName}</div>
                            </div>
                            {selectedExamId === exam.id && <ChevronRight className="w-4 h-4 ml-auto hidden md:block" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                    {selectedExam && (
                        <motion.div
                            key={selectedExam.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-6 md:p-12 max-w-5xl mx-auto space-y-10"
                        >
                            {/* Header Widget */}
                            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20">
                                            Standardized Test
                                        </span>
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <Globe className="w-3 h-3" /> International
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{selectedExam.fullName} ({selectedExam.label})</h2>
                                    <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                                        {selectedExam.description}
                                        Most widely accepted across UK, USA, Canada, and Australia for university admissions.
                                    </p>
                                </div>
                            </div>

                            {/* Info Grid (Mock Data for now as structure is key) */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-400 text-sm">Duration</h3>
                                    <p className="text-xl font-bold text-white">~ 2.5 - 3 Hours</p>
                                </div>
                                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-400 text-sm">Score Validity</h3>
                                    <p className="text-xl font-bold text-white">2 Years</p>
                                </div>
                                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <StickyNote className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-400 text-sm">Format</h3>
                                    <p className="text-xl font-bold text-white">Paper / Computer</p>
                                </div>
                            </div>

                            {/* Accepting Universities Section */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-red-500" /> Top Accepting Universities
                                </h3>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedExam.universities.map((uni, idx) => (
                                        <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-white/20 transition-all group">
                                            <div className="text-2xl bg-white/5 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {uni.countryFlag}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{uni.name}</h4>
                                                <p className="text-xs text-gray-400">{uni.country}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <div className="text-[10px] text-gray-500 uppercase">Min Score</div>
                                                <div className="text-red-400 font-bold text-sm">{uni.minScore}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mock 'More' Cards */}
                                    <div className="glass-card p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-gray-500 text-xs">
                                        + Many more global institutions
                                    </div>
                                </div>
                            </div>

                            {/* Preparation Resources */}
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white mb-1">Ready to prepare?</h4>
                                    <p className="text-sm text-gray-400">Find mentors who aced {selectedExam.label} to guide you.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Find Mentors
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
