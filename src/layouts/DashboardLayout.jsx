import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Home, LogOut, Menu, X, User, BookOpen, Settings, MessageSquare, MessageCircle, Bookmark, Map, Globe, HelpCircle, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardLayout({ children }) {
    const { user, signOut, isAdmin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('userId', user.id)
                .single()

            if (data) setProfile(data)
            setLoading(false)
        }
        fetchProfile()
    }, [user])

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const aspirantItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: MessageSquare, label: 'Guidance Requests', path: '/requests' },
        { icon: HelpCircle, label: 'Ask a Question', path: '/discussions' },
        { icon: Bookmark, label: 'Saved Mentors', path: '/saved-mentors' },
        { icon: Globe, label: 'Country Guides', path: '/guides' },
        { icon: User, label: 'My Profile', path: '/profile' },
    ]

    const mentorItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: MessageSquare, label: 'Guidance Requests', path: '/requests' },
        { icon: MessageCircle, label: 'Answer Questions', path: '/discussions' },
        { icon: User, label: 'My Profile', path: '/profile' },
    ]

    const items = profile?.isStudyingAbroad ? mentorItems : aspirantItems

    // Admin Link Injection
    if (isAdmin) {
        items.push({ icon: ShieldCheck, label: 'Admin Panel', path: '/admin' })
    }

    return (
        <div className="min-h-screen flex bg-background text-white selection:bg-primary selection:text-white relative overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 hidden md:flex flex-col relative z-20 bg-background/50 backdrop-blur-xl">
                <div className="p-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
                        Indiverse
                    </h1>
                    {profile && (
                        <div className="mt-2 px-2 py-1 bg-white/5 rounded text-xs text-gray-400 inline-block border border-white/5">
                            {profile.isStudyingAbroad ? 'Mentor Account' : 'Aspirant Account'}
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {loading ? (
                        // Loading skeleton for menu
                        [1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
                    ) : (
                        items.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                        />
                                    )}
                                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                                    <span className="relative z-10 font-medium">{item.label}</span>
                                </Link>
                            )
                        })
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10">
                {/* Background Effects */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
