import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Trophy, ClipboardList, PenTool, Plane } from 'lucide-react'

export default function MyJourney() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [checklist, setChecklist] = useState({
        exams: false,
        sop: false,
        lor: false,
        applications: false
    })
    const [profileId, setProfileId] = useState(null)
    const [currentMetadata, setCurrentMetadata] = useState({})

    useEffect(() => {
        if (user) {
            fetchChecklist()
        }
    }, [user])

    const fetchChecklist = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('Profile')
            .select('id, metadata')
            .eq('userId', user.id)
            .single()

        if (data) {
            setProfileId(data.id)
            setCurrentMetadata(data.metadata || {})
            if (data.metadata?.journeyChecklist) {
                setChecklist(data.metadata.journeyChecklist)
            }
        }
        setLoading(false)
    }

    const toggleItem = async (key) => {
        const newChecklist = { ...checklist, [key]: !checklist[key] }
        setChecklist(newChecklist) // Optimistic update

        const newMetadata = {
            ...currentMetadata,
            journeyChecklist: newChecklist
        }

        const { error } = await supabase
            .from('Profile')
            .update({ metadata: newMetadata })
            .eq('userId', user.id)

        if (error) {
            console.error('Error updating checklist:', error)
            setChecklist(checklist) // Revert on error
            alert('Failed to update progress.')
        } else {
            setCurrentMetadata(newMetadata)
        }
    }

    const items = [
        { key: 'exams', label: 'Entrance Exams Done', icon: PenTool, desc: 'GRE, TOEFL, IELTS, etc.' },
        { key: 'sop', label: 'SOP Drafted', icon: ClipboardList, desc: 'Statement of Purpose ready.' },
        { key: 'lor', label: 'LORs Collected', icon: Trophy, desc: 'Letters of Recommendation secured.' },
        { key: 'applications', label: 'Applications Submitted', icon: Plane, desc: 'Universities applied to.' },
    ]

    const completedCount = Object.values(checklist).filter(Boolean).length
    const progress = Math.round((completedCount / items.length) * 100)

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Journey</h1>
                    <p className="text-gray-400">Track your milestones to your dream university.</p>
                </div>

                {/* Progress Card */}
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {progress === 100 ? "You're Ready to Fly! ✈️" : "Your Progress"}
                            </h2>
                            <p className="text-gray-400">
                                {completedCount} of {items.length} milestones completed
                            </p>
                        </div>
                        <div className="text-5xl font-bold text-primary">
                            {progress}%
                        </div>
                    </div>
                </div>

                {/* Checklist Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <motion.button
                            key={item.key}
                            onClick={() => toggleItem(item.key)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${checklist[item.key]
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'glass-card border-white/10 hover:border-white/30'
                                }`}
                        >
                            <div className={`p-3 rounded-full shrink-0 ${checklist[item.key] ? 'bg-primary text-black' : 'bg-white/5 text-gray-400'
                                }`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg mb-1 ${checklist[item.key] ? 'text-primary' : 'text-white'
                                    }`}>
                                    {item.label}
                                </h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                            <div className={`text-2xl ${checklist[item.key] ? 'text-primary' : 'text-gray-600'
                                }`}>
                                {checklist[item.key] ? <CheckCircle2 /> : <Circle />}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
