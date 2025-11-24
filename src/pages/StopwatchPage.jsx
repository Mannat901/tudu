import Stopwatch from '../components/Stopwatch'

export default function StopwatchPage() {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Stopwatch</h1>
            <p className="text-gray-500 mb-12">Track your time efficiently</p>
            <Stopwatch />
        </div>
    )
}
