import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {desc} from 'drizzle-orm'
import { posts } from '@/db/schema'

const getPosts = createServerFn({
    method: 'GET',
}).handler(async () => {
  try {
    return await db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)],
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
})

export const Route = createFileRoute('/posts')({
  loader: async () => {
    try {
      return await getPosts()
    } catch (error) {
      console.error('Loader error:', error)
      // エラーが発生した場合は空配列を返す
      return []
    }
  },
  component: PostsList,
})

function PostsList() {
  const postsData = Route.useLoaderData()
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Posts</h1>
                    <p className="text-gray-400">Create Posts</p>
                </div>
            </div>

            {postsData.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                    <p className="text-gray-400 text-center">
                        No posts yet. Create one below!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {postsData.map((post) => (
              <div
                key={post.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {post.authorName && (
                    <span>Author: {post.authorName}</span>
                  )}
                  {post.createdAt && (
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </div>
              </div>
            ))}
            </div>
            )}
        </div>
    )
}