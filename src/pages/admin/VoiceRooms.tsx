import { useState, useEffect } from 'react';
import {
    MicrophoneIcon,
    PlusIcon,
    UsersIcon,
    XMarkIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { useLoadUserQuery } from '../../services/api';
import axiosClient from '../../services/axiosClient';
import toast from 'react-hot-toast';
import { useSocket } from '../../contexts/SocketContext';
import { GroupVoiceRoom } from '../../components/GroupVoiceRoom';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

interface VoiceRoomData {
    id: number;
    name: string;
    description: string;
    channelName: string;
    isActive: boolean;
    maxParticipants: number | null;
    creator: {
        id: number;
        firstname: string;
        lastname: string;
    };
    participants: Array<{
        id: number;
        firstname: string;
        lastname: string;
    }>;
    activeParticipantIds: number[];
    createdAt: string;
}

export default function VoiceRoomsPage() {
    const { data: userResponse } = useLoadUserQuery({});
    const currentUser = userResponse?.payload;
    const { socket } = useSocket();

    const [voiceRooms, setVoiceRooms] = useState<VoiceRoomData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeVoiceRoomId, setActiveVoiceRoomId] = useState<number | null>(null);

    useEffect(() => {
        fetchVoiceRooms();
    }, []);

    // Écouter les événements Socket.IO
    useEffect(() => {
        if (!socket) return;

        const handleVoiceRoomCreated = (data: { voiceRoom: VoiceRoomData }) => {
            console.log('🎙️ Voice room created:', data.voiceRoom);
            setVoiceRooms(prev => [data.voiceRoom, ...prev]);
            toast.success(`Nouveau salon vocal: ${data.voiceRoom.name}`);
        };

        const handleUserJoined = (data: { voiceRoomId: number; userId: number; activeParticipantIds: number[] }) => {
            console.log('👤 User joined voice room:', data);
            setVoiceRooms(prev => prev.map(room =>
                room.id === data.voiceRoomId
                    ? { ...room, activeParticipantIds: data.activeParticipantIds }
                    : room
            ));
        };

        const handleUserLeft = (data: { voiceRoomId: number; userId: number; activeParticipantIds: number[] }) => {
            console.log('👋 User left voice room:', data);
            setVoiceRooms(prev => prev.map(room =>
                room.id === data.voiceRoomId
                    ? { ...room, activeParticipantIds: data.activeParticipantIds }
                    : room
            ));
        };

        const handleVoiceRoomEnded = (data: { voiceRoomId: number }) => {
            console.log('🔇 Voice room ended:', data.voiceRoomId);
            setVoiceRooms(prev => prev.map(room =>
                room.id === data.voiceRoomId
                    ? { ...room, isActive: false, activeParticipantIds: [] }
                    : room
            ));
            if (activeVoiceRoomId === data.voiceRoomId) {
                setActiveVoiceRoomId(null);
            }
            toast('Salon vocal terminé', { icon: '🔇' });
        };

        socket.on('voice_room:created', handleVoiceRoomCreated);
        socket.on('voice_room:user_joined', handleUserJoined);
        socket.on('voice_room:user_left', handleUserLeft);
        socket.on('voice_room:ended', handleVoiceRoomEnded);

        return () => {
            socket.off('voice_room:created', handleVoiceRoomCreated);
            socket.off('voice_room:user_joined', handleUserJoined);
            socket.off('voice_room:user_left', handleUserLeft);
            socket.off('voice_room:ended', handleVoiceRoomEnded);
        };
    }, [socket, activeVoiceRoomId]);

    const fetchVoiceRooms = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(
                `${import.meta.env.VITE_BASE_URL}/app/voice-rooms`,
                { headers: getAuthHeader() }
            );
            console.log('Voice rooms response:', response.data);
            setVoiceRooms(response.data.payload || []);
        } catch (error: any) {
            console.error('Error fetching voice rooms:', error);
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Erreur lors du chargement des salons vocaux');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinRoom = (roomId: number) => {
        setActiveVoiceRoomId(roomId);
    };

    const handleLeaveRoom = () => {
        setActiveVoiceRoomId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                            <div className="p-3 bg-black rounded-xl">
                                <MicrophoneIcon className="w-8 h-8 text-white" />
                            </div>
                            Salons Vocaux
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Créez et rejoignez des salons de discussion vocale
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Créer un salon
                    </button>
                </div>
            </div>

            {/* Voice Rooms Grid */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
                    </div>
                ) : voiceRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="p-6 bg-gray-100 rounded-full mb-4">
                            <MicrophoneIcon className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">Aucun salon vocal actif</h3>
                        <p className="text-gray-500 mb-6">Créez un nouveau salon pour commencer</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Créer un salon
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {voiceRooms.map(room => (
                            <VoiceRoomCard
                                key={room.id}
                                room={room}
                                currentUser={currentUser}
                                onJoin={() => handleJoinRoom(room.id)}
                                isJoined={activeVoiceRoomId === room.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Voice Room Modal */}
            {showCreateModal && (
                <CreateVoiceRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchVoiceRooms}
                />
            )}

            {/* Active Voice Room Widget */}
            {activeVoiceRoomId && (
                <GroupVoiceRoom
                    voiceRoomId={activeVoiceRoomId}
                    onClose={handleLeaveRoom}
                />
            )}
        </div>
    );
}

// Voice Room Card Component
function VoiceRoomCard({ room, currentUser, onJoin, isJoined }: {
    room: VoiceRoomData;
    currentUser: any;
    onJoin: () => void;
    isJoined: boolean;
}) {
    const activeCount = room.activeParticipantIds.length;
    const isCreator = currentUser?.id === room.creator.id;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">{room.name}</h3>
                    {room.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{room.description}</p>
                    )}
                </div>
                {room.isActive && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        En cours
                    </div>
                )}
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <UsersIcon className="w-4 h-4" />
                <span>Par {room.creator.firstname} {room.creator.lastname}</span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                    {room.participants.slice(0, 5).map((participant, idx) => (
                        <div
                            key={participant.id}
                            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                            title={`${participant.firstname} ${participant.lastname}`}
                        >
                            {participant.firstname[0]}{participant.lastname[0]}
                        </div>
                    ))}
                    {room.participants.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                            +{room.participants.length - 5}
                        </div>
                    )}
                </div>
                <span className="text-sm text-gray-600">
                    {activeCount} / {room.participants.length} actif{activeCount > 1 ? 's' : ''}
                </span>
            </div>

            {/* Action Button */}
            <button
                onClick={onJoin}
                disabled={!room.isActive}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isJoined
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : room.isActive
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                <PhoneIcon className="w-5 h-5" />
                {isJoined ? 'En cours...' : room.isActive ? 'Rejoindre' : 'Terminé'}
            </button>
        </div>
    );
}

// Create Voice Room Modal Component
function CreateVoiceRoomModal({ onClose, onCreated }: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get(
                `${import.meta.env.VITE_BASE_URL}/admin/users`,
                { headers: getAuthHeader() }
            );
            console.log('Users response:', response.data);
            const usersData =
                response.data?.payload?.users ||
                response.data?.payload ||
                response.data?.data ||
                [];

            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Erreur lors du chargement des utilisateurs');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Le nom du salon est requis');
            return;
        }

        try {
            setIsLoading(true);

            await axiosClient.post(
                `${import.meta.env.VITE_BASE_URL}/app/voice-rooms`,
                {
                    name: name.trim(),
                    description: description.trim() || null,
                    participantIds: selectedUserIds,
                    maxParticipants: maxParticipants ? parseInt(maxParticipants) : null
                },
                { headers: getAuthHeader() }
            );

            toast.success('Salon vocal créé avec succès');
            onCreated();
            onClose();
        } catch (error) {
            console.error('Error creating voice room:', error);
            toast.error('Erreur lors de la création du salon');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUser = (userId: number) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const filteredUsers = users.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-black">Créer un salon vocal</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Nom du salon *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            placeholder="Ex: Discussion équipe"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Description (optionnel)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                            placeholder="Décrivez le sujet du salon..."
                            rows={3}
                        />
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Nombre max de participants (optionnel)
                        </label>
                        <input
                            type="number"
                            value={maxParticipants}
                            onChange={(e) => setMaxParticipants(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            placeholder="Illimité"
                            min="2"
                        />
                    </div>

                    {/* Participants */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Inviter des participants
                        </label>

                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-sm"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
                                            {user.firstname[0]}{user.lastname[0]}
                                        </span>
                                        {user.firstname} {user.lastname}
                                        <button
                                            type="button"
                                            onClick={() => toggleUser(user.id)}
                                            className="text-gray-500 hover:text-black"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-2"
                                placeholder="Rechercher un utilisateur..."
                            />

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredUsers.length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            Aucun utilisateur trouvé
                                        </div>
                                    )}
                                    {filteredUsers.map(user => (
                                        <label
                                            key={user.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.includes(user.id)}
                                                onChange={() => toggleUser(user.id)}
                                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                            />
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-medium">
                                                {user.firstname[0]}{user.lastname[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-black">
                                                    {user.firstname} {user.lastname}
                                                </span>
                                                {user.email && (
                                                    <span className="text-xs text-gray-500">{user.email}</span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedUserIds.length > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                {selectedUserIds.length} participant{selectedUserIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isLoading || !name.trim()}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Création...
                            </>
                        ) : (
                            <>
                                <PlusIcon className="w-5 h-5" />
                                Créer le salon
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
