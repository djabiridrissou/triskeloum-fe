import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Upload, message, Row, Col, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';

const { TextArea } = Input;
const { Option } = Select;

interface Advertisement {
  id?: string;
  studentId: string;
  type: string;
  title: string;
  description: string;
  date?: Date | null;
  time?: string;
  location?: string;
  links?: string[];
  media?: string[];
  isGeneral?: boolean;
  departmentId?: string;
  levelId?: string;
  classId?: string;
  isNow?: boolean;
}

interface AdvertisementFormProps {
  initialData?: Advertisement;
  studentId: string;
  onSubmitSuccess?: (advertisement: Advertisement) => void;
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({ 
  initialData, 
  studentId, 
  onSubmitSuccess 
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [links, setLinks] = useState<string[]>(initialData?.links || []);
  const [audienceType, setAudienceType] = useState<string>(
    initialData?.isGeneral ? 'general' : 
    initialData?.departmentId && initialData?.levelId && initialData?.classId ? 'class' :
    initialData?.departmentId && initialData?.levelId ? 'level' : 
    initialData?.departmentId ? 'department' : 'general'
  );
  const [isNow, setIsNow] = useState<boolean>(initialData?.isNow || false);
  //@ts-ignore
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(initialData?.departmentId);
  //@ts-ignore
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(initialData?.levelId);

  // Fetch data from API with dependencies

  // Extract data from API responses
  
  useEffect(() => {
    if (initialData) {
      // Prepare initial values
      const formValues: any = {
        ...initialData,
      };
      
      // Handle date and time correctly
      if (initialData.date) {
        formValues.date = moment(initialData.date);
      }
      
      // Handle time separately if available
      if (initialData.time) {
        formValues.time = moment(initialData.time, 'HH:mm');
      }
      
      form.setFieldsValue(formValues);
      
      // Prepare file list if media exists
      if (initialData.media && initialData.media.length > 0) {
        const preparedFileList = initialData.media.map((mediaUrl, index) => ({
          uid: `-${index}`,
          name: mediaUrl.split('/').pop() || `media-${index}`,
          status: 'done',
          url: mediaUrl,
        }));
        setFileList(preparedFileList);
      }

      // Set audience type and necessary fields based on initial data
      if (initialData.isGeneral) {
        setAudienceType('general');
      } else if (initialData.classId) {
        setAudienceType('class');
        setSelectedDepartment(initialData.departmentId);
        setSelectedLevel(initialData.levelId);
      } else if (initialData.levelId) {
        setAudienceType('level');
        setSelectedDepartment(initialData.departmentId);
        setSelectedLevel(initialData.levelId);
      } else if (initialData.departmentId) {
        setAudienceType('department');
        setSelectedDepartment(initialData.departmentId);
      }

      // Set isNow state
      setIsNow(initialData.isNow || false);
    }
  }, [initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('studentId', studentId);
      formData.append('type', values.type);
      formData.append('title', values.title);
      formData.append('description', values.description);
      
      // Add audience selection fields
      formData.append('isGeneral', (audienceType === 'general').toString());
      
      if (audienceType === 'department' && values.departmentId) {
        formData.append('departmentId', values.departmentId);
      } else if (audienceType === 'level' && values.departmentId && values.levelId) {
        formData.append('departmentId', values.departmentId);
        formData.append('levelId', values.levelId);
      } else if (audienceType === 'class' && values.departmentId && values.levelId && values.classId) {
        formData.append('departmentId', values.departmentId);
        formData.append('levelId', values.levelId);
        formData.append('classId', values.classId);
      }

      // Add isNow field
      formData.append('isNow', isNow.toString());
      
      // Add date and time if not using isNow
      if (!isNow) {
        if (values.date) {
          formData.append('date', values.date.format('YYYY-MM-DD'));
        }
        
        if (values.time) {
          formData.append('time', values.time.format('HH:mm'));
        }
      }
      
      if (values.location) {
        formData.append('location', values.location);
      }
      
      // Add links
      if (links.length > 0) {
        formData.append('links', JSON.stringify(links));
      }
      
      // Add existing media URLs
      const existingMedia = initialData?.media || [];
      formData.append('existingMedia', JSON.stringify(existingMedia));
      
      // Add new files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });
      
      // Add advertisement ID for update
      if (initialData?.id) {
        formData.append('id', initialData.id);
      }

      const endpoint = '/api/v1/advertisements/create';

      const token = localStorage.getItem('rToken');
      const response = await fetch(`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include'
      });
      
      const responseData = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: 'Error!',
          text: responseData.message || 'Failed to submit advertisement',
          icon: 'error',
          confirmButtonText: 'Try again',
        });
        return;
      }

      message.success(initialData?.id 
        ? 'Advertisement updated successfully' 
        : 'Advertisement created successfully'
      );

      // Reset form
      form.resetFields();
      setFileList([]);
      setLinks([]);
      setAudienceType('general');
      setIsNow(false);
      setSelectedDepartment(undefined);
      setSelectedLevel(undefined);

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(responseData.data);
      }
    } catch (error: any) {
      console.error('Error submitting advertisement:', error);
      message.error(error.message || 'Failed to submit advertisement');
    }
  };

  const handleFileChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList);
  };

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

/*   const handleAudienceTypeChange = (e: any) => {
    setAudienceType(e.target.value);
    // Reset dependent fields when audience type changes
    if (e.target.value === 'general') {
      setSelectedDepartment(undefined);
      setSelectedLevel(undefined);
      form.setFieldsValue({
        departmentId: undefined,
        levelId: undefined,
        classId: undefined
      });
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedLevel(undefined);
    form.setFieldsValue({
      levelId: undefined,
      classId: undefined
    });
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    form.setFieldsValue({
      classId: undefined
    });
  }; */

  const handleIsNowChange = (e: any) => {
    setIsNow(e.target.checked);
  };



  return (
    <div className="p-4">
      <Card title={<div className="text-center font-semibold">New Advertisement</div>} className="max-w-4xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {/* Basic Information Section */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select advertisement type' }]}
              >
                <Select placeholder="Select advertisement type">
                  <Option value="event">Event</Option>
                  <Option value="service">Service</Option>
                  <Option value="promotion">Promotion</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter advertisement title' }]}
              >
                <Input placeholder="Enter advertisement title" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter advertisement description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter detailed description"
            />
          </Form.Item>

          {/* Audience Selection Section */}
         {/*  <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Target Audience</h3>
            <Radio.Group 
              value={audienceType} 
              onChange={handleAudienceTypeChange} 
              className="mb-4"
              aria-label="Select target audience"
            >
              <Radio.Button value="general">General</Radio.Button>
              <Radio.Button value="department">Department</Radio.Button>
              <Radio.Button value="level">Level</Radio.Button>
              <Radio.Button value="class">Class</Radio.Button>
            </Radio.Group>

            {(audienceType === 'department' || audienceType === 'level' || audienceType === 'class') && (
              <Form.Item
                name="departmentId"
                label="Department"
                rules={[{ required: true, message: 'Please select a department' }]}
              >
                <Select 
                  placeholder="Select department first"
                  aria-label="Department selection"
                  onChange={handleDepartmentChange}
                  loading={isLoadingDepartments}
                  value={selectedDepartment}
                >
                  {departments.map((dept: any) => (
                    <Option key={dept._id} value={dept._id}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

           
            {(audienceType === 'level' || audienceType === 'class') && (
              <Form.Item
                name="levelId"
                label="Level"
                rules={[{ required: true, message: 'Please select a level' }]}
              >
                <Select 
                  placeholder={selectedDepartment ? "Select level" : "Select department first"}
                  aria-label="Level selection"
                  onChange={handleLevelChange}
                  loading={isLoadingLevels}
                  disabled={!selectedDepartment}
                  value={selectedLevel}
                >
                  {levels.map((level: any) => (
                    <Option key={level._id} value={level._id}>{level.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

         
            {audienceType === 'class' && (
              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: 'Please select a class' }]}
              >
                <Select 
                  placeholder={selectedLevel ? "Select class" : "Select level first"}
                  aria-label="Class selection"
                  loading={isLoadingClasses}
                  disabled={!selectedLevel}
                >
                  {classes.map((cls: any) => (
                    <Option key={cls._id} value={cls._id}>{cls.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>
 */}
          {/* Date and Time Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Schedule</h3>
            <Form.Item
              name="isNow"
              valuePropName="checked"
            >
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isNow}
                  onChange={handleIsNowChange}
                  className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  id="useCurrentDate"
                />
                <label htmlFor="useCurrentDate" className="text-sm font-medium text-gray-700">
                  Use current date and time
                </label>
              </div>
            </Form.Item>

            {!isNow && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="date" 
                    label="Date"
                  >
                    <DatePicker 
                      className="w-full" 
                      placeholder="Select date (optional)"
                      aria-label="Select date"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="time" 
                    label="Time"
                  >
                    <TimePicker 
                      format="HH:mm" 
                      className="w-full"
                      placeholder="Select time (optional)"
                      use12Hours={false}
                      aria-label="Select time"
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Form.Item name="location" label="Location">
              <Input 
                placeholder="Enter location (optional)" 
                aria-label="Enter location"
              />
            </Form.Item>
          </div>

          {/* Links Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Links</h3>
            {links.map((link, index) => (
              <div key={index} className="flex mb-2">
                <Input 
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="Enter link"
                  className="mr-2"
                  aria-label={`Link ${index + 1}`}
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove link ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLink}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Add new link"
            >
              + Add Link
            </button>
          </div>

          {/* Media Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Media</h3>
            <Form.Item>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
                aria-label="Upload media files"
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <button 
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label={initialData?.id ? 'Update advertisement' : 'Create advertisement'}
            >
              {initialData?.id ? 'Update Advertisement' : 'Create Advertisement'}
            </button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdvertisementForm;