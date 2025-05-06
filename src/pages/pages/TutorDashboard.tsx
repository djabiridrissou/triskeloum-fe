import {
    EditOutlined,
    SaveOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    StarOutlined,
    UserOutlined,
    SolutionOutlined,
    CalendarOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Tag,
    Typography,
    message,
    Rate,
    Upload,
    Timeline,
    List
} from 'antd';
import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { useGetTutorQuery, useUpdateTutorMutation } from '../../services/api';
import { RcFile } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TutorDashboard = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [isAvailabilityModalVisible, setIsAvailabilityModalVisible] = useState(false);
    const [newAvailability, setNewAvailability] = useState({
        day: 'Monday',
        slots: [{ start: '09:00', end: '12:00' }]
    });
    const [activeTab, setActiveTab] = useState('profile');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    // @ts-ignore
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const { data: tutorData, isLoading, refetch } = useGetTutorQuery(user._id);
    const [updateTutor] = useUpdateTutorMutation();

    const tutor = tutorData?.data || {};

    useEffect(() => {
        if (tutorData) {
            form.setFieldsValue({
                ...tutor,
                hourPrice: tutor.hourPrice,
                bio: tutor.bio,
                teachingStyle: tutor.teachingStyle
            });
        }
    }, [tutorData, form]);

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage;
    };

    const handleUploadChange = (info: any) => {
        let fileList = [...info.fileList];

        // Limiter à un seul fichier
        fileList = fileList.slice(-1);

        // Vérifier le statut du fichier
        fileList = fileList.map(file => {
            if (file.response) {
                // Fichier uploadé avec succès
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(fileList);

        // Afficher la prévisualisation si le fichier est valide
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            const file = info.file.originFileObj;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };


/*     const handleUpload = async (info: any) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (info.file.status === 'done') {
            try {
                const formData = new FormData();
                formData.append('picture', info.file.originFileObj as RcFile);

                // Utilisez votre mutation pour mettre à jour le tuteur
                await updateTutor({
                    id: user._id,
                    file: info.file.originFileObj
                }).unwrap();

                message.success('Profile picture updated successfully');
                refetch();
            } catch (error) {
                message.error('Failed to upload profile picture');
            } finally {
                setUploading(false);
            }
        }
    }; */

    const handleSave = async () => {
        try {
            let values = await form.validateFields();
            values = {
                ...values,
                id: user._id
            }
            await updateTutor(values).unwrap();
            message.success('Profile updated successfully');
            setIsEditing(false);
            refetch();
        } catch (err) {
            message.error('Failed to update profile');
        }
    };



    const renderProfileView = () => (
        <Card>
            <div className="text-center mb-6">
                <Avatar size={128} src={tutor.picture} icon={<UserOutlined />} />
                <Title level={3} className="mt-4">{tutor.name}</Title>
                <Text type="secondary">{tutor.email}</Text>
            </div>

            <Divider orientation="left">Basic Information</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Text strong><UserOutlined /> Name:</Text> {tutor.name}
                </Col>
                <Col span={12}>
                    <Text strong><SolutionOutlined /> Phone:</Text> {tutor.phoneNumber}
                </Col>
            </Row>

            <Divider orientation="left">Teaching Details</Divider>
            <Row gutter={16}>
                <Col span={8}>
                    <Text strong><DollarOutlined /> Hourly Rate:</Text> ${tutor.hourPrice}
                </Col>
                <Col span={8}>
                    <Text strong><ClockCircleOutlined /> Experience:</Text> {tutor.teachingExperience} years
                </Col>
                <Col span={8}>
                    <Text strong><StarOutlined /> Rating:</Text>
                    <Rate disabled defaultValue={tutor.rating?.average || 0} />
                    ({tutor.rating?.count || 0} reviews)
                </Col>
            </Row>

            <Divider orientation="left">About</Divider>
            <Text>{tutor.bio || 'No bio yet'}</Text>

            <Divider orientation="left">Courses</Divider>
            <Space size={[0, 8]} wrap>
                {tutor.courses?.map((courseGroup: any, i: any) => (
                    courseGroup.map((course: any, j: any) => (
                        <Tag color="blue" key={`${i}-${j}`}>{course}</Tag>
                    ))
                ))}
            </Space>
        </Card>
    );

    const renderProfileEdit = () => (
        <Form form={form} layout="vertical">
            <Card
                title="Edit Profile"
                extra={
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name="hourPrice" label="Hourly Rate ($)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="bio" label="Bio">
                    <TextArea rows={4} maxLength={500} />
                </Form.Item>

                <Form.Item name="teachingStyle" label="Teaching Style">
                    <Select>
                        <Option value="Structured">Structured</Option>
                        <Option value="Flexible">Flexible</Option>
                        <Option value="Interactive">Interactive</Option>
                        <Option value="Practical">Practical</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Profile Picture">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleUploadChange}
                        customRequest={async ({ file, onSuccess, onError }) => {
                            try {
                                const formData = new FormData();
                                formData.append('picture', file as RcFile);

                                await updateTutor({
                                    id: user._id,
                                    file: file
                                }).unwrap();

                                onSuccess?.('ok');
                                refetch();
                            } catch (error) {
                                onError?.(new Error('Upload failed'));
                            }
                        }}
                        onRemove={() => {
                            setFileList([]);
                            setPreviewImage('');
                            return false;
                        }}
                    >
                        {fileList.length >= 1 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{
                                width: '100%',
                                maxWidth: '128px',
                                marginTop: '10px',
                                borderRadius: '50%'
                            }}
                        />
                    )}
                </Form.Item>
            </Card>
        </Form>
    );

    const handleAddAvailability = async () => {
        try {
            // Préparer les nouvelles disponibilités
            const updatedAvailability = [
                ...(tutor.availability || []),
                newAvailability
            ];

            // Envoyer la mise à jour
            await updateTutor({
                id: user._id,
                availability: updatedAvailability
            }).unwrap();

            message.success('Availability updated successfully');
            setIsAvailabilityModalVisible(false);
            setNewAvailability({
                day: 'Monday',
                slots: [{ start: '09:00', end: '12:00' }]
            });
            refetch();
        } catch (err) {
            message.error('Failed to update availability');
        }
    };

    const handleRemoveAvailability = async (day: string) => {
        try {
            const updatedAvailability = tutor.availability.filter(
                (avail: any) => avail.day !== day
            );

            await updateTutor({
                id: user._id,
                availability: updatedAvailability
            }).unwrap();

            message.success('Availability removed successfully');
            refetch();
        } catch (err) {
            message.error('Failed to remove availability');
        }
    };


    const renderAvailability = () => (
        <Card
            title="Availability"
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAvailabilityModalVisible(true)}
                >
                    Add Availability
                </Button>
            }
        >
            {tutor.availability?.length > 0 ? (
                <Timeline>
                    {tutor.availability.map((avail: any, index: any) => (
                        <Timeline.Item
                            key={index}
                            dot={<CalendarOutlined />}
                            className="relative"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <Text strong>{avail.day}</Text>
                                    <div>
                                        {avail.slots.map((slot: any, i: any) => (
                                            <Tag key={i} color="blue">
                                                {slot.start} - {slot.end}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    danger
                                    size="small"
                                    onClick={() => handleRemoveAvailability(avail.day)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            ) : (
                <Text type="secondary">No availability set</Text>
            )}
        </Card>
    );

    const renderReviews = () => (
        <Card title="Reviews">
            {tutor.reviews?.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={tutor.reviews}
                    renderItem={(review: any) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={review.studentId?.picture} />}
                                title={<><Rate disabled value={review.rating} /> {review.studentId?.name}</>}
                                description={review.comment}
                            />
                            <div>{dayjs(review.createdAt).format('MMMM D, YYYY')}</div>
                        </List.Item>
                    )}
                />
            ) : (
                <Text type="secondary">No reviews yet</Text>
            )}
        </Card>
    );

    return (
        <div className="p-6 dashboard-container mx-auto maz-w-3xl">
            <Title level={2}>Tutor Dashboard</Title>

            <div className="mb-6 flex justify-between">
                <Button.Group>
                    <Button
                        type={activeTab === 'profile' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </Button>
                    <Button
                        type={activeTab === 'availability' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('availability')}
                    >
                        Availability
                    </Button>
                    <Button
                        type={activeTab === 'reviews' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </Button>
                </Button.Group>

                <div>
                    <Button type="primary" onClick={() => navigate('/messages')}>
                        Messages
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <Card loading />
            ) : (
                <>
                    {activeTab === 'profile' && (
                        <>
                            {isEditing ? renderProfileEdit() : renderProfileView()}
                            <div className="mt-4 text-right">
                                <Button
                                    type={isEditing ? 'default' : 'primary'}
                                    icon={isEditing ? <EditOutlined /> : <EditOutlined />}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'availability' && renderAvailability()}
                    {activeTab === 'reviews' && renderReviews()}
                </>
            )}

            <Modal
                title="Add Availability"
                visible={isAvailabilityModalVisible}
                onOk={handleAddAvailability}
                onCancel={() => setIsAvailabilityModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Day">
                        <Select
                            value={newAvailability.day}
                            onChange={day => setNewAvailability({ ...newAvailability, day })}
                        >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <Option key={day} value={day}>{day}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Time Slots">
                        {newAvailability.slots.map((slot, index) => (
                            <Space key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                <Input
                                    type="time"
                                    value={slot.start}
                                    onChange={e => {
                                        const slots = [...newAvailability.slots];
                                        slots[index].start = e.target.value;
                                        setNewAvailability({ ...newAvailability, slots });
                                    }}
                                />
                                <Input
                                    type="time"
                                    value={slot.end}
                                    onChange={e => {
                                        const slots = [...newAvailability.slots];
                                        slots[index].end = e.target.value;
                                        setNewAvailability({ ...newAvailability, slots });
                                    }}
                                />
                                <Button
                                    danger
                                    onClick={() => {
                                        const slots = newAvailability.slots.filter((_, i) => i !== index);
                                        setNewAvailability({ ...newAvailability, slots });
                                    }}
                                >
                                    Remove
                                </Button>
                            </Space>
                        ))}
                        <Button
                            onClick={() => {
                                setNewAvailability({
                                    ...newAvailability,
                                    slots: [...newAvailability.slots, { start: '09:00', end: '12:00' }]
                                });
                            }}
                        >
                            Add Time Slot
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TutorDashboard;