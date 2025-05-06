import { MessageOutlined, PlusOutlined, SearchOutlined, SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Tooltip, Button, Typography, Input, Avatar, List, Badge, Divider, Skeleton, message, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useSearchUsersQuery,
    useCreateOrGetConversationMutation
} from "../services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { io, Socket } from "socket.io-client";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const MessagePage = () => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userSearchInput, setUserSearchInput] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<any>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const { data: conversationsResponse, isLoading, refetch: refetchConversations } = useGetConversationsQuery({
        userId: user._id
    });

    const { data: messagesResponse, isLoading: messagesLoading, refetch: refetchMessages } = useGetMessagesQuery(
        { conversationId: selectedConversation?._id, userId: user._id },
        { skip: !selectedConversation }
    );

    const { data: searchResults = [], isFetching: isSearching } = useSearchUsersQuery(
        { searchQuery: userSearchInput },
        { skip: !userSearchInput.trim() }
    );

    const [sendMessage] = useSendMessageMutation();
    const [createConversation] = useCreateOrGetConversationMutation();

    const conversations = conversationsResponse?.data || [];
    const messages = messagesResponse?.data || [];

    // Initialisation de Socket.IO
    useEffect(() => {
        if (!user._id) return;

        const newSocket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true,
            auth: { userId: user._id }
        });

        newSocket.on('connect', () => {
            console.log('Socket connected with ID:', newSocket.id);
            newSocket.emit('joinUserRoom', user._id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            console.log('Disconnecting socket');
            newSocket.disconnect();
        };
    }, [user._id]);

    // Gestion des événements Socket.IO
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage: any) => {
            console.log('Received message event:', newMessage);
            if (selectedConversation?._id === newMessage.conversation) {
                refetchMessages();
            }
            refetchConversations();
        };

        const handleUpdateConversation = (data: any) => {
            console.log('Received updateConversation event:', data);
            if (selectedConversation?._id === data.conversationId) {
                refetchMessages();
            }
            refetchConversations();
        };

        const handleMessagesRead = (data: any) => {
            console.log('Received messagesRead event:', data);
            if (selectedConversation?._id === data.conversationId) {
                refetchMessages();
            }
            refetchConversations();
        };

        const handleNewConversation = (conversation: any) => {
            console.log('Received newConversation event:', conversation);
            refetchConversations();
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("updateConversation", handleUpdateConversation);
        socket.on("messagesRead", handleMessagesRead);
        socket.on("newConversation", handleNewConversation);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("updateConversation", handleUpdateConversation);
            socket.off("messagesRead", handleMessagesRead);
            socket.off("newConversation", handleNewConversation);
        };
    }, [socket, selectedConversation, refetchMessages, refetchConversations]);

    // Scroll vers le bas des messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus sur le champ de message quand une conversation est sélectionnée
    useEffect(() => {
        if (selectedConversation && messageInputRef.current) {
            setTimeout(() => {
                messageInputRef.current?.focus();
            }, 200);
        }
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        if (messageInput.trim() && selectedConversation) {
            try {
                await sendMessage({
                    conversationId: selectedConversation._id,
                    content: messageInput,
                    senderId: user._id
                }).unwrap();
                setMessageInput("");
                refetchMessages();
                refetchConversations();
            } catch (err) {
                message.error("Failed to send message");
            }
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setUserSearchInput("");
        setSelectedUser(null);
    };

    // @ts-ignore
    const handleUserSelect = (value: string, option: any) => {
        setSelectedUser(option.user); // option.user contient l'objet utilisateur complet
    };

    const handleCreateConversation = async () => {
        if (!selectedUser) {
            message.warning("Please select a user");
            return;
        }

        try {
            const result = await createConversation({
                participantId: selectedUser._id,
                userId: user._id
            }).unwrap();

            setSelectedConversation(result.data);
            refetchConversations();
            setIsModalVisible(false);
            setUserSearchInput("");
            setSelectedUser(null);
            message.success("Conversation created successfully");
        } catch (err) {
            message.error("Failed to create conversation");
        }
    };

    const filteredConversations = conversations.filter((conv: any) => {
        const participantNames = conv.participants
            .filter((p: any) => p._id !== user._id)
            .map((p: any) => p.name)
            .join(' ');
        return participantNames.toLowerCase().includes(searchInput.toLowerCase());
    });

    const getOtherParticipant = (conv: any) => {
        return conv.participants.find((p: any) => p._id !== user._id);
    };

    const getConversationTitle = (conv: any) => {
        if (conv.isGroupChat) return conv.groupName;
        return getOtherParticipant(conv)?.name || 'Conversation';
    };

    const getAvatar = (conv: any) => {
        if (conv.isGroupChat) return conv.groupPicture || 'https://via.placeholder.com/40';
        const participant = getOtherParticipant(conv);
        return participant?.picture || 'https://via.placeholder.com/40';
    };

    const isMyMessage = (message: any) => {
        return message.sender._id === user._id;
    };

    const formatTime = (date: string) => {
        const today = dayjs().startOf('day');
        const messageDate = dayjs(date);

        if (messageDate.isAfter(today)) {
            return messageDate.format('HH:mm');
        } else if (messageDate.isAfter(today.subtract(7, 'day'))) {
            return messageDate.format('ddd HH:mm');
        } else {
            return messageDate.format('DD/MM/YYYY');
        }
    };

    const renderMessageDate = (messages: any[], index: number) => {
        const currentMessage = messages[index];
        const prevMessage = index > 0 ? messages[index - 1] : null;

        if (!prevMessage) {
            return (
                <div className="text-center my-4">
                    <Text type="secondary" className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {dayjs(currentMessage.createdAt).format('DD MMMM YYYY')}
                    </Text>
                </div>
            );
        }

        const currentDate = dayjs(currentMessage.createdAt).format('YYYY-MM-DD');
        const prevDate = dayjs(prevMessage.createdAt).format('YYYY-MM-DD');

        if (currentDate !== prevDate) {
            return (
                <div className="text-center my-4">
                    <Text type="secondary" className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {dayjs(currentMessage.createdAt).format('DD MMMM YYYY')}
                    </Text>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="dashboard-container h-screen flex flex-col bg-white">
            <div className="shadow-sm border-b p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="mr-4"
                    />
                    <Title level={4} className="m-0">Messages</Title>
                    {conversations.length > 0 && (
                        <Badge count={conversations.filter((c: any) => c.unreadCount > 0).length} offset={[10, 0]} className="ml-2" />
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar des conversations */}
                <div className="w-1/3 border-r flex flex-col bg-gray-50 shadow-sm">
                    <div className="p-4 border-b bg-white">
                        <div className="flex">
                            <Search
                                placeholder="Search conversations..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-1"
                                allowClear
                            />
                            <Tooltip title="New conversation">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showModal}
                                    className="ml-2"
                                />
                            </Tooltip>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="p-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton active avatar paragraph={{ rows: 1 }} key={i} className="mb-4" />
                                ))}
                            </div>
                        ) : filteredConversations.length > 0 ? (
                            <List
                                dataSource={filteredConversations}
                                renderItem={(conv: any) => (
                                    <List.Item
                                        className={`cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${selectedConversation?._id === conv._id
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : "border-l-4 border-transparent"
                                            }`}
                                        onClick={() => setSelectedConversation(conv)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot={conv.unreadCount > 0} offset={[-3, 32]} color="blue">
                                                    <Avatar src={getAvatar(conv)} size={42} />
                                                </Badge>
                                            }
                                            title={
                                                <div className="flex justify-between items-center">
                                                    <Text strong>{getConversationTitle(conv)}</Text>
                                                    <Text type="secondary" className="text-xs">
                                                        {formatTime(conv.updatedAt)}
                                                    </Text>
                                                </div>
                                            }
                                            description={
                                                <div className="flex justify-between items-center">
                                                    <Text
                                                        type="secondary"
                                                        ellipsis
                                                        className="max-w-48"
                                                        strong={conv.unreadCount > 0}
                                                    >
                                                        {conv.lastMessage?.content || 'No messages yet'}
                                                    </Text>
                                                    {conv.unreadCount > 0 && (
                                                        <Badge
                                                            count={conv.unreadCount}
                                                            size="small"
                                                            className="ml-2"
                                                            style={{ backgroundColor: '#1890ff' }}
                                                        />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : searchInput ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <SearchOutlined style={{ fontSize: 32 }} className="text-gray-300 mb-3" />
                                <Text type="secondary">No conversations found with "{searchInput}"</Text>
                                <Button type="link" onClick={() => setSearchInput("")}>Clear search</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <MessageOutlined style={{ fontSize: 32 }} className="text-gray-300 mb-3" />
                                <Text type="secondary">No conversations yet</Text>
                                <Button type="link" onClick={showModal}>Start a new conversation</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Zone de conversation */}
                <div className="w-2/3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b flex items-center bg-white shadow-sm">
                                <Avatar src={getAvatar(selectedConversation)} size={42} className="mr-3" />
                                <div className="flex-1">
                                    <Text strong className="text-lg">
                                        {getConversationTitle(selectedConversation)}
                                    </Text>
                                    {selectedConversation.isGroupChat ? (
                                        <div className="text-xs text-gray-500">
                                            {selectedConversation.participants.length} participants
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500">
                                            {getOtherParticipant(selectedConversation)?.isOnline
                                                ? <span className="text-green-500">Online</span>
                                                : 'Offline'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                {messagesLoading ? (
                                    <div className="p-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`mb-4 flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                                                <Skeleton.Button active size="small" style={{ width: 200, borderRadius: 16 }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : messages.length > 0 ? (
                                    <>
                                        {messages.map((msg: any, index: number) => (
                                            <div key={msg._id}>
                                                {renderMessageDate(messages, index)}
                                                <div className={`mb-2 flex ${isMyMessage(msg) ? "justify-end" : "justify-start"}`}>
                                                    {!isMyMessage(msg) && (
                                                        <Avatar
                                                            src={msg.sender.picture}
                                                            size={32}
                                                            className="mr-2 self-end mb-1"
                                                        />
                                                    )}
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl max-w-md ${isMyMessage(msg)
                                                                ? "bg-blue-500 text-white rounded-tr-none"
                                                                : "bg-white shadow-sm rounded-tl-none"
                                                            }`}
                                                    >
                                                        <div className={isMyMessage(msg) ? "text-white" : ""}>
                                                            {msg.content}
                                                        </div>
                                                        <div className={`text-xs mt-1 text-right ${isMyMessage(msg) ? "text-blue-100" : "text-gray-400"
                                                            }`}>
                                                            {dayjs(msg.createdAt).format('HH:mm')}
                                                            {isMyMessage(msg) && (
                                                                <span className="ml-1">
                                                                    {msg.readBy?.length > 1 ? "✓✓" : "✓"}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageOutlined style={{ fontSize: 48 }} className="text-gray-300 mb-4" />
                                            <Text type="secondary">No messages yet</Text>
                                            <div className="mt-2">
                                                <Text type="secondary" className="text-sm">
                                                    Send a message to start the conversation
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t bg-white shadow-sm">
                                <div className="flex">
                                    <Input
                                        placeholder="Type your message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onPressEnter={handleSendMessage}
                                        className="flex-1"
                                        size="large"
                                        ref={messageInputRef}
                                        suffix={
                                            <Button
                                                type="primary"
                                                icon={<SendOutlined />}
                                                onClick={handleSendMessage}
                                                disabled={!messageInput.trim()}
                                                shape="circle"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 border-l">
                            <div className="text-center p-8">
                                <MessageOutlined style={{ fontSize: 56 }} className="text-gray-200 mb-6" />
                                <Title level={4} className="mb-4">Select a conversation</Title>
                                <Text type="secondary" className="mb-6 block">
                                    Choose an existing conversation or start a new one
                                </Text>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showModal}
                                    size="large"
                                >
                                    New conversation
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title="New Conversation"
                open={isModalVisible}
                onOk={handleCreateConversation}
                onCancel={handleCancel}
                okText="Start Chat"
                cancelText="Cancel"
                okButtonProps={{ disabled: !selectedUser }}
                centered
            >
                <Divider className="mt-3 mb-4" />
                <div className="mb-4">
                    <Text>Search for a user to start a conversation:</Text>
                </div>
                <Select
                    showSearch
                    placeholder="Search by name or email..."
                    style={{ width: '100%', height: '55px', overflow: 'auto' }}
                    value={selectedUser ? selectedUser._id : undefined}
                    onSearch={setUserSearchInput}
                    onChange={(value, option) => handleUserSelect(value, option)} // Modification ici
                    filterOption={false}
                    loading={isSearching}
                    size="large"
                    optionLabelProp="label"
                    notFoundContent={
                        userSearchInput ? (
                            <div className="p-2 text-center">
                                <SearchOutlined className="mr-2" />
                                No users found
                            </div>
                        ) : (
                            <div className="p-2 text-center text-gray-400">
                                Type to search users
                            </div>
                        )
                    }
                >
                    {searchResults?.data?.map((user: any) => (
                        <Option
                            key={user._id}
                            value={user._id}
                            user={user}
                            label={user.name} // Ajout pour une meilleure visibilité
                        >
                            <div className="flex items-center py-1">
                                <Avatar src={user.picture} size="small" className="mr-3" />
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </Option>
                    ))}
                </Select>
                {selectedUser && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border flex items-center">
                        <Avatar src={selectedUser.picture} size="large" className="mr-3" />
                        <div>
                            <Text strong>{selectedUser.name}</Text>
                            <div className="text-xs text-gray-500">{selectedUser.email}</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MessagePage;