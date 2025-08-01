
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield } from 'lucide-react';
import TOTPSetup from './TOTPSetup';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'password' | 'totp' | 'setup'>('password');
  const [totpSecret, setTotpSecret] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Authenticate admin using secure edge function
      const { data: authData, error: authError } = await supabase.functions.invoke('authenticate-admin', {
        body: { 
          email: email,
          password: password
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData?.success) {
        setError(authData?.error || 'Invalid credentials. Access denied.');
        setIsLoading(false);
        return;
      }

      // Store admin session info securely
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminSessionToken', authData.session_token);
        localStorage.setItem('adminId', authData.admin_id);
        localStorage.setItem('adminEmail', authData.email);
      }

      // Check if TOTP is set up for this admin
      const { data, error } = await supabase.functions.invoke('setup-admin-totp', {
        body: { email: email }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setTotpSecret(data.secret);
        
        if (data.alreadyVerified) {
          // TOTP already set up, go to verification
          setCurrentStep('totp');
          toast({
            title: "Password correct",
            description: "Please enter your 2FA code from your authenticator app.",
          });
        } else {
          // First time setup
          setCurrentStep('setup');
          toast({
            title: "TOTP Setup Required",
            description: "Please set up two-factor authentication for your account.",
          });
        }
      }
    } catch (err) {
      console.error('Error verifying admin credentials:', err);
      setError('Failed to verify admin credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleTotpVerification = async (code: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-totp', {
        body: { 
          email: email, 
          code,
          isSetup: currentStep === 'setup'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminAuthTime', Date.now().toString());
          localStorage.setItem('adminUser', JSON.stringify(data.user));
        }
        
        toast({
          title: "Login successful",
          description: currentStep === 'setup' 
            ? "TOTP setup completed! Welcome to the admin panel." 
            : "Welcome back to the admin panel!",
        });
        onLogin();
      } else {
        throw new Error(data?.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying TOTP:', err);
      setError('Invalid verification code. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleBackToPassword = () => {
    setCurrentStep('password');
    setPassword('');
    setTotpCode('');
    setError('');
  };

  if (currentStep === 'setup') {
    return (
      <TOTPSetup
        email={email}
        secret={totpSecret}
        onComplete={handleTotpVerification}
        onBack={handleBackToPassword}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (currentStep === 'totp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleTotpVerification(totpCode); }} className="space-y-4">
              <div>
                <Label htmlFor="totpCode">Verification Code</Label>
                <Input
                  id="totpCode"
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBackToPassword}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || totpCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your admin email and password to continue with 2FA verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Verifying...' : 'Continue to 2FA'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
