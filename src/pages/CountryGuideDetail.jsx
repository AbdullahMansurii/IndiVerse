import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { supabase } from '../lib/supabase'
import { COUNTRY_GUIDES } from '../lib/countryData'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Coins, FileText, GraduationCap, MapPin } from 'lucide-react'

export default function CountryGuideDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [mentors, setMentors] = useState([])
    const [loadingMentors, setLoadingMentors] = useState(true)

    const country = COUNTRY_GUIDES.find(c => c.slug === slug)

    useEffect(() => {
        if (!country) return
        fetchMentors()
    }, [country])

    const fetchMentors = async () => {
        setLoadingMentors(true)
        // Fetch mentors whose currentCountry matches the guide's name
        // Using ilike for case-insensitive partial match to be safe (e.g. "USA" vs "United States")
        // But for exact matches based on our mock data, let's try exact first or specific mapping.

        let searchTerm = country.name // Default
        if (country.slug === 'usa') searchTerm = 'USA'
        if (country.slug === 'uk') searchTerm = 'United Kingdom' // Matches mock data

        const { data, error } = await supabase
            .from('Profile')
            .select('*')
            .eq('isMentor', true)
            .ilike('currentCountry', `%${searchTerm}%`)

        if (data) {
            setMentors(data)
        }
        setLoadingMentors(false)
    }

    if (!country) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl text-white mb-4">Guide not found</h2>
                    <Link to="/guides" className="text-primary hover:underline">Back to Guides</Link>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <button
                    onClick={() => navigate('/guides')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Guides
                </button>

                {/* Hero */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img src={country.image} alt={country.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-8 left-8 z-20">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-6xl">{country.flag}</span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">{country.name}</h1>
                        </div>
                        <p className="text-xl text-gray-300 max-w-2xl">{country.brief}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <section className="glass-card p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" /> Overview
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {country.overview}
                            </p>
                        </section>

                        {/* Universities */}
                        <section className="glass-card p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-secondary" /> Top Universities
                            </h2>
                            <ul className="grid gap-3">
                                {country.universities.map((uni, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                        {uni}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Visa Info */}
                        <section className="glass-card p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" /> Visa & Work Rights
                            </h2>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-gray-400 mb-1">Visa Type</div>
                                        <div className="text-white font-medium">{country.visa.type}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-gray-400 mb-1">Post-Study Work</div>
                                        <div className="text-white font-medium">{country.visa.postStudyWork}</div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-300 mb-2">Key Requirements:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {country.visa.requirements.map((req, i) => (
                                            <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Cost */}
                        <section className="glass-card p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-green-400" /> Estimated Costs
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-400 mb-1">Tuition Fees</div>
                                    <div className="text-white font-medium">{country.cost.tuition}</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-400 mb-1">Living Expenses</div>
                                    <div className="text-white font-medium">{country.cost.living}</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Mentors Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 rounded-2xl border border-white/10 sticky top-6">
                            <h2 className="text-lg font-bold text-white mb-4">Mentors in {country.name}</h2>

                            {loadingMentors ? (
                                <div className="text-center text-gray-500 py-8">Loading mentors...</div>
                            ) : mentors.length === 0 ? (
                                <div className="text-center text-gray-500 py-8 bg-white/5 rounded-xl">
                                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No mentors found in this region yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mentors.map(mentor => (
                                        <Link key={mentor.id} to={`/mentor/${mentor.id}`}>
                                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                                                    {mentor.fullName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-white truncate">{mentor.fullName}</h3>
                                                    <p className="text-xs text-gray-400 truncate">{mentor.university}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link to="/dashboard" className="block text-center text-primary text-sm font-bold mt-4 hover:underline">
                                        View All Mentors
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
