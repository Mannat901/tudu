import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

export default function Dashboard() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if (user) fetchTasks()
    }, [user])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setTasks(data || [])
        } catch (error) {
            console.error('Error fetching tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (taskData) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ ...taskData, user_id: user.id }])
                .select()

            if (error) throw error
            setTasks([data[0], ...tasks])
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleUpdateTask = async (taskData) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update(taskData)
                .eq('id', editingTask.id)
                .select()

            if (error) throw error
            setTasks(tasks.map(t => t.id === editingTask.id ? data[0] : t))
            setEditingTask(null)
        } catch (error) {
            console.error('Error updating task:', error)
        }
    }

    const handleDeleteTask = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)

            if (error) throw error
            setTasks(tasks.filter(t => t.id !== id))
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    const handleToggleTask = async (task) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ is_completed: !task.is_completed })
                .eq('id', task.id)
                .select()

            if (error) throw error
            setTasks(tasks.map(t => t.id === task.id ? data[0] : t))
        } catch (error) {
            console.error('Error toggling task:', error)
        }
    }

    const openEditModal = (task) => {
        setEditingTask(task)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (data) => {
        if (editingTask) {
            handleUpdateTask(data)
        } else {
            handleCreateTask(data)
        }
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingTask(null)
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
                    <p className="text-gray-500">
                        {loading
                            ? 'Loading...'
                            : `You have ${tasks.filter(t => !t.is_completed).length} pending tasks`
                        }
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                </motion.button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onEdit={openEditModal}
                            />
                        ))}
                    </AnimatePresence>

                    {tasks.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg">No tasks yet. Create one to get started!</p>
                        </div>
                    )}
                </div>
            )}

            <TaskForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                initialData={editingTask}
            />
        </div>
    )
}
