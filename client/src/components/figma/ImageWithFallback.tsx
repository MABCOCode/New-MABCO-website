import React, { useState } from 'react'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [didLoad, setDidLoad] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDidError(true)
    props.onError?.(e)
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDidLoad(true)
    props.onLoad?.(e)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`block w-full h-full min-h-[1px] shimmer-surface ${className ?? ''}`}
      style={style}
    />
  ) : (
    <div className="relative w-full h-full overflow-hidden" style={style}>
      {!didLoad && <div className="absolute inset-0 shimmer-surface" />}
      <img
        src={src}
        alt={alt}
        className={`${className ?? ''} ${didLoad ? '' : 'invisible'}`}
        {...rest}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
