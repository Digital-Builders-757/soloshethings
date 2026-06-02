import type { PixelCrop } from 'react-image-crop'

import {
  AVATAR_CROP_OUTPUT_MAX_PX,
  type AvatarMimeType,
} from '@/lib/storage/avatar-client'

function getScaledCropDimensions(cropWidth: number, cropHeight: number) {
  const maxSide = Math.max(cropWidth, cropHeight)

  if (maxSide <= AVATAR_CROP_OUTPUT_MAX_PX) {
    return {
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    }
  }

  const scale = AVATAR_CROP_OUTPUT_MAX_PX / maxSide

  return {
    width: Math.round(cropWidth * scale),
    height: Math.round(cropHeight * scale),
  }
}

function extensionForMimeType(mimeType: AvatarMimeType) {
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/webp') return 'webp'
  return 'jpg'
}

export async function getCroppedAvatarFile(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  sourceFileName: string,
  mimeType: AvatarMimeType,
): Promise<File> {
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const cropWidth = pixelCrop.width * scaleX
  const cropHeight = pixelCrop.height * scaleY
  const { width: outputWidth, height: outputHeight } = getScaledCropDimensions(
    cropWidth,
    cropHeight,
  )

  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not prepare your portrait crop.')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Could not prepare your portrait crop.'))
          return
        }
        resolve(result)
      },
      mimeType,
    )
  })

  const baseName = sourceFileName.replace(/\.[^.]+$/, '') || 'portrait'
  const extension = extensionForMimeType(mimeType)

  return new File([blob], `${baseName}.${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  })
}
