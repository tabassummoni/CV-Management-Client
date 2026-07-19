import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function LoginSuccess() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/';
            } catch (e) {
                console.error("Failed to parse user data from URL", e);
                window.location.href = '/login';
            }
        } else {
            window.location.href = '/login';
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4 mx-auto"></div>
                <p className="text-base-content font-medium">Logging in successfully, redirecting...</p>
            </div>
        </div>
    );
}