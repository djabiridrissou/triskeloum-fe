import React from 'react';
import { Card, Image, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface VisitorCardProps {
    visitor: any;
}

const VisitorCard: React.FC<VisitorCardProps> = ({ visitor }) => {
    const photoUrl = visitor.visitorId?.photo || visitor.walkInData?.photo;
    const firstName = visitor.visitorId?.firstName || visitor.walkInData?.firstName;
    const lastName = visitor.visitorId?.lastName || visitor.walkInData?.lastName;
    const email = visitor.visitorId?.email || visitor.walkInData?.email;
    const phone = visitor.visitorId?.phone || visitor.walkInData?.phone;
    const badgeNumber = visitor.tracking?.badgeNumber;

    return (
        <Card className="text-center h-full">
            <div className="mb-4">
                {photoUrl ? (
                    <Image
                        src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${photoUrl}`}
                        alt="Visitor"
                        className="rounded-lg mx-auto"
                        width={300}
                        height={350}
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div className="w-48 h-60 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <UserOutlined style={{ fontSize: 48 }} className="text-gray-400" />
                    </div>
                )}
            </div>

            <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {firstName} {lastName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{email}</p>
                <p className="text-sm text-gray-600 mb-3">{phone}</p>

                {badgeNumber && (
                    <Tag color="blue" className="mb-2">
                        Badge #{badgeNumber}
                    </Tag>
                )}

                <Tag color="orange">Walk-in</Tag>
            </div>
        </Card>
    );
};

export default VisitorCard;