import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, DollarSign, Globe, ExternalLink, GraduationCap, ChevronLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SCHOLARSHIPS } from '../lib/scholarshipData'

const COUNTRIES = ['All', 'USA', 'United Kingdom', 'Canada', 'Germany', 'Australia']

export default function Scholarships() {
    const navigate = useNavigate()
    const [selectedCountry, setSelectedCountry] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredScholarships = useMemo(() => {
        return SCHOLARSHIPS.filter(scholarship => {
            const matchesCountry = selectedCountry === 'All' || scholarship.country === selectedCountry
            const matchesSearch = scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scholarship.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            return matchesCountry && matchesSearch
        })
    }, [selectedCountry, searchQuery])

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
                    >
                        Global Scholarships <span className="text-secondary">2024-25</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Discover fully funded and merit-based opportunities in top study destinations.
                        We've curated the best scholarships to help fund your dream.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between sticky top-4 z-10 glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-xl">

                    {/* Country Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                        {COUNTRIES.map(country => (
                            <button
                                key={country}
                                onClick={() => setSelectedCountry(country)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCountry === country
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {country === 'All' ? <Globe className="w-4 h-4 inline mr-2" /> : null}
                                {country}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search scholarships, providers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredScholarships.map((scholarship) => (
                            <motion.div
                                layout
                                key={scholarship.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />

                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                                        <span className="text-3xl" role="img" aria-label="flag">{scholarship.flag}</span>
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                                        {scholarship.type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {scholarship.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4">{scholarship.provider}</p>

                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <DollarSign className="w-4 h-4 text-green-400 shrink-0" />
                                        <span className="font-medium">{scholarship.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                                        <span>Deadline: {scholarship.deadline}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {scholarship.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={scholarship.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full py-3 rounded-xl bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary transition-all font-bold text-sm flex items-center justify-center gap-2 group/btn"
                                >
                                    View Details <ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredScholarships.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-bold text-white">No scholarships found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    )
}
