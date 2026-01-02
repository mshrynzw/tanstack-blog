import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/new')({
  component: NewPost,
})

function NewPost() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">New Post</h1>
          <p className="text-gray-400">Write a new blog post</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <p className="text-gray-400 text-center">
            Next lesson will add form functionality!
          </p>
        </div>
      </div>
    </div>
  )
}
