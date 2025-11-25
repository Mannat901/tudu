import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react'
import clsx from 'clsx'

export default function TaskForm({ isOpen, onClose, onSubmit, initialData = null }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dueTime, setDueTime] = useState('')

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description || '')
            if (initialData.due_date) {
                const date = new Date(initialData.due_date)
                setDueDate(date.toISOString().split('T')[0])
                setDueTime(date.toTimeString().slice(0, 5))
            } else {
                setDueDate('')
                setDueTime('')
            }
        } else {
            setTitle('')
            setDescription('')
            setDueDate('')
            setDueTime('')
        }
    }, [initialData, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()
        let fullDate = null
        if (dueDate) {
            fullDate = new Date(`${dueDate}T${dueTime || '00:00'}`)
        }
        onSubmit({
            title,
            description,
            due_date: fullDate ? fullDate.toISOString() : null
        })
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-3xl shadow-2xl pointer-events-auto mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {initialData ? 'Edit Task' : 'New Task'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="What needs to be done?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-lg font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 border-b-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 focus:ring-0 px-0 py-2 transition-colors bg-transparent text-gray-900 dark:text-white"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Add details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-sm text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            value={dueTime}
                                            onChange={(e) => setDueTime(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-sm text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                                    >
                                        {initialData ? 'Save Changes' : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
