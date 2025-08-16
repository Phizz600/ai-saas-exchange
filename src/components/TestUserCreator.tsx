import { useEffect, useState } from 'react';
import { createTestUser } from '@/utils/testAuth';

export const TestUserCreator = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      try {
        const testResult = await createTestUser();
        setResult(testResult);
        console.log('🧪 Test execution completed:', testResult);
      } catch (error) {
        console.error('🧪 Test execution failed:', error);
        setResult({ success: false, error: error });
      } finally {
        setLoading(false);
      }
    };

    // Run test automatically on component mount
    runTest();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-sm">
      <h3 className="text-sm font-semibold text-primary mb-2">🧪 Auth Test</h3>
      {loading && (
        <p className="text-xs text-muted-foreground">Creating test user...</p>
      )}
      {result && (
        <div className="text-xs">
          {result.success ? (
            <div className="text-green-600">
              ✅ Test user created!
              <br />
              Email: {result.email}
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Failed: {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};