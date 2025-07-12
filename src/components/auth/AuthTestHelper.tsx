import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthTestHelper = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addResult('Testing Supabase connection...');
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
      } else {
        addResult('✅ Supabase connection successful');
      }
    } catch (err: any) {
      addResult(`❌ Connection error: ${err.message}`);
    }
  };

  const testEmailFunction = async () => {
    try {
      addResult('Testing welcome email function...');
      const { data, error } = await supabase.functions.invoke('schedule-welcome-email', {
        body: {
          firstName: 'Test User',
          email: 'test@example.com',
          userType: 'ai_investor',
          timestamp: new Date().toISOString(),
          source: 'test',
          siteUrl: window.location.origin
        }
      });
      
      if (error) {
        addResult(`❌ Email function failed: ${error.message}`);
      } else {
        addResult('✅ Email function test successful');
        addResult(`Response: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      addResult(`❌ Email function error: ${err.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Authentication Test Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={testSupabaseConnection} variant="outline">
            Test Connection
          </Button>
          <Button onClick={testEmailFunction} variant="outline">
            Test Email
          </Button>
          <Button onClick={clearResults} variant="destructive">
            Clear
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 