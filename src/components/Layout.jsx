import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Timer, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'
import logo from '../assets/tudu_logo.png'

export default function Layout() {
    const location = useLocation()
    const { signOut, user } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const navItems = [
        { path: '/', label: 'Tasks', icon: LayoutDashboard },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        { path: '/stopwatch', label: 'Stopwatch', icon: Timer },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:top-0 md:bottom-auto md:left-0 md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50 transition-colors duration-200">
                <div className="flex flex-col h-full">
                    <div className="hidden md:flex flex-col items-center gap-2 px-4 mb-8">
                        <img src={logo} alt="Tudu logo" className="h-24 w-auto object-contain" />
                        <div>
                            {user && (
                                <div className="text-xs text-gray-400 mt-1 truncate max-w-[10rem]">{user.email}</div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center justify-between px-2 py-2 mb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Tudu logo" className="h-10 w-auto object-contain" />
                        </div>
                        {user && (
                            <div className="text-xs text-gray-400 truncate text-right max-w-[60%]">{user.email}</div>
                        )}
                    </div>

                    <div className="flex justify-around md:flex-col md:justify-start md:space-y-2 flex-1">
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
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                    )}
                                >
                                    <Icon className="w-6 h-6 md:mr-3" />
                                    <span className="hidden md:block font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden md:block pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
                        >
                            {theme === 'light' ? <Moon className="w-6 h-6 mr-3" /> : <Sun className="w-6 h-6 mr-3" />}
                            <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>
                        <button
                            onClick={signOut}
                            className="flex items-center w-full p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
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
