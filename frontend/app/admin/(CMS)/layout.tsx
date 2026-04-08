"use client"
import React from 'react'
import CMSLayout from '@/components/cms/CMSLayout/CMSLayout'

export const dynamic = 'force-static'

export default function CMSLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CMSLayout>{children}</CMSLayout>;
}
