import React from 'react';
import { useForm } from 'react-hook-form';
import { submitFeedback } from '../services/feedbackService';
import { toast } from 'react-toastify';
import { FiSend } from 'react-icons/fi';

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            // Add a default type if needed, or make it a form field
            const feedbackData = { ...data, type: 'general' }; 
            await submitFeedback(feedbackData);
            toast.success('Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ xem xét sớm.');
            reset(); // Clear the form
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error(error.message || 'Gửi phản hồi thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Liên Hệ & Góp Ý</h1>
            <p className="text-center text-gray-600 mb-8">Chúng tôi luôn lắng nghe ý kiến của bạn. Vui lòng điền vào biểu mẫu bên dưới.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                    <input
                        type="text"
                        id="name"
                        {...register("name", { required: "Vui lòng nhập họ tên." })}
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Vui lòng nhập email.",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Địa chỉ email không hợp lệ.",
                            },
                        })}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                 <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                    <input
                        type="text"
                        id="subject"
                        {...register("subject", { required: "Vui lòng nhập chủ đề." })}
                        className={`w-full px-3 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                    <textarea
                        id="message"
                        rows="5"
                        {...register("message", { required: "Vui lòng nhập nội dung góp ý." })}
                        className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Đang gửi...' : <>Gửi Phản Hồi <FiSend className="ml-2 h-4 w-4" /></>}
                </button>
            </form>
        </div>
    );
};

export default ContactPage; 