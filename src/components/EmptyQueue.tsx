import React from 'react';
import { Empty, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface EmptyQueueProps {
    onRefresh: () => void;
}

const EmptyQueue: React.FC<EmptyQueueProps> = ({ onRefresh }) => {
    return (
        <div className="text-center py-12">
            <Empty
                description={
                    <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            No visitors in queue
                        </p>
                        <p className="text-sm text-gray-500">
                            The queue is empty. New visitors will appear here.
                        </p>
                    </div>
                }
            />
            <Button 
                icon={<ReloadOutlined />} 
                onClick={onRefresh}
                className="mt-4"
            >
                Refresh
            </Button>
        </div>
    );
};

export default EmptyQueue;