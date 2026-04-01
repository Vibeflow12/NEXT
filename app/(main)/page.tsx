import Link from 'next/link';

const Home = async () => {
    const user = false;
    return (
        <>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl font-bold mb-6 text-white'>
                    Team Access Demo
                </h1>
                <p className='text-slate-300 mb-8'>
                    This demo showcase Next.js 16 access control features with role-based permissions.
                </p>
                <div className='grid md:grid-cols-2 gap-6 mb-8'>
                    <div className='bg-slate-800 p-6 border border-slate-700 rounded-lg'>
                        <h3 className='font-semibold mb-3 text-white'>
                            Features Demonstrated
                        </h3>
                        <ul className='list-disc list-inside space-y-1 text-sm text-slate-300'>
                            <li>Role-based access control (RBAC)</li>
                            <li>Route protection with middleware</li>
                            <li>server-side permission check</li>
                            <li>Client-side permission hooks</li>
                            <li>Dynamic route access</li>
                        </ul>
                    </div>

                    <div className='bg-slate-800 p-6 border border-slate-700 rounded-lg'>
                        <h3 className='font-semibold mb-3 text-white'>
                            User Roles
                        </h3>
                        <ul className='list-disc list-inside space-y-1 text-sm text-slate-300'>
                            <li><strong className='text-[#fbbf24]'>Super Admin:</strong>  Full system access</li>
                            <li><strong className='text-[#10b981]'>Admin:</strong> User & team management</li>
                            <li><strong className='text-[#f97316]'>Manager:</strong> Team specific management</li>
                            <li><strong className='text-[#f43f5e]'>User:</strong> Basic Dashboard</li>

                        </ul>
                    </div>
                </div>
                <div>
                    {user ? <div className='bg-green-900/30 border  border-green-600 p-4 rounded-lg'>
                        <p className='text-green-300'>
                            Welcome back, <strong> text</strong> ! You are logged in as{" "}<strong className='text-green-200'>USER</strong>
                        </p>
                        <Link
                            href="/dashboard"
                            className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors '
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                        :
                        <div className='bg-blue-900/30 border max-w-full  border-blue-600 p-4 rounded-lg'>
                            <p className='text-slate-300 mb-3'>
                                You are logged in as{" "}<strong className='text-green-200'>USER</strong>
                            </p>
                            <Link
                                href="/login"
                                className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors '
                            >
                                Login
                            </Link>
                            {" "}
                            <Link
                                href="/register"
                                className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors '
                            >
                                Register
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Home