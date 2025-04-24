
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { runDiagnostics, setupGlobalErrorHandlers } from "@/utils/diagnostics";
import { RefreshCw, Check, X, AlertTriangle } from "lucide-react";

export const DiagnosticTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Initialize global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  const handleRunTests = async () => {
    setIsRunning(true);
    setErrors([]);
    
    try {
      const diagnosticResults = await runDiagnostics();
      setResults(diagnosticResults);
      
      // Collect all errors
      const newErrors: string[] = [];
      
      if (!diagnosticResults.auth.isConnected) {
        newErrors.push(`Auth connection error: ${diagnosticResults.auth.error}`);
      }
      
      if (!diagnosticResults.database.isConnected) {
        newErrors.push(`Database connection error: ${diagnosticResults.database.error}`);
      }
      
      diagnosticResults.performanceIssues.forEach(issue => newErrors.push(issue));
      
      setErrors(newErrors);
    } catch (err) {
      setErrors([`Test execution error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Diagnostics</span>
          <Badge variant={errors.length ? "destructive" : "default"}>
            {errors.length ? `${errors.length} Issues Found` : "Ready"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Run diagnostics to check for errors and performance issues
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Issues Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Authentication</h3>
                  {results.auth.isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <X className="w-3 h-3 mr-1" /> Error
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Status: {results.auth.authStatus}</p>
                {results.auth.error && (
                  <p className="text-sm text-red-500 mt-2">{results.auth.error}</p>
                )}
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Database</h3>
                  {results.database.isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <X className="w-3 h-3 mr-1" /> Error
                    </Badge>
                  )}
                </div>
                {results.database.error && (
                  <p className="text-sm text-red-500 mt-2">{results.database.error}</p>
                )}
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Performance</h3>
              {results.performanceIssues.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-500">
                  {results.performanceIssues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No performance issues detected</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleRunTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Diagnostic Tests
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
