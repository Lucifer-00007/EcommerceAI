'use client'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function GoBackButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  )
}
