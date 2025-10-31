# Identity Provider

The OIDC Identity Provider component of the demo, built using the `oidc-provider` library. This service acts as the authorization server in the OIDC ecosystem.

## Overview

This identity provider implements a complete OIDC server that supports:

- **Authorization Code Flow**: For interactive user authentication
- **Client Credentials Flow**: For service-to-service authentication
- **Token Introspection**: For validating access tokens
- **UserInfo Endpoint**: For retrieving user profile information
- **JWKS (JSON Web Key Set)**: For token verification

## Configuration

### Clients

Three clients are pre-configured:

1. **Web Client** (`client_id`):
   - Used by the client application for user login
   - Supports authorization code flow with PKCE
   - Redirect URI: `http://localhost:3001/callback`

2. **Service Client** (`service_client`):
   - Used for client credentials flow
   - Machine-to-machine authentication

3. **Resource Server** (`resource_server`):
   - Used by the resource server for token introspection
   - No grant types (introspection only)

### Scopes and Claims

- **Scopes**: `openid`, `profile`, `email`, `api:read`
- **Claims**:
  - `openid`: `sub`
  - `profile`: `name`
  - `email`: `email`

## Features

- **Dev Interactions**: Enabled for easy testing and development
- **In-Memory Adapter**: Simple storage for demo purposes
- **Client Credentials**: Support for service authentication
- **Introspection**: Token validation for resource servers

## Endpoints

The provider exposes standard OIDC endpoints:

- `/.well-known/openid-configuration` - Discovery document
- `/auth` - Authorization endpoint
- `/token` - Token endpoint
- `/userinfo` - UserInfo endpoint
- `/introspect` - Token introspection endpoint
- `/jwks` - JSON Web Key Set

## Demo User

A demo user is pre-configured:
- **Username**: `user`
- **Subject**: `user`
- **Email**: `user@example.com`
- **Name**: `Demo User`

## Security Considerations

This implementation uses:
- In-memory storage (replace with database in production)
- Hardcoded secrets (use environment variables)
- Simple cookie keys (rotate regularly)

## Dependencies

- `oidc-provider`: Core OIDC server library
- `MemoryAdapter`: In-memory storage adapter

## Running

```bash
pnpm start:provider
```

The provider will start on http://localhost:3000</content>
<parameter name="filePath">/workspaces/oidc-node/packages/identity-provider/README.md