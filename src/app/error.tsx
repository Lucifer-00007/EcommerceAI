/**
 * Error Boundary Page
 * 
 * Catches and displays errors that occur in the application.
 * 
 * Features:
 * - Error message display
 * - Retry functionality
 * - Fallback UI
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = React.useState(false)

  // Log error to console in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            
            <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has occurred.
              Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  {showDetails ? 'Hide' : 'Show'} Error Details
                </Button>
                
                {showDetails && (
                  <div className="p-4 bg-muted rounded-lg overflow-auto">
                    <p className="font-mono text-sm text-destructive">
                      {error.message}
                    </p>
                    {error.stack && (
                      <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                        {error.stack}
                      </pre>
                    )}
                    {error.digest && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/">
                <Button>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <p className="text-center text-sm text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
