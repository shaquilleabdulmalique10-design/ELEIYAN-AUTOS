'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPost } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'CAR_NEWS', label: 'Car News' },
  { value: 'MAINTENANCE_TIPS', label: 'Maintenance Tips' },
  { value: 'CAR_OF_THE_WEEK', label: 'Car of the Week' },
  { value: 'BUYING_GUIDE', label: 'Buying Guide' },
]

const EMPTY_FORM = {
  title: '', excerpt: '', body: '', coverImage: '',
  author: 'Eleniyan Motors', category: 'CAR_NEWS',
  tags: [] as string[], published: false, seoTitle: '', seoDesc: '',
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken ?? ''

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await getBlogPosts({ limit: '50' })
      setPosts(res.data)
      setTotal(res.total)
    } catch (err) {
      toast.error('Failed to load blog posts')
      console.error('Blog fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setTagInput('')
    setShowForm(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      coverImage: post.coverImage || '',
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      published: post.published,
      seoTitle: post.seoTitle || '',
      seoDesc: post.seoDesc || '',
    })
    setTagInput('')
    setShowForm(true)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.body) {
      toast.error('Title, excerpt and body are required')
      return
    }
    if (!token) {
      toast.error('Not authenticated. Please refresh and log in again.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateBlogPost(editing.id, form, token)
        toast.success('Post updated!')
      } else {
        await createBlogPost(form, token)
        toast.success('Post created!')
      }
      setShowForm(false)
      fetchPosts()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save post'
      toast.error(msg)
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setDeleting(post.id)
    try {
      await deleteBlogPost(post.id, token)
      toast.success('Post deleted')
      fetchPosts()
    } catch {
      toast.error('Failed to delete post')
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, { published: !post.published }, token)
      toast.success(post.published ? 'Post unpublished' : 'Post published!')
      fetchPosts()
    } catch {
      toast.error('Failed to update post')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl text-navy">Blog</h1>
          <p className="text-sm text-gray-400">{total} post{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchPosts} className="btn-ghost p-2"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openNew} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Posts table */}
      {!showForm && (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      No blog posts yet.{' '}
                      <button onClick={openNew} className="text-gold hover:underline">Create your first post</button>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{CATEGORIES.find(c => c.value === post.category)?.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-full',
                          post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        )}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            title={post.published ? 'Unpublish' : 'Publish'}
                            className={cn(
                              'p-1.5 rounded transition-colors',
                              post.published
                                ? 'text-green-500 hover:text-gray-400 hover:bg-gray-100'
                                : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                            )}
                          >
                            {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            className="p-1.5 rounded text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            disabled={deleting === post.id}
                            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-heading text-base text-navy">
              {editing ? 'Edit Post' : 'New Blog Post'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="form-label">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="form-input"
                placeholder="e.g. Top 5 Cars to Buy in Nigeria 2024"
              />
            </div>

            <div>
              <label className="form-label">Excerpt <span className="text-red-500">*</span></label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="form-input resize-none"
                placeholder="Short summary shown on the blog listing page..."
              />
            </div>

            <div>
              <label className="form-label">Body <span className="text-red-500">*</span></label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={12}
                className="form-input resize-y font-mono text-xs"
                placeholder="Write your full blog post here. You can use Markdown formatting..."
              />
              <p className="text-xs text-gray-400 mt-1">Supports Markdown: **bold**, *italic*, # Heading, - list items</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Cover Image URL</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="form-select"
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="form-input"
                placeholder="Eleniyan Motors"
              />
            </div>

            <div>
              <label className="form-label">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  className="form-input flex-1"
                  placeholder="Add a tag and press Enter"
                />
                <button type="button" onClick={addTag} className="btn-secondary text-sm px-4">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-navy/5 text-navy text-xs px-3 py-1.5 rounded-full border border-navy/10">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-gray-100 rounded-card p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO (Optional)</p>
              <div>
                <label className="form-label">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                  className="form-input"
                  placeholder="Leave blank to use post title"
                />
              </div>
              <div>
                <label className="form-label">SEO Description</label>
                <textarea
                  value={form.seoDesc}
                  onChange={(e) => setForm((f) => ({ ...f, seoDesc: e.target.value }))}
                  rows={2}
                  className="form-input resize-none"
                  placeholder="Leave blank to use excerpt"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 accent-gold"
              />
              <label htmlFor="published" className="text-sm font-medium text-charcoal cursor-pointer">
                Publish immediately (visible on the blog)
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary gap-2 text-sm">
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><Save className="w-4 h-4" /> {editing ? 'Update Post' : 'Create Post'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
