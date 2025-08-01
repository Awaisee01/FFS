
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

interface VerificationCodeInputProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

const VerificationCodeInput = ({ email, onVerify, onBack, isLoading, error }: VerificationCodeInputProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit) && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isLoading || timeLeft === 0}
                />
              ))}
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center mb-4">{error}</div>
            )}

            <div className="text-center mb-4">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in {formatTime(timeLeft)}
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  Code has expired. Please request a new one.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || code.join('').length !== 6 || timeLeft === 0}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={onBack}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationCodeInput;
