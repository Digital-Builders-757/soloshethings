/**
 * Dashboard Page
 *
 * Enhanced user dashboard with:
 * - Welcome message with user name
 * - Post statistics cards
 * - Recent posts list
 * - Quick actions
 */

import { getUser } from "@/lib/supabase/server"
import { getCurrentUserProfile } from "@/lib/queries/profiles"
import { getUserPosts, getUserPostStats } from "@/app/actions/posts"
import { redirect } from "next/navigation"
import Link from "next/link"
import { PlusCircle, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PostCard } from "@/components/dashboard/post-card"
import { EmptyState } from "@/components/dashboard/empty-state"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile (with bounded repair if needed)
  let profile = await getCurrentUserProfile()

  if (!profile) {
    // Profile missing - attempt repair (bounded, max 1 retry)
    const { generateUsername } = await import("@/lib/auth-utils")
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: generateUsername(user.email || "user"),
          role: "talent",
          privacy_level: "public",
        })
        .select(
          "id, username, full_name, bio, avatar_url, role, privacy_level, created_at, updated_at"
        )
        .single()

      if (error || !data) {
        return (
          <main className="min-h-screen px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="surface-card rounded-xl p-8 text-center">
                <h1 className="text-2xl font-semibold mb-4 text-red-600">
                  Profile Error
                </h1>
                <p className="text-neutral-700 mb-4">
                  Your profile could not be loaded. Please contact support.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-brand-orange text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-orange/90 transition-all"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </main>
        )
      }

      profile = data
    } catch (error) {
      console.error("Profile repair failed:", error)
      return (
        <main className="min-h-screen px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="surface-card rounded-xl p-8 text-center">
              <h1 className="text-2xl font-semibold mb-4 text-red-600">
                Profile Error
              </h1>
              <p className="text-neutral-700 mb-4">
                Your profile could not be loaded. Please contact support.
              </p>
              <Link
                href="/login"
                className="inline-block bg-brand-coral text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-coral/90 transition-all"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </main>
      )
    }
  }

  // Fetch user's posts and stats
  const [postsResult, statsResult] = await Promise.all([
    getUserPosts({ limit: 5 }),
    getUserPostStats(),
  ])

  const posts = postsResult.success ? postsResult.data : []
  const stats = statsResult.success
    ? statsResult.data
    : { total: 0, published: 0, draft: 0, pending: 0 }

  const displayName = profile.full_name || profile.username || "there"
  const firstName = displayName.split(" ")[0]

  return (
    <main className="min-h-screen">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your community posts.
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/posts/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mt-8">
          {/* Recent Posts - Takes 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Posts
                </CardTitle>
                <CardDescription>
                  Your latest community contributions
                </CardDescription>
              </div>
              {posts.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/posts">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <EmptyState
                  title="No posts yet"
                  description="Share your first story with the Solo SHE Things community!"
                  actionLabel="Create your first post"
                  actionHref="/dashboard/posts/new"
                />
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} compact />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/posts/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Write a new post
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/posts">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage all posts
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/profile">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Edit profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/blog">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  Browse blog
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/collections">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  View collections
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
