import { useState } from 'react'
import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/db'
import { posts } from '@/db/schema'
import { createPostSchema, type CreatePostInput } from '@/lib/validations'

const createPost = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => {
    return createPostSchema.parse(data)
  })
  .handler(async ({ data }: { data: CreatePostInput }) => {
    try {
      const db = getDb()
      
      const [newPost] = await db
        .insert(posts)
        .values({
          title: data.title,
          content: data.content,
          authorId: null,
          authorName: null,
        })
        .returning()

      return { success: true, post: newPost }
    } catch (error) {
      console.error('Error creating post:', error)
      throw new Error('Failed to create post')
    }
  })

export const Route = createFileRoute('/posts/new')({
  component: NewPost,
})

function NewPost() {
  // デバッグ: このコンポーネントがレンダリングされているか確認
  console.log('NewPost component is rendering')
  
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createPost({ data: { title, content } })
      
      if (result.success && result.post) {
        router.navigate({ to: '/posts' })
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create post')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/posts"
            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-2 mb-4"
          >
            ← Back to posts
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Post</h1>
          <p className="text-gray-400">Blog app built with TanStack Start</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter the title of the post"
            />
            <p className="mt-1 text-xs text-gray-500">
              {title.length}/200 characters
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={10000}
              rows={15}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y"
              placeholder="Enter the content of the post"
            />
            <p className="mt-1 text-xs text-gray-500">
              {content.length}/10000 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
            <Link
              to="/posts"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
