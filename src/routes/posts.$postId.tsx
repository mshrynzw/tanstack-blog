import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
    component: PostDetail,
})

function PostDetail() {
    const { postId } = Route.useParams()
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Post Detail (ID: {postId})
            </h1>
            <p className="text-gray-400">
              Next lesson will add data fetching functionality!
            </p>
          </div>
        </div>
      </div>
    )
}
