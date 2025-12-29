import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../layouts/AdminLayout'
import { Check, X, ExternalLink, ShieldAlert, Filter } from 'lucide-react'

export default function AdminVerifications() {
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('PENDING') // 'ALL', 'PENDING', 'VERIFIED', 'UNVERIFIED'

    useEffect(() => {
        fetchMentors()
    }, [])

    const fetchMentors = async () => {
        try {
            // Fetch ALL mentors
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('isStudyingAbroad', true)
                .order('created_at', { ascending: false }) // Optional: if column existed, but since it doesn't, we might not sort or sort by name

            if (error) throw error

            setMentors(data || [])
        } catch (error) {
            console.error('Error fetching mentors:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVerification = async (profileId, status) => {
        if (!confirm(`Are you sure you want to ${status === 'VERIFIED' ? 'verify' : 'reject'} this mentor?`)) return

        try {
            // Optimistic update
            setMentors(prev => prev.map(m =>
                m.id === profileId
                    ? { ...m, metadata: { ...m.metadata, verificationStatus: status } }
                    : m
            ))

            // Database update
            const { data: currentProfile } = await supabase
                .from('Profile')
                .select('metadata')
                .eq('id', profileId)
                .single()

            const updatedMetadata = {
                ...(currentProfile.metadata || {}),
                verificationStatus: status
            }

            const { error } = await supabase
                .from('Profile')
                .update({ metadata: updatedMetadata })
                .eq('id', profileId)

            if (error) throw error

            alert(`Mentor ${status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`)

        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
            fetchMentors() // Revert on error
        }
    }

    const filteredMentors = mentors.filter(m => {
        const status = m.metadata?.verificationStatus || 'UNVERIFIED'
        if (filter === 'ALL') return true
        if (filter === 'PENDING') return status === 'PENDING'
        if (filter === 'VERIFIED') return status === 'VERIFIED'
        if (filter === 'UNVERIFIED') return status === 'UNVERIFIED' || !status // Treat missing status as unverified
        return true
    })

    const DetailRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className="text-white font-medium text-right sm:text-left">{value || '-'}</span>
        </div>
    )

    const TabButton = ({ value, label, count }) => (
        <button
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === value
                    ? 'bg-primary text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
        >
            {label} {count !== undefined && <span className="opacity-60 ml-1">({count})</span>}
        </button>
    )

    // Calculate counts
    const counts = {
        ALL: mentors.length,
        PENDING: mentors.filter(m => m.metadata?.verificationStatus === 'PENDING').length,
        VERIFIED: mentors.filter(m => m.metadata?.verificationStatus === 'VERIFIED').length,
        UNVERIFIED: mentors.filter(m => (m.metadata?.verificationStatus || 'UNVERIFIED') === 'UNVERIFIED').length
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mentor Verifications</h1>
                <p className="text-gray-400 mt-2">Review and verify mentor credentials.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                <TabButton value="PENDING" label="Pending" count={counts.PENDING} />
                <TabButton value="VERIFIED" label="Verified" count={counts.VERIFIED} />
                <TabButton value="UNVERIFIED" label="Rejected/New" count={counts.UNVERIFIED} />
                <TabButton value="ALL" label="All Mentors" count={counts.ALL} />
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : filteredMentors.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center opacity-70">
                    <Filter className="w-16 h-16 text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white">No mentors found</h3>
                    <p className="text-gray-400 mt-2">No mentors match the selected filter.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredMentors.map(mentor => {
                        const status = mentor.metadata?.verificationStatus || 'UNVERIFIED'
                        return (
                            <div key={mentor.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col lg:flex-row gap-6 relative overflow-hidden">
                                {/* Status Badge */}
                                <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold ${status === 'VERIFIED' ? 'bg-green-500/20 text-green-500' :
                                        status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                                            'bg-red-500/20 text-red-500'
                                    } rounded-bl-xl`}>
                                    {status}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-black uppercase">
                                            {mentor.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{mentor.fullName}</h3>
                                            <p className="text-primary text-sm">{mentor.university}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 bg-white/5 p-4 rounded-xl">
                                        <DetailRow label="Course" value={mentor.course} />
                                        <DetailRow label="Country" value={mentor.currentCountry} />
                                        <DetailRow label="Year" value={mentor.yearOfStudy} />
                                        <DetailRow label="LinkedIn" value={
                                            mentor.metadata?.linkedin ? (
                                                <a href={mentor.metadata.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                                                    View Profile <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : 'Not provided'
                                        } />
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Bio</span>
                                        <p className="text-gray-300 text-sm leading-relaxed">{mentor.bio}</p>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6 min-w-[200px]">
                                    {status !== 'VERIFIED' && (
                                        <button
                                            onClick={() => handleVerification(mentor.id, 'VERIFIED')}
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-xl transition-all"
                                        >
                                            <Check className="w-5 h-5" /> Verify
                                        </button>
                                    )}
                                    {status !== 'UNVERIFIED' && (
                                        <button
                                            onClick={() => handleVerification(mentor.id, 'UNVERIFIED')}
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 px-4 rounded-xl border border-red-500/20 transition-all"
                                        >
                                            <X className="w-5 h-5" /> Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </AdminLayout>
    )
}
