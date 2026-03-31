import React from 'react'

const Home = async () => {
    return (
        <>
            <div className='max-w-4xl mx-auto'></div>
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
                        <li><strong>Super Admin:</strong>  Full system access</li>
                        <li><strong>Admin</strong>  User & team management</li>
                        <li> <strong>Manager</strong>Team specific management</li>
                        <li><strong>User</strong>  Basic Dashboard</li>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default Home