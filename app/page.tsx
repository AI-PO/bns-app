'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function RootPage() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    router.replace(user ? '/app' : '/login')
  }, [user, router])
  return null
}
