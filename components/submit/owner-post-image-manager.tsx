'use client'

import Image from 'next/image'
import { addImagesToCommunityPost, removeImageFromCommunityPost } from '@/app/actions/community-posts'
import type { CommunityPostDetail } from '@/lib/queries/community-posts'
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

type OwnerPostImageManagerProps = {
  postId: string
  path: string
  title: string
  images: CommunityPostDetail['images']
}

type LocalImagePreview = {
  id: string
  name: string
  url: string
}

const MAX_POST_IMAGE_FILES = 5

function UploadImagesButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="min-h-11 rounded-full bg-[#e34b16] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(227,75,22,0.3)] transition hover:bg-[#c74010] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Uploading photos…' : 'Add photos'}
    </button>
  )
}

function RemoveImageButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-full border border-[#d9c4a8] bg-white px-4 py-2 text-xs font-semibold text-[#7a331b] transition hover:border-[#cfa882] hover:text-[#e34b16] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Removing…' : 'Remove photo'}
    </button>
  )
}

export function OwnerPostImageManager({ postId, path, title, images }: OwnerPostImageManagerProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const previewsRef = useRef<LocalImagePreview[]>([])
  const [addState, addAction] = useFormState(addImagesToCommunityPost, null)
  const [removeState, removeAction] = useFormState(removeImageFromCommunityPost, null)
  const [previews, setPreviews] = useState<LocalImagePreview[]>([])

  const remainingSlots = Math.max(0, MAX_POST_IMAGE_FILES - images.length)

  useEffect(() => {
    if (addState?.success || removeState?.success) {
      formRef.current?.reset()
      setPreviews((current) => {
        for (const preview of current) {
          URL.revokeObjectURL(preview.url)
        }

        previewsRef.current = []
        return []
      })
      router.refresh()
    }
  }, [addState?.success, removeState?.success, router])

  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [])

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    setPreviews((current) => {
      for (const preview of current) {
        URL.revokeObjectURL(preview.url)
      }

      const nextPreviews = Array.from(event.target.files ?? []).map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }))

      previewsRef.current = nextPreviews
      return nextPreviews
    })
  }

  const uploadSummary = useMemo(() => {
    if (remainingSlots === 0) {
      return `You already have the current max of ${MAX_POST_IMAGE_FILES} photos on this story.`
    }

    if (previews.length === 0) {
      return `${remainingSlots} photo slot${remainingSlots === 1 ? '' : 's'} open on this story.`
    }

    return `${previews.length} new photo${previews.length === 1 ? '' : 's'} ready to upload.`
  }, [previews.length, remainingSlots])

  return (
    <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
      <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Manage your photos</p>
      <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Add or remove story images</h2>
      <p className="mt-3 text-sm leading-6 text-[#6d5849]">
        This pass covers owner photo management for published stories. You can remove images you no longer want shown and add new ones until the story reaches the 5-photo limit.
      </p>

      {addState?.message ? (
        <div className="mt-4 rounded-2xl border border-green-200/80 bg-green-50/90 p-3 text-sm text-green-800" role="status">
          {addState.message}
        </div>
      ) : null}

      {removeState?.message ? (
        <div className="mt-4 rounded-2xl border border-green-200/80 bg-green-50/90 p-3 text-sm text-green-800" role="status">
          {removeState.message}
        </div>
      ) : null}

      {addState?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {addState.error}
        </div>
      ) : null}

      {removeState?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {removeState.error}
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4 text-sm text-[#6d5849]">
            No story photos yet. Add images below if you want this post to feel more grounded for other members.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <article key={image.id} className="overflow-hidden rounded-[1.5rem] border border-[#ead8c2] bg-[#fffaf4]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6efe4]">
                  {image.signedUrl ? (
                    <Image
                      src={image.signedUrl}
                      alt={image.alt_text ?? `${title} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 20rem, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#6d5849]">
                      Photo preview unavailable right now.
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">Photo {index + 1}</p>
                  <form action={removeAction}>
                    <input type="hidden" name="postId" value={postId} />
                    <input type="hidden" name="path" value={path} />
                    <input type="hidden" name="imageId" value={image.id} />
                    <RemoveImageButton />
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <form ref={formRef} action={addAction} className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4">
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="path" value={path} />
        <label htmlFor="owner-images" className="mb-2 block text-sm font-semibold text-[#7a331b]">
          Add photos
        </label>
        <input
          id="owner-images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleImagesChange}
          disabled={remainingSlots === 0}
          className="warm-focus-ring block w-full rounded-2xl border border-[#ead8c2] bg-white px-4 py-3 text-sm text-[#6d5849] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7e8be] file:px-3 file:py-2 file:font-semibold file:text-[#7a331b] hover:file:bg-[#f3ddb3] disabled:pointer-events-none disabled:opacity-60"
        />
        <p className="mt-3 text-sm text-[#6d5849]">{uploadSummary}</p>
        <p className="mt-1 text-xs text-muted-foreground">Add up to {remainingSlots} more photo{remainingSlots === 1 ? '' : 's'} in this pass. New images append after your existing ones, so reordering is still a later pass.</p>

        {previews.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {previews.map((preview) => (
              <div key={preview.id} className="overflow-hidden rounded-2xl border border-[#ead8c2] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt={preview.name} className="h-40 w-full object-cover" />
                <p className="truncate px-3 py-2 text-xs text-[#6d5849]">{preview.name}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4">
          <UploadImagesButton disabled={remainingSlots === 0} />
        </div>
      </form>
    </div>
  )
}
