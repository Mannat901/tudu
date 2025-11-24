import { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function Calendar({ tasks }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const selectedDateTasks = tasks.filter(task =>
        task.due_date && isSameDay(new Date(task.due_date), selectedDate)
    )

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, dayIdx) => {
                        const dayTasks = tasks.filter(task =>
                            task.due_date && isSameDay(new Date(task.due_date), day)
                        )
                        const hasTasks = dayTasks.length > 0
                        const isSelected = isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, monthStart)

                        return (
                            <motion.button
                                key={day.toString()}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDate(day)}
                                className={clsx(
                                    "relative h-14 rounded-2xl flex flex-col items-center justify-center transition-all",
                                    !isCurrentMonth && "text-gray-300",
                                    isSelected
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "hover:bg-gray-50 text-gray-700",
                                    isToday(day) && !isSelected && "text-blue-600 font-bold bg-blue-50"
                                )}
                            >
                                <span className="text-sm">{format(day, 'd')}</span>
                                {hasTasks && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayTasks.slice(0, 3).map((_, i) => (
                                            <div
                                                key={i}
                                                className={clsx(
                                                    "w-1 h-1 rounded-full",
                                                    isSelected ? "bg-blue-300" : "bg-blue-500"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            <div className="lg:w-96">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
                </h3>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {selectedDateTasks.length > 0 ? (
                            selectedDateTasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3"
                                >
                                    <div className={clsx(
                                        "w-1 self-stretch rounded-full",
                                        task.is_completed ? "bg-green-400" : "bg-blue-500"
                                    )} />
                                    <div>
                                        <h4 className={clsx(
                                            "font-medium text-gray-900",
                                            task.is_completed && "line-through text-gray-400"
                                        )}>
                                            {task.title}
                                        </h4>
                                        {task.due_date && (
                                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{format(new Date(task.due_date), 'h:mm a')}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
                            >
                                <p className="text-gray-400">No tasks for this day</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
