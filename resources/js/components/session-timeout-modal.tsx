"use client"

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'

interface SessionTimeoutModalProps {
  timeout?: number; // in milliseconds
}

export function SessionTimeoutModal({ 
  timeout = 120 * 60 * 1000, // 120 minutes default
}: SessionTimeoutModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    return () => {};
  }, []);

  const { isIdle, resetTimer } = useIdleTimeout({
    timeout,
  })

  // Watch for idle state change - directly open modal when idle
  useEffect(() => {
    if (isIdle && !isOpen) {
      setIsOpen(true)
    }
  }, [isIdle, isOpen])

  // Safeguard: if modal closes while idle is active, reopen it
  useEffect(() => {
    if (isIdle && !isOpen) {
      setIsOpen(true)
    }
  }, [isOpen, isIdle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/re-authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setPassword('')
        setIsVisible(false)
        setIsOpen(false)
        resetTimer()
      } else {
        // Handle validation errors
        if (data.errors && data.errors.password) {
          setError(data.errors.password[0])
        } else if (data.error) {
          setError(data.error)
        } else {
          setError('Terjadi kesalahan')
        }
      }
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    // Prevent closing the dialog - user must re-authenticate
    if (!open) {
return
}

    setIsOpen(open)
  }

  const id = 'session-password'

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogOverlay className="backdrop-blur-xs" />
      <DialogContent className='sm:max-w-lg' showCloseButton={false}>
        {/* <DialogHeader className='text-center'>
          <DialogTitle className='text-xl'>Sesi Berakhir</DialogTitle>
          <DialogDescription className='text-base'>
            Masukkan password untuk memperpanjang sesi.
          </DialogDescription>
        </DialogHeader> */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor={id}>Masukan password</Label>
            <div className='relative'>
              <Input 
                id={id}
                type={isVisible ? 'text' : 'password'} 
                name='password'
                placeholder='Masukkan password' 
                required 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoFocus
                className='pr-9'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setIsVisible(prev => !prev)}
                className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className='sr-only'>{isVisible ? 'Sembunyikan password' : 'Tampilkan password'}</span>
              </Button>
            </div>
            {error && (
              <p className='text-sm text-destructive'>{error}</p>
            )}
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
