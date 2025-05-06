import { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import { useGetAdvertisementsQuery, useGetTutorsQuery } from '../../services/api';
import EventModal from '../../components/EventModal';
import { useNavigate } from 'react-router-dom';

const DiscoverPage = () => {
    const [activeTab, setActiveTab] = useState('events');
    const { data: tutors, isLoading: loadingTutors } = useGetTutorsQuery({});
    const { data: events, isLoading: loadingEvents } = useGetAdvertisementsQuery({});

    const handleTabChange = (key: any) => {
        setActiveTab(key);
    };

    // Sample data for featured content/courses (keeping this as it's not connected to an API yet)
   

    // Tab items configuration
    const tabItems = [
       /*  {
            key: 'courses',
            label: (
                <span className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Courses
                </span>
            ),
            children: <CoursesContent content={featuredContent} />
        }, */
        {
            key: 'events',
            label: (
                <span className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Events
                </span>
            ),
            children: <EventsContent events={events} isLoading={loadingEvents} />
        },
        {
            key: 'tutors',
            label: (
                <span className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Tutors
                </span>
            ),
            children: <TutorsContent tutors={tutors} isLoading={loadingTutors} />
        }
    ];

    // Custom tabs implementation to match luxury aesthetic
    return (
        <div className="bg-white min-h-screen text-black">
            {/* Header section */}
            <div className="container mx-auto px-8 pt-16 pb-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-light tracking-tight mb-2">Discover</h1>
                    <div className="w-12 h-px bg-gray-400 mb-6"></div>
                    <p className="text-gray-600 text-lg font-light leading-relaxed">
                        Explore our curated collection of premium educational experiences and connect with world-class tutors.
                    </p>
                </div>

                {/* Search bar */}
                <div className="mt-12 mb-10 max-w-lg">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for subjects, tutors, or events"
                            className="w-full bg-transparent border border-gray-300 px-4 py-3 pl-12 focus:outline-none focus:ring-1 focus:ring-gray-500 text-black"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Custom tabs navigation */}
            <div className="border-b border-gray-300">
                <div className="container mx-auto px-8">
                    <div className="flex space-x-8">
                        {tabItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => handleTabChange(item.key)}
                                className={`py-4 relative ${activeTab === item.key
                                        ? 'text-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {item.label}
                                {activeTab === item.key && (
                                    <div className="absolute bottom-0 left-0 w-full h-px bg-black"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="container mx-auto px-8 py-12">
                {tabItems.find(item => item.key === activeTab)?.children}
            </div>
        </div>
    );
};



// Events content component
const EventsContent = ({ events, isLoading }: any) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openEventModal = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeEventModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading events...</div>;
    }

    if (!events || events.length === 0) {
        return <div className="text-center py-12">No upcoming events found.</div>;
    }

    return (
        <div className="mx-auto">
            <h2 className="text-2xl font-light mb-8">Upcoming Events</h2>

            {events?.data?.length > 0 ? (
                <div className="space-y-4">
                    {events.data.map((event: any) => {
                        const eventDate = new Date(event.date);
                        const isPastEvent = eventDate < new Date();

                        return (
                            <div key={event._id} className="border border-gray-300 p-6 hover:border-gray-500 transition duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-light mb-2 truncate">{event.title}</h3>
                                        <p className="text-gray-500 text-sm">
                                            Hosted by {event.studentId?.name || "Unknown Host"}
                                        </p>
                                        {event.description && (
                                            <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right ml-4 flex-shrink-0">
                                        <div className="text-lg font-light">
                                            {eventDate.toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {eventDate.toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        {event.isNow ? (
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded mt-1 inline-block">
                                                Happening Now
                                            </span>
                                        ) : isPastEvent ? (
                                            <span className="text-xs bg-gray-300 text-black px-2 py-1 rounded mt-1 inline-block">
                                                Past Event
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                {event.media?.length > 0 && (
                                    <div className="mt-4">
                                        <img
                                            src={event.media[0]}
                                            alt={event.title}
                                            className="w-full max-h-40 rounded object-cover"
                                        />
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        {event.location || "Online Event"}
                                    </div>
                                    <button
                                        className={`cursor-pointer border px-4 py-2 text-sm transition duration-300 ${event.isCanceled
                                                ? 'border-red-500 text-red-500 cursor-not-allowed'
                                                : 'border-gray-400 hover:border-black'
                                            }`}
                                        disabled={event.isCanceled}
                                        onClick={() => {
                                            if (!event.isCanceled) {
                                                openEventModal(event);
                                            }
                                        }}
                                    >
                                        {event.isCanceled ? "Canceled" : isPastEvent ? "View Past Event" : "View"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 border border-gray-300 rounded">
                    <div className="text-gray-500 mb-4">No upcoming events scheduled</div>
                </div>
            )}
{/* 
            {events?.data?.length > 0 && (
                <div className="mt-12 text-center">
                    <button
                        className="border border-black px-8 py-3 hover:bg-black hover:text-white transition duration-300 text-sm uppercase tracking-wider"
                        onClick={() => {
                            // Navigation vers tous les événements
                        }}
                    >
                        View All Events
                    </button>
                </div>
            )} */}

            {/* Modal pour les détails de l'événement */}
            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={closeEventModal}
            />
        </div>
    );
};

// Tutors content component
const TutorsContent = ({ tutors, isLoading }: any) => {
    const navigate = useNavigate();
    if (isLoading) {
        return <div className="text-center py-12">Loading tutors...</div>;
    }

    if (!tutors || tutors.length === 0) {
        return <div className="text-center py-12">No tutors found.</div>;
    }

    return (
        <div className="min-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-8">Elite Tutors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors?.data?.length > 0 ? (
                    tutors.data.map((tutor: any) => {
                        const initials = tutor.name
                            ?.split(' ')
                            .slice(0, 2)
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase() || "T";

                        const rating = parseFloat(tutor.rating) || 0;
                        const roundedRating = Math.round(rating * 2) / 2; // Permet les demi-étoiles

                        return (
                            <div key={tutor._id} className="border border-gray-300 p-6 hover:border-gray-500 transition duration-300 flex flex-col">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        {tutor.profileImage ? (
                                            <img
                                                src={tutor.profileImage}
                                                alt={tutor.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '';
                                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `
                            <span class="text-xl text-gray-500">${initials}</span>
                          `;
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xl text-gray-500">{initials}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-light truncate">{tutor.name || "Unnamed Tutor"}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {tutor.courses?.[0]?.join(' - ') || 'No specialty specified'}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {tutor.hourPrice ? `$${tutor.hourPrice}/hour` : "Price not set"}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-300 pt-4 mt-auto">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 mr-2">
                                                {rating.toFixed(1)}
                                            </span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`w-3 h-3 ${star <= roundedRating
                                                                ? 'text-yellow-500'
                                                                : star - 0.5 <= roundedRating
                                                                    ? 'text-yellow-500'
                                                                    : 'text-gray-300'
                                                            }`}
                                                    >
                                                        {star <= roundedRating ? '★' : star - 0.5 <= roundedRating ? '½' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {tutor.studentCount || 0} {tutor.studentCount === 1 ? 'student' : 'students'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="cursor-pointer w-full border border-gray-400 px-4 py-2 mt-4 text-sm hover:border-black transition duration-300"
                                    onClick={() => {
                                        navigate(`/tutors-profile/${tutor._id}`);
                                    }}
                                >
                                    View Public Profile
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border border-gray-300 rounded">
                        <div className="text-gray-500 mb-4">No tutors found.</div>
                    </div>
                )}
            </div>

            {/* {tutors?.data?.length > 0 && (
                <div className="mt-12 text-center">
                    <button
                        className="border border-black px-8 py-3 hover:bg-black hover:text-white transition duration-300 text-sm uppercase tracking-wider"
                        onClick={() => {
                            // Gérer l'action "Voir plus"
                        }}
                    >
                        Explore All Tutors
                    </button>
                </div>
            )} */}
        </div>
    );
};

export default DiscoverPage;