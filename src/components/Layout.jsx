import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Timer, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

export default function Layout() {
    const location = useLocation()
    const { signOut, user } = useAuth()

    const navItems = [
        { path: '/', label: 'Tasks', icon: LayoutDashboard },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        { path: '/stopwatch', label: 'Stopwatch', icon: Timer },
    ]

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:left-0 md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50">
                <div className="flex flex-col h-full">
                    <div className="hidden md:block px-4 mb-8">
                        <div className="text-2xl font-bold text-blue-600">Tudu</div>
                        {user && (
                            <div className="text-xs text-gray-400 mt-1 truncate">{user.email}</div>
                        )}
                    </div>

                    <div className="flex justify-around md:flex-col md:space-y-2 flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center p-3 rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className="w-6 h-6 md:mr-3" />
                                    <span className="hidden md:block font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden md:block pt-4 border-t border-gray-100">
                        <button
                            onClick={signOut}
                            className="flex items-center w-full p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <LogOut className="w-6 h-6 mr-3" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>
            <main className="pb-24 md:pb-8 md:pl-64 pt-8 px-4 md:px-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}
