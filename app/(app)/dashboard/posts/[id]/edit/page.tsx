"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Send, Loader2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { getPostById, updatePost, deletePost } from "@/app/actions/posts"

const categories = [
  { value: "story", label: "My Story" },
  { value: "tips", label: "Tips & Advice" },
  { value: "resources", label: "Resources" },
  { value: "events", label: "Events" },
  { value: "general", label: "General" },
]

const statusConfig = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  pending: {
    label: "Pending Review",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  published: {
    label: "Published",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState<"draft" | "pending" | "published">("draft")
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    featured_image: "",
  })

  useEffect(() => {
    async function loadPost() {
      const result = await getPostById(postId)
      if (result.success && result.post) {
        setFormData({
          title: result.post.title,
          content: result.post.content,
          excerpt: result.post.excerpt || "",
          category: result.post.category || "",
          featured_image: result.post.featured_image || "",
        })
        setCurrentStatus(result.post.status)
      } else {
        setError("Post not found")
      }
      setLoading(false)
    }
    
    loadPost()
  }, [postId])

  async function handleSave() {
    if (!formData.title.trim()) {
      setError("Please enter a title for your post")
      return
    }
    
    setSaving(true)
    setError(null)
    
    const result = await updatePost(postId, {
      ...formData,
      status: currentStatus,
    })
    
    if (result.success) {
      router.push("/dashboard/posts")
    } else {
      setError(result.error || "Failed to save changes")
    }
    
    setSaving(false)
  }

  async function handleSubmitForReview() {
    if (!formData.title.trim()) {
      setError("Please enter a title for your post")
      return
    }
    if (!formData.content.trim()) {
      setError("Please add some content to your post")
      return
    }
    if (!formData.category) {
      setError("Please select a category")
      return
    }
    
    setSubmitting(true)
    setError(null)
    
    const result = await updatePost(postId, {
      ...formData,
      status: "pending",
    })
    
    if (result.success) {
      router.push("/dashboard/posts")
    } else {
      setError(result.error || "Failed to submit post")
    }
    
    setSubmitting(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deletePost(postId)
    if (result.success) {
      router.push("/dashboard/posts")
    } else {
      setError(result.error || "Failed to delete post")
      setDeleting(false)
    }
  }

  const isProcessing = saving || submitting || deleting
  const status = statusConfig[currentStatus]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (error === "Post not found") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Post not found</h2>
        <p className="text-muted-foreground mt-2">
          The post you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/posts">Back to Posts</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/posts">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to posts</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
              <Badge variant="secondary" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Update your post content
            </p>
          </div>
        </div>
        
        <div className="hidden gap-2 sm:flex">
          {currentStatus !== "published" && (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isProcessing}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
              <Button
                onClick={handleSubmitForReview}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit for Review
              </Button>
            </>
          )}
          {currentStatus === "published" && (
            <Button
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Update Post
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && error !== "Post not found" && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a compelling title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your story, tips, or resources with the community..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[300px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief summary that will appear in post previews..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="min-h-[100px] resize-y"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-semibold">Post Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL (optional)</Label>
              <Input
                id="featured_image"
                placeholder="https://..."
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              />
              {formData.featured_image && (
                <div className="relative mt-2">
                  <img
                    src={formData.featured_image}
                    alt="Featured preview"
                    className="rounded-lg object-cover w-full h-32"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setFormData({ ...formData, featured_image: "" })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3">
            <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Post
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="flex flex-col gap-2 sm:hidden">
        {currentStatus !== "published" ? (
          <>
            <Button
              onClick={handleSubmitForReview}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit for Review
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isProcessing}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Update Post
          </Button>
        )}
      </div>
    </div>
  )
}
