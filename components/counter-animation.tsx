"use client"

import { useEffect, useRef, useState } from "react"

interface CounterAnimationProps {
  end: number
  duration?: number
  suffix?: string
}

export function CounterAnimation({ end, duration = 2000, suffix = "" }: CounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const step = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const currentCount = Math.floor(easeOutQuad(progress) * end)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(step)
  }, [isVisible, end, duration])

  return (
    <span ref={counterRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}
