import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Save, User, MapPin, BookOpen, Calendar, FileText, Target, Banknote, Linkedin, Languages, Clock } from 'lucide-react'

export default function ProfileEditor() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [role, setRole] = useState(null) // 'ASPIRANT' or 'MENTOR'
    const [profile, setProfile] = useState({
        id: null,
        // Common
        fullName: '',
        bio: '',
        // Aspirant Specific
        targetCountry: '',
        intendedCourse: '',
        budgetRange: '',
        // Mentor Specific
        currentCountry: '',
        university: '',
        course: '',
        yearOfStudy: '',
        // Metadata fields
        intakeYear: '',
        examsTaken: '',
        shortGoal: '',
        linkedin: '',
        languages: '',
        expertise: '',
        availability: ''
    })

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('Profile')
            .select('*')
            .eq('userId', user.id)
            .single()

        if (data) {
            const isMentor = data.isStudyingAbroad
            setRole(isMentor ? 'MENTOR' : 'ASPIRANT')

            const metadata = data.metadata || {}

            setProfile({
                id: data.id,
                fullName: data.fullName || '',
                bio: data.bio || '', // Assuming column exists or we might need to handle failure gracefully

                // Aspirant
                targetCountry: data.targetCountry || '',
                intendedCourse: data.intendedCourse || '',
                budgetRange: data.budgetRange || '',

                // Mentor
                currentCountry: data.currentCountry || '',
                university: data.university || '',
                course: data.course || '',
                yearOfStudy: data.yearOfStudy || '',

                // Metadata
                intakeYear: metadata.intakeYear || '',
                examsTaken: metadata.examsTaken || '',
                shortGoal: metadata.shortGoal || '',
                linkedin: metadata.linkedin || '',
                languages: metadata.languages || '',
                expertise: metadata.expertise || '',
                availability: metadata.availability || ''
            })
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const calculateCompleteness = () => {
        if (!role) return 0
        let score = 0
        let totalFields = 0

        if (role === 'ASPIRANT') {
            totalFields = 7
            if (profile.fullName) score++
            if (profile.targetCountry) score++
            if (profile.intendedCourse) score++
            if (profile.budgetRange) score++
            if (profile.intakeYear) score++
            if (profile.examsTaken) score++
            if (profile.shortGoal) score++
        } else {
            // Mentor Completeness
            totalFields = 8
            if (profile.fullName) score++
            if (profile.currentCountry) score++
            if (profile.university) score++
            if (profile.course) score++
            if (profile.yearOfStudy) score++
            if (profile.bio) score++
            if (profile.languages) score++
            if (profile.expertise) score++
        }

        return Math.round((score / totalFields) * 100)
    }

    const completeness = calculateCompleteness()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        // Prepare Metadata
        const metadata = {
            // Shared/Misc
            shortGoal: profile.shortGoal,

            // Aspirant Specific
            intakeYear: profile.intakeYear,
            examsTaken: profile.examsTaken,

            // Mentor Specific
            linkedin: profile.linkedin,
            languages: profile.languages,
            expertise: profile.expertise,
            availability: profile.availability
        }

        const profileId = profile.id || crypto.randomUUID()

        const updateData = {
            id: profileId,
            userId: user.id,
            fullName: profile.fullName,
            bio: profile.bio,
            metadata: metadata
        }

        // Add Role Specific Main Columns
        if (role === 'ASPIRANT') {
            updateData.targetCountry = profile.targetCountry
            updateData.intendedCourse = profile.intendedCourse
            updateData.budgetRange = profile.budgetRange
        } else {
            updateData.currentCountry = profile.currentCountry
            updateData.university = profile.university
            updateData.course = profile.course
            updateData.yearOfStudy = profile.yearOfStudy
        }

        const { error } = await supabase
            .from('Profile')
            .upsert(updateData)

        if (error) {
            console.error('Error saving profile:', error)
            alert('Error saving profile: ' + error.message)
        } else {
            if (!profile.id) setProfile(prev => ({ ...prev, id: profileId }))
            alert('Profile saved successfully!')
        }
        setSaving(false)
    }

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
                    <p className="text-gray-400">
                        {role === 'MENTOR'
                            ? "Build trust with aspirants by keeping your profile updated."
                            : "Complete your profile to find the best mentors."}
                    </p>
                </div>

                {/* Completeness Bar */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-white">Profile Completeness</span>
                        <span className={`${completeness >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                            {completeness}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completeness}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${completeness >= 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                        />
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
                    {/* Common Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <User className="w-4 h-4 text-primary" /> Full Name
                            </label>
                            <input
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>

                        {/* Bio - Common but prominent for mentors */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <FileText className="w-4 h-4 text-gray-400" /> Bio / About Me
                            </label>
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder={role === 'MENTOR' ? "Tell aspirants about your journey..." : "A brief introduction..."}
                            />
                        </div>

                        {/* ASPIRANT FIELDS */}
                        {role === 'ASPIRANT' && (
                            <>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <MapPin className="w-4 h-4 text-secondary" /> Target Country
                                    </label>
                                    <input
                                        name="targetCountry"
                                        value={profile.targetCountry}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <BookOpen className="w-4 h-4 text-blue-400" /> Intended Course
                                    </label>
                                    <input
                                        name="intendedCourse"
                                        value={profile.intendedCourse}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Banknote className="w-4 h-4 text-green-400" /> Budget Range
                                    </label>
                                    <input
                                        name="budgetRange"
                                        value={profile.budgetRange}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Calendar className="w-4 h-4 text-yellow-400" /> Intake Year
                                    </label>
                                    <input
                                        name="intakeYear"
                                        value={profile.intakeYear}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FileText className="w-4 h-4 text-purple-400" /> Exams Taken
                                    </label>
                                    <input
                                        name="examsTaken"
                                        value={profile.examsTaken}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Target className="w-4 h-4 text-red-400" /> Short Goal
                                    </label>
                                    <input
                                        name="shortGoal"
                                        value={profile.shortGoal}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {/* MENTOR FIELDS */}
                        {role === 'MENTOR' && (
                            <>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <MapPin className="w-4 h-4 text-blue-400" /> Current Country
                                    </label>
                                    <input
                                        name="currentCountry"
                                        value={profile.currentCountry}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <BookOpen className="w-4 h-4 text-secondary" /> University
                                    </label>
                                    <input
                                        name="university"
                                        value={profile.university}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <BookOpen className="w-4 h-4 text-secondary" /> Course / Major
                                    </label>
                                    <input
                                        name="course"
                                        value={profile.course}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Calendar className="w-4 h-4 text-yellow-400" /> Year of Study
                                    </label>
                                    <input
                                        name="yearOfStudy"
                                        value={profile.yearOfStudy}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="e.g. 2nd Year"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Linkedin className="w-4 h-4 text-blue-500" /> LinkedIn URL
                                    </label>
                                    <input
                                        name="linkedin"
                                        value={profile.linkedin}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Languages className="w-4 h-4 text-green-400" /> Languages
                                    </label>
                                    <input
                                        name="languages"
                                        value={profile.languages}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="e.g. English, Hindi, German"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Target className="w-4 h-4 text-purple-400" /> Area of Expertise
                                    </label>
                                    <input
                                        name="expertise"
                                        value={profile.expertise}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="e.g. SOP Review, Visa Process, Part-time Jobs"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Clock className="w-4 h-4 text-orange-400" /> Availability (Hours/Week)
                                    </label>
                                    <input
                                        name="availability"
                                        value={profile.availability}
                                        onChange={handleChange}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="e.g. 5 hours"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}
