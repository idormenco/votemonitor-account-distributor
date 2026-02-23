import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

export default function ZoomableImage({
  src,
  alt,
  className,
  title,
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { title: string }) {
  if (!src) return null
  return (

    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt || ''}
          sizes="100vw"
          className={className}
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <div className="relative h-[calc(100vh-150px)] w-full overflow-clip rounded-md bg-transparent">
              <img src={src} alt={alt || ''} className="h-full w-full object-contain" />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}