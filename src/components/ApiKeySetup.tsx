
import React, { useState } from 'react';
import { ExternalLink, Key, Shield, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    
    // Basic validation - check if it starts with 'gsk_'
    if (apiKey.startsWith('gsk_')) {
      localStorage.setItem('groq_api_key', apiKey);
      onApiKeySet(apiKey);
    } else {
      alert('Please enter a valid Groq API key (should start with "gsk_")');
    }
    
    setIsValidating(false);
  };

  return (
    <div className="w-80 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Key className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900">Setup Suzzy</h1>
          <p className="text-xs text-gray-600">Configure your API key</p>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          Your API key is stored locally and never shared
        </AlertDescription>
      </Alert>

      {/* Instructions */}
      <Card className="p-4 mb-4 bg-white border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          Get Your Free API Key
        </h3>
        <ol className="text-xs text-gray-600 space-y-1 mb-3">
          <li>1. Visit console.groq.com</li>
          <li>2. Sign up or log in</li>
          <li>3. Go to API Keys section</li>
          <li>4. Create a new API key</li>
          <li>5. Copy and paste it below</li>
        </ol>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => window.open('https://console.groq.com/keys', '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Open Groq Console
        </Button>
      </Card>

      {/* API Key Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Groq API Key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            className="text-sm"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!apiKey.trim() || isValidating}
        >
          {isValidating ? 'Validating...' : 'Save & Continue'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-auto text-center">
        Your key is stored securely in your browser
      </p>
    </div>
  );
};

export default ApiKeySetup;
