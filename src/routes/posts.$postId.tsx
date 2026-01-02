import { createFileRoute, Link } from '@tanstack/react-router'
import { getDb } from '@/db'
import { posts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const postIdNum = parseInt(params.postId, 10)
    
    if (isNaN(postIdNum)) {
      return null
    }

    try {
      // データベース接続を取得
      const db = getDb()
      
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postIdNum),
      })

      return post || null
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  },
  component: PostDetail,
})

function PostDetail() {
  const post = Route.useLoaderData()

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
            <p className="text-gray-400 mb-6">
              The specified post does not exist or has been deleted.
            </p>
            <Link
              to="/posts"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              ← Back to posts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/posts"
            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-2"
          >
            ← Back to posts
          </Link>
        </div>

        <article className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-slate-700">
            {post.authorName && (
              <span>Author: {post.authorName}</span>
            )}
            {post.createdAt && (
              <span>
                Created at: {new Date(post.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}