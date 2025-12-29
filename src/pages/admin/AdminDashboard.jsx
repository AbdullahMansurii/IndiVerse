import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../layouts/AdminLayout'
import { Users, GraduationCap, CheckCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMentors: 0,
        pendingVerifications: 0,
        verifiedMentors: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Fetch separate counts concurrently for speed
            const queries = [
                supabase.from('Profile').select('*', { count: 'exact', head: true }), // Total Profiles
                supabase.from('Profile').select('*', { count: 'exact', head: true }).eq('isStudyingAbroad', true), // Mentors
                supabase.from('Profile').select('*', { count: 'exact', head: true }).eq('metadata->>verificationStatus', 'PENDING'), // Pending
                supabase.from('Profile').select('*', { count: 'exact', head: true }).eq('metadata->>verificationStatus', 'VERIFIED'), // Verified
            ]

            const results = await Promise.all(queries)

            setStats({
                totalUsers: results[0].count || 0,
                totalMentors: results[1].count || 0,
                pendingVerifications: results[2].count || 0,
                verifiedMentors: results[3].count || 0
            })
        } catch (error) {
            console.error('Error fetching admin stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
                <div className={`inline-flex items-center p-2 rounded-lg bg-white/5 ${color.replace('text-', 'text-opacity-80 text-')}`}>
                    <Icon className="w-4 h-4 mr-2" />
                    <span>Overview</span>
                </div>
            </div>
        </div>
    )

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading stats...</div>

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 mt-2">Welcome back, Administrator.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-blue-500"
                />
                <StatCard
                    title="Total Mentors"
                    value={stats.totalMentors}
                    icon={GraduationCap}
                    color="text-purple-500"
                />
                <StatCard
                    title="Pending Verifications"
                    value={stats.pendingVerifications}
                    icon={Clock}
                    color="text-orange-500"
                />
                <StatCard
                    title="Verified Mentors"
                    value={stats.verifiedMentors}
                    icon={CheckCircle}
                    color="text-green-500"
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-white/5 hover:border-primary/30">
                        <h3 className="font-bold text-lg mb-2 text-primary">Verify Mentors</h3>
                        <p className="text-gray-400 text-sm">Review pending verification requests from new mentors.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
