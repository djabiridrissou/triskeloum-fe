import { useState } from "react";
import { Star, Mail, Phone, Book, Clock, Award } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetTutorQuery } from "../../services/api";

const TutorPublicProfile = () => {
  const { id } = useParams();
  let { data: tutor, isLoading, error } = useGetTutorQuery(id || "");
  tutor = tutor?.data;

  // @ts-ignore
  const [showRatingModal, setShowRatingModal] = useState(false);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">
          Error loading tutor data
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">Tutor not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Main profile card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-100 h-40 flex items-center justify-center">
            <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center text-3xl font-bold text-gray-800 border-4 border-white shadow-md">
              {tutor.name.charAt(0)}
            </div>
          </div>
          
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
            <div className="mt-2 flex items-center justify-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={24}
                    className={`${star <= Math.floor(tutor.rating?.average || 0) 
                      ? "text-yellow-500 fill-yellow-500" 
                      : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700 font-medium">
                {tutor.rating?.average?.toFixed(1) || "0.0"} ({tutor.rating?.count || 0} reviews)
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Information</h2>
                
                <div className="flex items-center">
                  <Mail size={20} className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{tutor.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone size={20} className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{tutor.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock size={20} className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Hourly rate</p>
                    <p className="font-medium text-gray-900">${tutor.hourPrice}/hour</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Book size={20} className="text-gray-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Subjects taught</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tutor.courses?.[0]?.map((course: any, index: any) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">About</h2>
                {tutor.bio ? (
                  <p className="mt-4 text-gray-700">{tutor.bio}</p>
                ) : (
                  <p className="mt-4 text-gray-700">
                    {tutor.name} has been tutoring for {new Date().getFullYear() - new Date(tutor.createdAt).getFullYear()} year(s).
                    Specializing in {tutor.courses?.[0]?.join(', ') || 'various subjects'}.
                  </p>
                )}
                
                {tutor.qualifications?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Award size={18} className="mr-2 text-indigo-600" /> 
                      Qualifications
                    </h3>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      {tutor.qualifications.map((qualification: any, index: any) => (
                        <li key={index}>• {qualification}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        {tutor.reviews?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Recent Reviews</h2>
            
            <div className="mt-4 space-y-4">
              {tutor.reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center text-green-600 font-bold">
                        {review.studentId.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{review.studentId.name}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={16}
                              className={`${star <= review.rating 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPublicProfile;