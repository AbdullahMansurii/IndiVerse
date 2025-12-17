import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, MessageSquare, User } from 'lucide-react'

export default function GuidanceRequests() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('PENDING')
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState(null) // 'ASPIRANT' or 'MENTOR' based on usage

    useEffect(() => {
        if (user) {
            fetchUserRoleAndRequests()
        }
    }, [user, activeTab])

    const fetchUserRoleAndRequests = async () => {
        setLoading(true)

        // 1. Determine Role
        const { data: profile } = await supabase
            .from('Profile')
            .select('isStudyingAbroad')
            .eq('userId', user.id)
            .single()

        const role = profile?.isStudyingAbroad ? 'MENTOR' : 'ASPIRANT'
        setUserRole(role)

        // 2. Fetch Requests
        let query = supabase
            .from('GuidanceRequest')
            .select('*') // removed incorrect joins
            .eq('status', activeTab)

        if (role === 'ASPIRANT') {
            query = query.eq('aspirantId', user.id)
        } else {
            query = query.eq('mentorId', user.id)
        }

        const { data: requestsData, error: requestError } = await query

        if (requestError) {
            console.error('Error fetching requests:', requestError)
            setRequests([])
        } else {
            // 3. Manually fetch profiles for related users
            const relatedUserIds = requestsData.map(r => role === 'ASPIRANT' ? r.mentorId : r.aspirantId)
            const uniqueIds = [...new Set(relatedUserIds)]

            if (uniqueIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('Profile')
                    .select('userId, fullName, targetCountry, intendedCourse, university, course')
                    .in('userId', uniqueIds)

                // 4. Merge profile data into requests
                const enrichedRequests = requestsData.map(req => {
                    const relatedId = role === 'ASPIRANT' ? req.mentorId : req.aspirantId
                    const profile = profiles?.find(p => p.userId === relatedId)

                    if (role === 'ASPIRANT') {
                        return { ...req, mentor: profile }
                    } else {
                        return { ...req, aspirant: profile }
                    }
                })
                setRequests(enrichedRequests)
            } else {
                setRequests(requestsData)
            }
        }
        setLoading(false)
    }

    const handleAction = async (requestId, newStatus) => {
        const { error } = await supabase
            .from('GuidanceRequest')
            .update({
                status: newStatus,
                updatedAt: new Date().toISOString()
            })
            .eq('id', requestId)

        if (error) {
            alert('Error updating request: ' + error.message)
        } else {
            // Remove from current view (since tab filters by status)
            setRequests(prev => prev.filter(r => r.id !== requestId))
        }
    }

    const tabs = [
        { id: 'PENDING', label: 'Pending' },
        { id: 'ACCEPTED', label: 'Accepted' },
        { id: 'REJECTED', label: 'Rejected' }
    ]

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Guidance Requests</h1>
                    <p className="text-gray-400">Manage your mentorship connections and requests.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-gray-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No {activeTab.toLowerCase()} requests found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {requests.map(request => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    {/* Info Section */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <User className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {userRole === 'ASPIRANT'
                                                    ? request.mentor?.fullName // If I am Aspirant, show Mentor Name
                                                    : request.aspirant?.fullName // If I am Mentor, show Aspirant Name
                                                }
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {userRole === 'ASPIRANT'
                                                    ? `${request.mentor?.university} • ${request.mentor?.course}`
                                                    : `${request.aspirant?.intendedCourse} in ${request.aspirant?.targetCountry}`
                                                }
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex items-center gap-3">
                                        {userRole === 'MENTOR' && activeTab === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(request.id, 'REJECTED')}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request.id, 'ACCEPTED')}
                                                    className="py-2 px-4 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors"
                                                >
                                                    <Check className="w-4 h-4" /> Accept
                                                </button>
                                            </>
                                        )}

                                        {/* Status Badges for non-actionable states */}
                                        {(userRole === 'ASPIRANT' || activeTab !== 'PENDING') && (
                                            <div className="flex items-center gap-3">
                                                {request.status === 'ACCEPTED' && (
                                                    <Link
                                                        to={`/requests/${request.id}`}
                                                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
                                                    >
                                                        <MessageSquare className="w-4 h-4" /> Open Conversation
                                                    </Link>
                                                )}
                                                <div className={`px-4 py-2 rounded-full text-xs font-bold ${request.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                                    request.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {request.status}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
