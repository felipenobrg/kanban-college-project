'use client'

import { BoardProvider } from '@/context/boardContext'
import { DialogProvider } from '@/context/dialogContext'
import { FilterProvider } from '@/context/filterContext'
import { TaskProvider } from '@/context/taskContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <BoardProvider>
        <DialogProvider>
          <FilterProvider>
            <TaskProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </TaskProvider>
          </FilterProvider>
        </DialogProvider>
      </BoardProvider>
    </SessionProvider>
  )
}
