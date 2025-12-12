import { useState } from 'react';
import { analyticsAPI } from '../services/analyticsAPI';

const AnalyticsTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAnalyticsAPI = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getDashboardStats();
      setTestResult({
        success: true,
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Analytics API Test</h3>
      
      <button
        onClick={testAnalyticsAPI}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Analytics API'}
      </button>

      {testResult && (
        <div className="mt-4 p-4 rounded-md bg-gray-50">
          <h4 className="font-medium mb-2">
            Result: {testResult.success ? '✅ Success' : '❌ Error'}
          </h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTest;