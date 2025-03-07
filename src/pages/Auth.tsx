
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff, Key, UserCircle, AlertCircle } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Form validation schema
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

type AuthMode = "signin" | "signup" | "reset" | "mfa";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [validationState, setValidationState] = useState<{ email: boolean; password: boolean }>({
    email: true,
    password: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in and redirect if needed
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const validateForm = (includeMfa = false) => {
    try {
      const formData = {
        email,
        password,
        ...(includeMfa && { otp }),
      };
      authSchema.parse(formData);
      setValidationState({ email: true, password: true });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newValidationState = { email: true, password: true };
        
        error.errors.forEach((err) => {
          if (err.path.includes('email')) {
            newValidationState.email = false;
          }
          if (err.path.includes('password')) {
            newValidationState.password = false;
          }
        });
        
        setValidationState(newValidationState);
        
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // First, sign in with email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;

      // If MFA is required, send the verification email
      if (signInData.session?.user) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
        });
        
        if (otpError) throw otpError;
        
        setMode("mfa");
        toast({
          title: "Verification Required",
          description: "Please check your email for the verification code",
        });
        return;
      }
      
      // No MFA required, proceed with sign in
      localStorage.setItem("supabase.auth.token", JSON.stringify(signInData));
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerification = async () => {
    if (!validateForm(true)) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // Set session in localStorage for persistence
      localStorage.setItem("supabase.auth.token", JSON.stringify(data));
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      });
      setMode("signin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-400/10 to-purple-500/10 -z-10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-blue-400/10 to-purple-500/10 -z-10 blur-3xl" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">SwiftMessage</h1>
          <p className="text-muted-foreground">Connect with friends and colleagues instantly</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-white/20 shadow-xl animate-fadeIn">
          <CardHeader>
            <div className="relative flex items-center justify-center">
              {mode !== "signin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0"
                  onClick={() => setMode("signin")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="text-xl font-semibold">
                {mode === "signin" && "Welcome Back"}
                {mode === "signup" && "Create an Account"}
                {mode === "reset" && "Reset Password"}
                {mode === "mfa" && "Two-Factor Authentication"}
              </CardTitle>
            </div>
            <CardDescription>
              {mode === "signin" && "Sign in to start chatting"}
              {mode === "signup" && "Sign up to join our community"}
              {mode === "reset" && "Enter your email to reset your password"}
              {mode === "mfa" && "Enter the verification code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "mfa" ? (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <ShieldCheck className="h-16 w-16 text-primary opacity-80" />
                </div>
                <div className="space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    We've sent a 6-digit verification code to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    maxLength={6}
                    className="text-center text-2xl tracking-[1em] font-mono transition-all duration-300 focus:scale-105"
                    required
                  />
                </div>
                <Button
                  className="w-full transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleMfaVerification}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={cn(
                        "pl-10 transition-all duration-300 focus:scale-[1.01]",
                        !validationState.email && "border-destructive focus:ring-destructive"
                      )}
                    />
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    {!validationState.email && (
                      <div className="absolute right-3 top-3">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                  </div>
                  {!validationState.email && (
                    <p className="text-xs text-destructive">Please enter a valid email address</p>
                  )}
                </div>
                
                {mode !== "reset" && (
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cn(
                          "pl-10 pr-10 transition-all duration-300 focus:scale-[1.01]",
                          !validationState.password && "border-destructive focus:ring-destructive"
                        )}
                      />
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      {!validationState.password && (
                        <div className="absolute right-10 top-3">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </div>
                    {!validationState.password && (
                      <p className="text-xs text-destructive">Password must be at least 6 characters</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  {mode === "signin" && (
                    <>
                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMode("signup")}
                        className="w-full transition-all duration-300 hover:scale-[1.02]"
                        disabled={loading}
                      >
                        Create Account
                      </Button>
                    </>
                  )}
                  {mode === "signup" && (
                    <Button
                      type="button"
                      onClick={handleEmailSignUp}
                      className="w-full transition-all duration-300 hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  )}
                  {mode === "reset" && (
                    <Button
                      type="button"
                      onClick={handlePasswordReset}
                      className="w-full transition-all duration-300 hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}

            {mode === "signin" && !loading && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full transition-all duration-300 hover:scale-[1.02] group"
                >
                  <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-center">
            {mode === "signin" && (
              <Button
                variant="link"
                onClick={() => setMode("reset")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot your password?
              </Button>
            )}
            <p className="text-xs text-muted-foreground text-center mt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SwiftMessage. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
