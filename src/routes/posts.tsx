import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
    component: PostsList,
})

function PostsList() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Posts</h1>
                    <p className="text-gray-400">Create Posts</p>
                </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-gray-400 text-center">
                    No posts yet. Create one below!
                </p>
            </div>
        </div>
    )
}