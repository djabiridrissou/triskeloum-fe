import React, { useState } from "react";
import { Card, Empty, Spin, Tag, Avatar, Rate, Tooltip, Pagination } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  DollarOutlined,
  UserOutlined,
  StarFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { useGetTutorsQuery } from "../services/api";

interface Tutor {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  picture?: string;
  hourPrice: number;
  courses: string[][];
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const TutorsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const {
    data: tutorsData,
    isLoading: loadingTutors,
    error: tutorError,
  } = useGetTutorsQuery({
    page: currentPage,
    courses: selectedCourses.length > 0 ? selectedCourses : undefined,
  });

  const handleCourseFilter = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
    // Reset to first page when filtering
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loadingTutors) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (tutorError) {
    return (
      <div className="text-center text-red-500 py-6">
        Failed to load tutors. Please try again later.
      </div>
    );
  }

  // Extract tutors and pagination info safely
  const tutors = tutorsData?.data || [];
  const pagination: PaginationInfo = tutorsData?.pagination || {
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  };

  // Get unique courses from all tutors
  const allCourses = Array.from(
    new Set(
      tutors.flatMap((tutor: Tutor) =>
        tutor.courses.flat().map((course: string) => course.trim())
      )
    )
  ).sort();

  return (
    <div className="mx-auto px-4">
      {/* Course Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Filter by courses:</h3>
        <div className="flex flex-wrap gap-2">
          {allCourses.map((course: any) => (
            <Tag.CheckableTag
              key={course}
              checked={selectedCourses.includes(course)}
              onChange={() => handleCourseFilter(course)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedCourses.includes(course)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {course}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>

      {tutors.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="No tutors match your filters" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {tutors.map((tutor: Tutor) => (
              <Card
                key={tutor._id}
                hoverable
                className="shadow-md rounded-xl border border-gray-100 p-2"
              >
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    size={90}
                    src={
                      tutor.picture
                        ? `${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${tutor.picture}`
                        : undefined
                    }
                    icon={<UserOutlined />}
                    className="mb-3"
                  />

                  <h3 className="text-lg font-semibold text-gray-800">{tutor.name}</h3>
                  <Rate 
                    character={<StarFilled />} 
                    defaultValue={4.5} 
                    allowHalf 
                    disabled 
                    style={{ fontSize: 8, marginBottom: 5 }} 
                  />
                  <Tag icon={<DollarOutlined />} color="gold" className="mt-2">
                    {tutor.hourPrice}/h
                  </Tag>

                  <div className="mt-3 text-sm text-gray-600">
                    <Tooltip title={tutor.email}>
                      <div className="flex items-center gap-2">
                        <MailOutlined className="text-blue-500" />
                        <span className="truncate max-w-[180px]">{tutor.email}</span>
                      </div>
                    </Tooltip>
                    <div className="flex items-center justify-between mt-2 w-full space-x-2">
                      <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-green-500" />
                        <span>{tutor.phoneNumber}</span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition duration-200 flex items-center">
                        <MessageOutlined />
                      </button>
                    </div>
                  </div>

                  <div className="w-full mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Courses:</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {tutor.courses.flat().map((course: string, index: number) => (
                        <Tooltip key={index} title={course}>
                          <Tag color="blue" className="text-xs px-2 py-0.5 truncate max-w-[100px]">
                            {course}
                          </Tag>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TutorsTab;