import React, { useState, useEffect } from 'react';

interface User {
  sub: string;
  email: string;
  name: string;
}

interface ResourceData {
  message: string;
  user?: User | null;
  tokenDetails?: {
    client_id?: string;
    scope?: string;
    [key: string]: unknown;
  } | null;
}

interface ServiceTokenInfo {
  access_token: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceResource, setServiceResource] = useState<ResourceData | null>(null);
  const [serviceToken, setServiceToken] = useState<ServiceTokenInfo | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setResourceData(data.resource);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const callWithClientCredentials = async () => {
    setServiceLoading(true);
    setServiceError(null);
    try {
      const response = await fetch('/api/client-credentials-resource', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setServiceResource(data.resource);
      setServiceToken(data.token);
    } catch (error) {
      console.error('Client credentials request failed:', error);
      setServiceError('Unable to load protected resource via client credentials.');
      setServiceResource(null);
      setServiceToken(null);
    } finally {
      setServiceLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>OIDC Client</h1>
      {!user ? (
        <div>
          <p>Welcome! Please log in to continue.</p>
          <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {resourceData?.user?.name || user.name || 'User'}!</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3>User Information:</h3>
            <ul>
              <li><strong>Subject:</strong> {resourceData?.user?.sub || user.sub}</li>
              <li><strong>Email:</strong> {resourceData?.user?.email || user.email || ''}</li>
              <li><strong>Name:</strong> {resourceData?.user?.name || user.name || ''}</li>
            </ul>
          </div>
          {resourceData && (
            <div>
              <h3>Protected Resource Data:</h3>
              <p><strong>Message:</strong> {resourceData.message}</p>
              <p><strong>User from Resource:</strong> {resourceData.user?.name || ''}</p>
              {resourceData.tokenDetails && (
                <div>
                  <p><strong>Token Client:</strong> {String(resourceData.tokenDetails.client_id || '')}</p>
                  <p><strong>Token Scopes:</strong> {String(resourceData.tokenDetails.scope || '')}</p>
                </div>
              )}
            </div>
          )}
          <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
            Logout
          </button>
        </div>
      )}
      <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h2>Service-to-Service Request</h2>
        <p>Invoke the protected resource using the client credentials grant.</p>
        <button
          onClick={callWithClientCredentials}
          style={{ padding: '10px 20px', fontSize: '16px' }}
          disabled={serviceLoading}
        >
          {serviceLoading ? 'Requesting…' : 'Call with Client Credentials'}
        </button>
        {serviceError && <p style={{ color: 'red' }}>{serviceError}</p>}
        {serviceResource && (
          <div style={{ marginTop: '20px' }}>
            <h3>Service Call Result</h3>
            <p><strong>Message:</strong> {serviceResource.message}</p>
            {serviceResource.user && (
              <p><strong>User:</strong> {serviceResource.user.name}</p>
            )}
            {serviceResource.tokenDetails && (
              <div>
                <p><strong>Token Client:</strong> {String(serviceResource.tokenDetails.client_id || '')}</p>
                <p><strong>Token Scopes:</strong> {String(serviceResource.tokenDetails.scope || '')}</p>
              </div>
            )}
            {serviceToken && (
              <div>
                <p><strong>Access Token:</strong> {serviceToken.access_token}</p>
                {serviceToken.expires_in && <p><strong>Expires In:</strong> {serviceToken.expires_in} seconds</p>}
                {serviceToken.token_type && <p><strong>Token Type:</strong> {serviceToken.token_type}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
