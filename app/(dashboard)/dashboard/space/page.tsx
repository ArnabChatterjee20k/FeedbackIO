"use client"
// we cant use layout as a parent.
// so making it as client
// and rendering a server component inside it
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Space from './components/space'

export default function page() {
  const params = useSearchParams()
  const mode = params.get("mode")
  return <Space mode='new'/>
}
