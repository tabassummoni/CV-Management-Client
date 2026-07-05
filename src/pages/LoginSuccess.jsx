import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            window.location.href = '/';
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg text-purple-600 mb-4"></div>
                <p className="text-gray-600 font-medium">সফলভাবে লগইন হয়েছে, ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
            </div>
        </div>
    );
}