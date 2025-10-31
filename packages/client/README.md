# Client Application

A React-based web application that demonstrates OIDC client functionality, including user authentication flows and API integration.

## Overview

This client application showcases:

- **OIDC Login Flow**: Authorization code flow with PKCE
- **User Interface**: Clean React UI for authentication
- **Session Management**: Express backend for session handling
- **API Integration**: Calling protected resources with access tokens
- **Client Credentials Demo**: Service-to-service authentication example

## Architecture

The client consists of two parts:

1. **Express Backend** (`index.ts`):
   - Handles OIDC flows and session management
   - Serves the React application
   - Proxies API calls to the resource server

2. **React Frontend** (`src/App.tsx`):
   - User interface for login/logout
   - Displays user information and protected data
   - Demonstrates client credentials flow

## Features

### User Authentication
- **Login Button**: Initiates OIDC authorization code flow
- **Callback Handling**: Processes authorization response
- **User Info Display**: Shows claims from ID token and UserInfo endpoint
- **Protected Resource Access**: Calls resource server with access token
- **Logout**: Clears session and redirects

### Service Integration
- **Client Credentials Flow**: Button to demonstrate service-to-service calls
- **Token Display**: Shows access token details
- **Error Handling**: Graceful handling of authentication failures

## OIDC Flow

1. User clicks "Login"
2. Client generates PKCE challenge and state
3. Redirects to Identity Provider's authorization endpoint
4. User authenticates at Identity Provider
5. Identity Provider redirects back with authorization code
6. Client exchanges code for tokens
7. Client retrieves user info and calls protected resource
8. User sees their information and can test service calls

## Endpoints

### Frontend Routes
- `/` - Main application page
- `/login` - Initiates login flow
- `/callback` - OIDC callback handler
- `/logout` - Logout handler

### API Endpoints
- `GET /api/user` - Returns user info and protected resource data
- `POST /api/client-credentials-resource` - Demonstrates client credentials flow

## Configuration

- **Client ID**: `client_id`
- **Client Secret**: `client_secret`
- **Redirect URI**: `http://localhost:3001/callback`
- **Scopes**: `openid email profile api:read`
- **PKCE**: Enabled with S256 code challenge method

## Technologies

- **React**: Frontend framework
- **Express.js**: Backend web framework
- **openid-client**: OIDC client library
- **express-session**: Session management
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety

## Building and Running

```bash
# Build the application
pnpm build

# Start the client
pnpm start:client
```

The client runs on http://localhost:3001

## Demo Scenarios

1. **User Login**: Click login, authenticate, see user info
2. **Protected Resource**: View data from resource server
3. **Service Call**: Use client credentials to access protected resource
4. **Logout**: Clear session and start over</content>
<parameter name="filePath">/workspaces/oidc-node/packages/client/README.md