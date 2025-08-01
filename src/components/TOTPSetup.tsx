import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

interface TOTPSetupProps {
  email: string;
  secret?: string;
  onComplete: (code: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

const TOTPSetup = ({ email, secret, onComplete, onBack, isLoading, error }: TOTPSetupProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [manualSecret, setManualSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [setupError, setSetupError] = useState<string>('');

  useEffect(() => {
    const setupTOTP = async () => {
      try {
        setIsGenerating(true);
        setSetupError('');
        
        // If secret is provided, use it directly
        if (secret) {
          setManualSecret(secret);
          const issuer = 'Funding For Scotland';
          const accountName = email;
          const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
          
          const qrUrl = await QRCode.toDataURL(otpAuthUrl);
          setQrCodeUrl(qrUrl);
          return;
        }

        // Otherwise, fetch from the server
        const { data, error } = await supabase.functions.invoke('setup-admin-totp', {
          body: { email }
        });

        if (error) {
          throw error;
        }

        if (data?.secret) {
          setManualSecret(data.secret);
          const issuer = 'Funding For Scotland';
          const accountName = email;
          const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${data.secret}&issuer=${encodeURIComponent(issuer)}`;
          
          const qrUrl = await QRCode.toDataURL(otpAuthUrl);
          setQrCodeUrl(qrUrl);
        } else {
          throw new Error('Invalid response from TOTP setup');
        }
      } catch (err) {
        console.error('TOTP setup error:', err);
        setSetupError(err instanceof Error ? err.message : 'Failed to set up TOTP');
      } finally {
        setIsGenerating(false);
      }
    };

    if (email) {
      setupTOTP();
    }
  }, [email, secret]);

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setSetupError('Please enter a 6-digit verification code');
      return;
    }

    await onComplete(verificationCode);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setting up Two-Factor Authentication</CardTitle>
            <CardDescription>Please wait while we generate your TOTP secret...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app or enter the secret manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(error || setupError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || setupError}</AlertDescription>
            </Alert>
          )}

          {qrCodeUrl && (
            <div className="text-center">
              <img 
                src={qrCodeUrl} 
                alt="TOTP QR Code" 
                className="mx-auto mb-4 border rounded-lg"
                width={200}
                height={200}
              />
              <p className="text-sm text-gray-600 mb-2">
                Or enter this secret manually in your authenticator app:
              </p>
              <code className="text-xs bg-gray-100 p-2 rounded break-all">
                {manualSecret}
              </code>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">Enter 6-digit code from your app</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
            />
          </div>

          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleVerifyCode} 
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify and Complete Setup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOTPSetup;
