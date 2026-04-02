"use client"
import { User } from '@/app/types/types'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface HeaderProps {
    user: User | null;
}

const Header = ({ user }: HeaderProps) => {
    const pathname = usePathname();
    const navigaton = [
        { name: "Home", href: '/', show: true },
        { name: "Dashboard", href: '/dashboard', show: !!user }
    ].filter((item) => item.show);

    const getNavItemClass = (href: string) => {
        let isActive = false
        if (href === '/') {
            isActive = pathname === '/';
        } else if (href === '/dashboard') {
            isActive = pathname.startsWith(href);
        }

        return `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
    }
    return (
        <header className='bg-slate-900 border-b border-slate-700'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center h-16'>
                    {/* logo */}
                    <Link
                        href='/'
                        className='font-bold text-xl text-white'>
                        TeamAccess
                    </Link>
                    {/* nav */}
                    <nav className='flex items-center space-x-6'>
                        {navigaton.map((item) => (
                            <Link key={item.name} href={item.href} className={getNavItemClass(item.href)}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* user info */}

                    <div className='flex items-center space-x-4'>
                        {user ? (
                            <>
                                <span className='text-sm text-slate-300'>User</span>
                                <button
                                    // onClick={ }
                                    className='px-3 py-2 bg-red-500 text-white text-sm rounded-xl'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className='px-4 py-2 text-slate-300 text-sm hover:text-white transition-colors'
                                >
                                    Login
                                </Link>
                                {" "}
                                <Link
                                    href="/register"
                                    className='px-4 py-2 bg-blue-600 text-white  rounded hover:bg-blue-700 transition-colors '
                                >
                                    Register
                                </Link>
                            </>
                        )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header