import React, { useState } from 'react';
import { Card, Modal } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    LinkOutlined,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';

interface Advertisement {
    _id: string;
    studentId: {
        name: string;
        email: string;
    };
    type: string;
    title: string;
    description: string;
    date: string | null;
    location: string;
    links: string[];
    media: string[];
}

interface AdvertisementCardProps {
    advertisement: Advertisement;
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({ advertisement }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const showModal = () => {
        setIsModalVisible(true);
        setCurrentMediaIndex(0);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleNextMedia = () => {
        if (advertisement.media && advertisement.media.length > 0) {
            setCurrentMediaIndex((prevIndex) =>
                (prevIndex + 1) % advertisement.media.length
            );
        }
    };

    const handlePrevMedia = () => {
        if (advertisement.media && advertisement.media.length > 0) {
            setCurrentMediaIndex((prevIndex) =>
                (prevIndex - 1 + advertisement.media.length) % advertisement.media.length
            );
        }
    };

    const renderMediaContent = () => {
        if (!advertisement.media || advertisement.media.length === 0) {
            return null;
        }

        const mediaUrl = advertisement.media[currentMediaIndex];
        const fullUrl = `${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${mediaUrl}`;
        const isVideo = mediaUrl.toLowerCase().includes('.mp4') ||
            mediaUrl.toLowerCase().includes('.avi') ||
            mediaUrl.toLowerCase().includes('.mov');

        return (
            <div className="relative w-full">
                {advertisement.media.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevMedia}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white/75 transition-all"
                        >
                            <LeftOutlined />
                        </button>
                        <button
                            onClick={handleNextMedia}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white/75 transition-all"
                        >
                            <RightOutlined />
                        </button>
                    </>
                )}

                <div className="w-full h-64 flex justify-center items-center overflow-hidden bg-gray-100">
                    {isVideo ? (
                        <video
                            key={currentMediaIndex}
                            src={fullUrl}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <img
                            key={currentMediaIndex}
                            src={fullUrl}
                            alt={`Media ${currentMediaIndex + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>

                {advertisement.media.length > 1 && (
                    <div className="flex justify-center mt-2">
                        {advertisement.media.map((_, index) => (
                            <span
                                key={index}
                                className={`h-2 w-2 rounded-full mx-1 ${index === currentMediaIndex
                                        ? 'bg-blue-500'
                                        : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Card
                hoverable
                onClick={showModal}
                className="transition-all shadow-md duration-300 hover:shadow-lg"
                cover={
                    advertisement.media && advertisement.media.length > 0 ? (
                        <div className="w-full h-48 flex justify-center items-center overflow-hidden bg-gray-100">
                            <img
                                alt="advertisement"
                                src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${advertisement.media[0]}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : undefined
                }
            >
                <Card.Meta
                    title={advertisement.title}
                    description={advertisement.description.length > 100
                        ? `${advertisement.description.substring(0, 100)}...`
                        : advertisement.description}
                />
            </Card>

            <Modal
                title={advertisement.title}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
                className="advertisement-modal"
            >
                {renderMediaContent()}

                <div className="p-4">
                    <div className="mb-4">
                        <p className="text-lg font-semibold">{advertisement.title}</p>
                        <p className="text-gray-600">{advertisement.description}</p>
                    </div>

                    <div className="space-y-2">
                        {advertisement.studentId?.name && (
                            <div className="flex items-center">
                                <UserOutlined className="mr-2 text-blue-500" />
                                <span>{advertisement.studentId.name}</span>
                            </div>
                        )}

                        {advertisement.date && (
                            <div className="flex items-center">
                                <CalendarOutlined className="mr-2 text-green-500" />
                                <span>{new Date(advertisement.date).toLocaleDateString()}</span>
                            </div>
                        )}

                        {advertisement.links && advertisement.links.length > 0 && (
                            <div>
                                <LinkOutlined className="mr-2 text-red-500" />
                                {advertisement.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline mr-2"
                                    >
                                        Link {index + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdvertisementCard;