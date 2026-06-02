'use client'

import { getCroppedAvatarFile } from '@/lib/client/avatar-crop'
import { validateAvatarFile, type AvatarMimeType } from '@/lib/storage/avatar-client'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useId, useRef, useState, type SyntheticEvent } from 'react'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface AvatarCropModalProps {
  open: boolean
  imageSrc: string | null
  sourceFileName: string
  mimeType: AvatarMimeType
  onConfirm: (file: File) => void
  onCancel: () => void
}

const ASPECT = 1

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, ASPECT, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  )
}

export function AvatarCropModal({
  open,
  imageSrc,
  sourceFileName,
  mimeType,
  onConfirm,
  onCancel,
}: AvatarCropModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetCropState = useCallback(() => {
    setCrop(undefined)
    setCompletedCrop(undefined)
    setErrorMessage(null)
    setIsProcessing(false)
  }, [])

  const handleCancel = useCallback(() => {
    resetCropState()
    onCancel()
  }, [onCancel, resetCropState])

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleCancel()
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleCancel])

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget
    const nextCrop = centerAspectCrop(width, height)
    setErrorMessage(null)
    setIsProcessing(false)
    setCrop(nextCrop)
    setCompletedCrop(convertToPixelCrop(nextCrop, width, height))
  }

  async function handleConfirm() {
    if (!imageRef.current || !completedCrop || completedCrop.width <= 0 || completedCrop.height <= 0) {
      setErrorMessage('Adjust the crop area before continuing.')
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const croppedFile = await getCroppedAvatarFile(
        imageRef.current,
        completedCrop,
        sourceFileName,
        mimeType,
      )

      const validationError = validateAvatarFile(croppedFile)
      if (validationError) {
        setErrorMessage(validationError)
        setIsProcessing(false)
        return
      }

      onConfirm(croppedFile)
      resetCropState()
    } catch {
      setErrorMessage('Could not prepare your portrait. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!open || !imageSrc) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close portrait crop"
        className="absolute inset-0 bg-[#3a1f12]/45 backdrop-blur-[2px]"
        onClick={handleCancel}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#c8a882]/28 bg-gradient-to-b from-[#fffdf8] to-[#f7efe0]/95 shadow-[0_24px_64px_rgba(58,31,18,0.18)]"
      >
        <div className="border-b border-[#c8a882]/18 px-5 py-4 sm:px-6 sm:py-5">
          <p id={titleId} className="display-headline text-xl text-[#713522] sm:text-[1.35rem]">
            Frame your portrait
          </p>
          <p id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-[#7a331b]/58">
            Drag to reposition. Your portrait saves when you save your profile.
          </p>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-[#c8a882]/22 bg-[#f4ead8]/35">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
              aspect={ASPECT}
              circularCrop
              className="max-h-[min(60vh,28rem)] [&_.ReactCrop__child-wrapper]:max-h-[min(60vh,28rem)] [&_img]:max-h-[min(60vh,28rem)] [&_img]:w-full [&_img]:object-contain"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- react-image-crop requires a native HTMLImageElement ref for canvas export */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Portrait crop preview"
                onLoad={handleImageLoad}
                className="block max-w-full"
              />
            </ReactCrop>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-sm font-medium text-red-900" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2.5 border-t border-[#c8a882]/18 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="min-h-11 rounded-full border border-[#c8a882]/35 px-5 py-2.5 text-sm font-medium text-[#7a331b]/72 transition hover:border-[#c8a882]/55 hover:text-[#713522] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={cn(
              'cta-primary min-h-11 px-6 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-60',
            )}
          >
            {isProcessing ? 'Preparing…' : 'Use portrait'}
          </button>
        </div>
      </div>
    </div>
  )
}
