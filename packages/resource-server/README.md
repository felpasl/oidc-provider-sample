# Resource Server

An Express.js API server that demonstrates resource protection using OIDC token validation and introspection.

## Overview

This resource server showcases:

- **Token Validation**: Using OIDC token introspection
- **Bearer Token Authentication**: Standard OAuth 2.0 token usage
- **Scope Validation**: Checking token permissions
- **User Context**: Retrieving user information for authenticated requests
- **Error Handling**: Proper HTTP status codes for auth failures

## Architecture

The server provides a single protected endpoint that:

1. **Validates Tokens**: Uses introspection to verify access tokens
2. **Checks Scopes**: Ensures `api:read` scope is present
3. **Retrieves User Info**: For user-authenticated requests
4. **Returns Protected Data**: JSON response with user and token details

## Authentication Flow

### Bearer Token Validation

1. Client sends request with `Authorization: Bearer <token>`
2. Server extracts the access token
3. Server calls Identity Provider's introspection endpoint
4. Server validates token is active and has required scope
5. For user tokens, server retrieves additional user information
6. Server returns protected resource data

### Client Types

The server handles two types of authenticated requests:

1. **User Requests**: From web client with user context
   - Validates user access token
   - Retrieves user info from UserInfo endpoint
   - Returns user-specific data

2. **Service Requests**: From client credentials flow
   - Validates service access token
   - No user context (machine-to-machine)
   - Returns service-appropriate data

## Endpoints

### Public Endpoints
- `GET /` - Health check and usage information

### Protected Endpoints
- `GET /protected` - Requires Bearer token authentication
  - Headers: `Authorization: Bearer <access_token>`
  - Returns: Protected resource data with user and token information

## Response Format

Successful response from `/protected`:

```json
{
  "message": "This is a protected resource",
  "user": {
    "sub": "user",
    "email": "user@example.com",
    "name": "Demo User"
  },
  "tokenDetails": {
    "client_id": "client_id",
    "scope": "openid email profile api:read",
    "active": true,
    "exp": 1638360000,
    "iat": 1638356400
  }
}
```

## Configuration

- **Client ID**: `resource_server`
- **Client Secret**: `resource_secret`
- **Required Scope**: `api:read`
- **Introspection Endpoint**: Discovered from Identity Provider

## Technologies

- **Express.js**: Web framework
- **openid-client**: OIDC client for discovery and introspection
- **TypeScript**: Type safety

## Security Features

- **Token Introspection**: Validates tokens without local JWT verification
- **Scope Enforcement**: Checks for required permissions
- **Client Validation**: Ensures tokens are issued to authorized clients
- **Error Responses**: Proper HTTP status codes (401, 403)

## Running

```bash
pnpm start:resource
```

The resource server runs on http://localhost:3002

## Testing

You can test the protected endpoint using curl:

```bash
# First obtain an access token, then:
curl -H "Authorization: Bearer <access_token>" http://localhost:3002/protected
```

## Integration

This server integrates with:
- **Identity Provider**: For token validation and user info
- **Client Application**: Receives authenticated requests from users
- **Service Clients**: Handles machine-to-machine requests

The server demonstrates best practices for protecting APIs in an OIDC ecosystem.</content>
<parameter name="filePath">/workspaces/oidc-node/packages/resource-server/README.md