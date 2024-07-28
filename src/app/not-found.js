'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
function NotFoundPage () {
  const path = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (path !== '/404') {
      router.push('/404')
    }
  }, [path, router])
  return <div className='h-[100vH] flex justify-center items-center'>
    <h1>Page Not Found</h1>
  </div>
}

export default NotFoundPage