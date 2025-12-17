import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ArrowLeft, Send, User, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GuidanceChat() {
    const { requestId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const scrollRef = useRef(null)

    const [request, setRequest] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [otherPerson, setOtherPerson] = useState(null)

    useEffect(() => {
        if (user && requestId) {
            fetchChatDetails()
        }
    }, [user, requestId])

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    // Real-time Subscription
    useEffect(() => {
        if (!requestId) return

        const channel = supabase
            .channel(`request-${requestId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'GuidanceMessage',
                    filter: `requestId=eq.${requestId}`
                },
                (payload) => {
                    console.log('Realtime Event:', payload)
                    setMessages((prev) => [...prev, payload.new])
                }
            )
            .subscribe((status) => {
                console.log('Subscription Status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [requestId])

    const fetchChatDetails = async () => {
        setLoading(true)

        // 1. Fetch Request & Security Check
        const { data: reqData, error: reqError } = await supabase
            .from('GuidanceRequest')
            .select('*')
            .eq('id', requestId)
            .single()

        if (reqError || !reqData) {
            alert('Request not found.')
            navigate('/requests')
            return
        }

        // Verify Access
        const isParticipant = reqData.aspirantId === user.id || reqData.mentorId === user.id
        if (!isParticipant) {
            alert('Unauthorized access.')
            navigate('/dashboard')
            return
        }

        if (reqData.status !== 'ACCEPTED') {
            alert('Chat is only available for Accepted requests.')
            navigate('/requests')
            return
        }

        setRequest(reqData)

        // 2. Identify Other Person
        const otherUserId = reqData.aspirantId === user.id ? reqData.mentorId : reqData.aspirantId
        const { data: profile } = await supabase
            .from('Profile')
            .select('*')
            .eq('userId', otherUserId)
            .single()

        setOtherPerson(profile)

        // 3. Fetch Messages
        await fetchMessages()
        setLoading(false)
    }

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('GuidanceMessage')
            .select('*')
            .eq('requestId', requestId)
            .order('createdAt', { ascending: true })

        if (data) setMessages(data)
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setSending(true)
        const { error } = await supabase
            .from('GuidanceMessage')
            .insert({
                id: crypto.randomUUID(),
                requestId: requestId,
                senderId: user.id,
                content: newMessage.trim()
            })

        if (error) {
            alert('Failed to send: ' + error.message)
        } else {
            setNewMessage('')
            // fetchMessages() // Rely on Realtime to update UI
        }
        setSending(false)
    }

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading chat...</div>

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                    <button
                        onClick={() => navigate('/requests')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {otherPerson?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="font-bold text-white flex items-center gap-2">
                                {otherPerson?.fullName || 'User'}
                                {otherPerson?.isMentor && <ShieldCheck className="w-4 h-4 text-secondary" />}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {otherPerson?.isMentor ? 'Your Mentor' : 'Aspirant'} • {otherPerson?.university || otherPerson?.targetCountry}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-gray-400">Start the conversation! Say hello. 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === user.id
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe
                                            ? 'bg-primary text-black rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/60' : 'text-gray-500'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}
