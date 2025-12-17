import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import DashboardLayout from '../layouts/DashboardLayout'
import AspirantDashboard from './AspirantDashboard'
import MentorDashboard from './MentorDashboard'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const fetchProfile = async () => {
            // Try to fetch profile using userId
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('userId', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
            }

            if (data) {
                setProfile(data)
            } else {
                // No profile found? specific handling (maybe redirect to onboarding?)
                // For now, prompt onboarding
                navigate('/onboarding')
            }
            setLoading(false)
        }

        fetchProfile()
    }, [user, navigate])

    if (loading) return <div className="p-8 text-white">Loading profile...</div>

    return (
        <DashboardLayout>
            {profile && (
                profile.isStudyingAbroad ? <MentorDashboard /> : <AspirantDashboard />
            )}
        </DashboardLayout>
    )
}

