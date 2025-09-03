import { Swiper, SwiperSlide } from 'swiper/react';

const CategoryScroller = ({ categories }: any) => {
    return (
        <div className="relative group">
            <Swiper
                slidesPerView={4}
                spaceBetween={10}
                slidesPerGroup={1}
                loop={false}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                className="mySwiper"
            >
                {categories.map((category: any, index: any) => (
                    <SwiperSlide key={index}>
                        <span
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 whitespace-nowrap hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                        >
                            {category}
                        </span>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryScroller;