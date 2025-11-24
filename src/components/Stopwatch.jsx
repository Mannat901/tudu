import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Flag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false)
    const [time, setTime] = useState(0)
    const [laps, setLaps] = useState([])
    const intervalRef = useRef(null)

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(t => t + 10)
            }, 10)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isRunning])

    const toggleTimer = () => setIsRunning(!isRunning)

    const resetTimer = () => {
        setIsRunning(false)
        setTime(0)
        setLaps([])
    }

    const addLap = () => {
        setLaps(prev => [time, ...prev])
    }

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const centiseconds = Math.floor((ms % 1000) / 10)
        return {
            m: minutes.toString().padStart(2, '0'),
            s: seconds.toString().padStart(2, '0'),
            c: centiseconds.toString().padStart(2, '0')
        }
    }

    const display = formatTime(time)

    return (
        <div className="max-w-md mx-auto">
            {/* Timer Display */}
            <div className="bg-white rounded-full aspect-square flex items-center justify-center shadow-2xl shadow-blue-100 border-4 border-blue-50 mb-12 relative overflow-hidden">
                <div className="text-center z-10">
                    <div className="text-7xl font-bold font-mono text-gray-900 tracking-tighter">
                        {display.m}:{display.s}
                    </div>
                    <div className="text-3xl font-mono text-blue-500 font-medium mt-2">
                        .{display.c}
                    </div>
                </div>

                {/* Animated Background Ring */}
                {isRunning && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent opacity-20"
                    />
                )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-6 mb-12">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw className="w-6 h-6" />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTimer}
                    className={clsx(
                        "w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all",
                        isRunning
                            ? "bg-red-500 text-white shadow-red-200 hover:bg-red-600"
                            : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                    )}
                >
                    {isRunning ? (
                        <Pause className="w-10 h-10 fill-current" />
                    ) : (
                        <Play className="w-10 h-10 fill-current ml-1" />
                    )}
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={addLap}
                    disabled={!isRunning}
                    className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Flag className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Laps */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Laps</h3>
                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {laps.map((lapTime, index) => {
                            const lapDisplay = formatTime(lapTime)
                            return (
                                <motion.div
                                    key={laps.length - index}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
                                >
                                    <span className="text-gray-400 font-mono">#{laps.length - index}</span>
                                    <span className="text-gray-900 font-mono font-medium">
                                        {lapDisplay.m}:{lapDisplay.s}.{lapDisplay.c}
                                    </span>
                                </motion.div>
                            )
                        })}
                        {laps.length === 0 && (
                            <p className="text-center text-gray-400 py-4 text-sm">No laps recorded</p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
