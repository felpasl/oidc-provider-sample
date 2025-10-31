import express, { Request, Response, NextFunction } from 'express';
// @ts-ignore
import { Issuer } from 'openid-client';

const app = express();

app.use(express.json());

// Middleware to validate Bearer token
async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const issuer = await Issuer.discover('http://localhost:3000');
    const validationClient = new issuer.Client({
      client_id: 'resource_server',
      client_secret: 'resource_secret',
    });

    const tokenDetails = await validationClient.introspect(token, 'access_token');
    if (!tokenDetails.active) {
      throw new Error('Token is not active');
    }
    if (!tokenDetails.scope || !tokenDetails.scope.split(' ').includes('api:read')) {
      throw new Error('Required scope api:read is missing');
    }

    let userinfo: any | null = null;
    if (tokenDetails.client_id === 'client_id') {
      try {
        const rpClient = new issuer.Client({
          client_id: 'client_id',
          client_secret: 'client_secret',
        });
        userinfo = await rpClient.userinfo(token);
      } catch (userinfoError) {
        console.warn('Failed to load userinfo for resource request:', userinfoError);
      }
    }

    (req as any).authContext = { tokenDetails, user: userinfo };
    next();
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(403).json({ error: 'Invalid access token' });
  }
}

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({
    message: 'This is a protected resource',
    user: (req as any).authContext?.user || null,
    tokenDetails: (req as any).authContext?.tokenDetails || null,
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Resource Server is running. Try /protected with Bearer token');
});

app.listen(3002, () => {
  console.log('Resource Server listening on http://localhost:3002');
});
