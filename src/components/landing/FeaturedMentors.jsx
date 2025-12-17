import { BadgeCheck, MapPin } from 'lucide-react'

export default function FeaturedMentors() {
    const mentors = [
        {
            name: "Aditi S.",
            uni: "Columbia University",
            course: "MS in Data Science",
            loc: "New York, USA",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
        },
        {
            name: "Rohan M.",
            uni: "TU Munich",
            course: "MSc Informatics",
            loc: "Munich, Germany",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
        },
        {
            name: "Priya K.",
            uni: "University of Melbourne",
            course: "Master of Management",
            loc: "Melbourne, Australia",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
        },
        {
            name: "Vikram R.",
            uni: "Imperial College London",
            course: "MBA",
            loc: "London, UK",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
        }
    ]

    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Meet our Top Mentors</h2>
                        <p className="text-gray-400">Real students. Real stories. Verified for your peace of mind.</p>
                    </div>
                    <button className="text-primary hover:text-white transition-colors font-medium border-b border-primary pb-0.5">
                        View All Mentors
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mentors.map((mentor, idx) => (
                        <div key={idx} className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                            {/* Image Overlay Gradient */}
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-1">
                                        {mentor.name}
                                        <BadgeCheck className="w-4 h-4 text-blue-400" />
                                    </h3>
                                    <p className="text-gray-300 text-sm">{mentor.uni}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <MapPin className="w-3 h-3" />
                                    {mentor.loc}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/5">
                                    {mentor.course}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
