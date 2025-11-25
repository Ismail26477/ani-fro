"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"

const Auth = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/")
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-950/20 to-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            ANIDOST
          </h1>
          <p className="text-muted-foreground text-lg">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <p className="text-foreground font-medium text-lg">Welcome back</p>
            <p className="text-sm text-muted-foreground">Sign in with your Google account to continue</p>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            className="w-full h-12 bg-white text-black hover:bg-gray-100 font-semibold text-base"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Mail className="mr-2 h-5 w-5" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>

          {/* Features List */}
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center font-medium">Why join?</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Watch unlimited anime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Create your watchlist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Save your favorites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>By signing in, you agree to our Terms of Service</p>
          <p className="text-foreground/60">© 2025 ANIDOST. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Auth
