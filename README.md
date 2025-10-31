# OIDC Node.js Demo

A comprehensive demonstration of OpenID Connect (OIDC) implementation in Node.js, showcasing various OAuth 2.0 and OIDC flows in a monorepo structure.

## Overview

This repository contains a complete OIDC ecosystem with three main components:

- **Identity Provider**: An OIDC server built with the `oidc-provider` library
- **Client Application**: A React-based web app that demonstrates user authentication
- **Resource Server**: An API server that protects resources using access tokens

The demo illustrates several key OIDC/OAuth 2.0 concepts:

- **Authorization Code Flow**: Interactive user login with PKCE
- **Client Credentials Flow**: Service-to-service authentication
- **Token Introspection**: Validating access tokens at the resource server
- **UserInfo Endpoint**: Retrieving additional user information
- **JWT Tokens**: ID tokens and access tokens
- **Scopes and Claims**: Controlling access and data sharing

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │ Identity        │    │ Resource        │
│   (React +      │◄──►│ Provider       │◄──►│ Server          │
│    Express)     │    │ (oidc-provider)│    │ (Express)       │
│                 │    │                 │    │                 │
│ Port: 3001      │    │ Port: 3000      │    │ Port: 3002      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- Node.js 18+
- pnpm package manager

## Installation

```bash
pnpm install
```

## Building

Build all packages:

```bash
pnpm build
```

## Running the Demo

### Start All Services

To run the complete demo with all three services:

```bash
pnpm start
```

This will start:
- Identity Provider on http://localhost:3000
- Client Application on http://localhost:3001
- Resource Server on http://localhost:3002

### Start Individual Services

Start Identity Provider only:
```bash
pnpm start:provider
```

Start Client Application only:
```bash
pnpm start:client
```

Start Resource Server only:
```bash
pnpm start:resource
```

## Usage

1. Open your browser and navigate to http://localhost:3001
2. Click "Login" to initiate the authorization code flow
3. You'll be redirected to the Identity Provider's login page
4. After authentication, you'll be redirected back to the client app
5. The client will display your user information and call a protected resource
6. Try the "Call with Client Credentials" button to see service-to-service authentication

## Demo Features

### User Authentication Flow
- **Login**: Initiates OIDC authorization code flow with PKCE
- **Callback**: Handles the authorization response and token exchange
- **User Info**: Displays user claims from ID token and UserInfo endpoint
- **Protected Resource**: Calls the resource server with the access token
- **Logout**: Clears the session

### Service-to-Service Flow
- **Client Credentials Grant**: Demonstrates machine-to-machine authentication
- **Token Introspection**: Shows how the resource server validates tokens
- **Scope Validation**: Ensures tokens have required permissions

## Configuration

### Identity Provider
- **Clients**: Pre-configured clients for web app and service authentication
- **Scopes**: `openid`, `profile`, `email`, `api:read`
- **Claims**: Standard OIDC claims plus custom profile data
- **Features**: Dev interactions, client credentials, token introspection

### Client Application
- **OIDC Client**: Configured for authorization code flow
- **PKCE**: Proof Key for Code Exchange for enhanced security
- **Session Management**: Express sessions for state management
- **API Proxy**: Proxies requests to the resource server

### Resource Server
- **Token Validation**: Uses OIDC discovery and token introspection
- **Scope Checking**: Validates `api:read` scope for access
- **User Info**: Retrieves user information for user-authenticated requests

## API Endpoints

### Client Application (Port 3001)
- `GET /` - Serves the React application
- `GET /login` - Initiates login flow
- `GET /callback` - Handles OIDC callback
- `GET /api/user` - Returns user info and protected resource data
- `POST /api/client-credentials-resource` - Demonstrates client credentials flow
- `GET /logout` - Logs out the user

### Identity Provider (Port 3000)
- Standard OIDC endpoints (authorization, token, userinfo, introspection)
- Dev interaction pages for testing

### Resource Server (Port 3002)
- `GET /` - Health check endpoint
- `GET /protected` - Protected resource requiring Bearer token

## Security Notes

This is a demo implementation with the following simplifications:
- In-memory storage (not suitable for production)
- Hardcoded client secrets
- Self-signed certificates not used
- No HTTPS in development
- Basic session management

For production use, consider:
- Proper database adapters
- Environment variable configuration
- HTTPS/TLS
- Secure session stores
- Client secret rotation
- Rate limiting and security headers

## Technologies Used

- **oidc-provider**: OIDC server implementation
- **openid-client**: OIDC client library
- **Express.js**: Web framework for client and resource server
- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool for the client
- **pnpm**: Package manager for monorepo

## Learning Resources

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [OIDC Provider Documentation](https://github.com/panva/node-oidc-provider)
- [OpenID Client Documentation](https://github.com/panva/node-openid-client)

## Contributing

This is a demo project for educational purposes. Feel free to explore and modify the code to understand OIDC flows better.