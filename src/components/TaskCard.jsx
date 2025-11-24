import { motion } from 'framer-motion'
import { Check, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
            className={clsx(
                "group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden",
                task.is_completed && "bg-gray-50"
            )}
            onClick={() => onEdit(task)}
        >
            {/* Priority/Status Indicator */}
            <div className={clsx(
                "absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300",
                task.is_completed ? "bg-green-400" : "bg-blue-500"
            )} />

            <div className="flex items-start justify-between pl-3">
                <div className="flex-1 min-w-0 mr-4">
                    <h3 className={clsx(
                        "text-lg font-semibold text-gray-900 mb-1 truncate transition-all duration-300",
                        task.is_completed && "text-gray-400 line-through"
                    )}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={clsx(
                            "text-sm text-gray-500 line-clamp-2 mb-3",
                            task.is_completed && "text-gray-300"
                        )}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        {task.due_date && (
                            <div className={clsx(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50",
                                task.is_completed ? "text-gray-300" : "text-blue-600 bg-blue-50"
                            )}>
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>{format(new Date(task.due_date), 'MMM d, h:mm a')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggle(task)}
                        className={clsx(
                            "p-2 rounded-xl transition-colors",
                            task.is_completed
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                        )}
                    >
                        <Check className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
