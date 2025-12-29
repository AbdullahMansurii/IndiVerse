import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../layouts/AdminLayout'
import { Search, X, User, MapPin, BookOpen, GraduationCap, Globe } from 'lucide-react'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('Profile')
                .select('*')

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const name = user.fullName || ''
        const country = user.targetCountry || user.currentCountry || ''
        const search = searchTerm.toLowerCase()

        return name.toLowerCase().includes(search) ||
            country.toLowerCase().includes(search)
    })

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-white/5 text-primary">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-white font-medium text-sm">{value || '-'}</p>
            </div>
        </div>
    )

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Users Directory</h1>
                    <p className="text-gray-400 mt-2">Manage all registered aspirants and mentors.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-gray-400 font-medium">Name</th>
                                <th className="p-4 text-gray-400 font-medium">Role</th>
                                <th className="p-4 text-gray-400 font-medium">Country</th>
                                <th className="p-4 text-gray-400 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                                {user.fullName?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.isStudyingAbroad
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.isStudyingAbroad ? 'MENTOR' : 'ASPIRANT'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {user.isStudyingAbroad ? user.currentCountry : user.targetCountry || '-'}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-primary border border-white/10 transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0f0f13] z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-black">
                                    {selectedUser.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedUser.fullName}</h2>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedUser.isStudyingAbroad ? 'text-purple-400 bg-purple-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                                        {selectedUser.isStudyingAbroad ? 'MENTOR ACCOUNT' : 'ASPIRANT ACCOUNT'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Bio Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                                <p className="text-gray-300 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                                    {selectedUser.bio || 'No bio provided.'}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {selectedUser.isStudyingAbroad ? (
                                    <>
                                        <DetailItem icon={GraduationCap} label="University" value={selectedUser.university} />
                                        <DetailItem icon={BookOpen} label="Course" value={selectedUser.course} />
                                        <DetailItem icon={MapPin} label="Current Country" value={selectedUser.currentCountry} />
                                        <DetailItem icon={Globe} label="Year of Study" value={selectedUser.yearOfStudy} />
                                    </>
                                ) : (
                                    <>
                                        <DetailItem icon={MapPin} label="Target Country" value={selectedUser.targetCountry} />
                                        <DetailItem icon={BookOpen} label="Intended Course" value={selectedUser.intendedCourse} />
                                        <DetailItem icon={Globe} label="Budget Range" value={selectedUser.budgetRange} />
                                        <DetailItem icon={GraduationCap} label="Intake Year" value={selectedUser.metadata?.intakeYear} />
                                    </>
                                )}
                            </div>

                            {/* Additional Metadata */}
                            {selectedUser.metadata && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Additional Info</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.metadata.languages && (
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                                                Languages: {selectedUser.metadata.languages}
                                            </span>
                                        )}
                                        {selectedUser.metadata.linkedin && (
                                            <a href={selectedUser.metadata.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs border border-blue-600/20 hover:bg-blue-600/20 cursor-pointer">
                                                LinkedIn Profile
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/5">
                            <p className="text-xs text-center text-gray-500">
                                user_id: {selectedUser.id} • joined: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
