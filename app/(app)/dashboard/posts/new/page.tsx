"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Send, Loader2, ImagePlus, X } from "lucide-react"
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
import { createPost } from "@/app/actions/posts"

const categories = [
  { value: "story", label: "My Story" },
  { value: "tips", label: "Tips & Advice" },
  { value: "resources", label: "Resources" },
  { value: "events", label: "Events" },
  { value: "general", label: "General" },
]

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    featured_image: "",
  })

  async function handleSaveDraft() {
    if (!formData.title.trim()) {
      setError("Please enter a title for your post")
      return
    }
    
    setSaving(true)
    setError(null)
    
    const result = await createPost({
      ...formData,
      status: "draft",
    })
    
    if (result.success) {
      router.push("/dashboard/posts")
    } else {
      setError(result.error || "Failed to save draft")
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
    
    const result = await createPost({
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

  const isProcessing = saving || submitting

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
            <h1 className="text-2xl font-bold tracking-tight">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your story with the community
            </p>
          </div>
        </div>
        
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isProcessing}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
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
        </div>
      </div>

      {/* Error Message */}
      {error && (
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
            <p className="text-xs text-muted-foreground">
              You can use basic formatting. Keep it authentic and supportive.
            </p>
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

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h4 className="text-sm font-medium">Community Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Be respectful and supportive</li>
              <li>Share authentic experiences</li>
              <li>Avoid promotional content</li>
              <li>Respect privacy - no personal info of others</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="flex flex-col gap-2 sm:hidden">
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
          onClick={handleSaveDraft}
          disabled={isProcessing}
          className="w-full"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Draft
        </Button>
      </div>
    </div>
  )
}
