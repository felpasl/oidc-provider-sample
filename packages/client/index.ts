import express, { Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
// @ts-ignore
import { Issuer, generators } from 'openid-client';

declare module 'express-session' {
  interface SessionData {
    nonce: string;
    state: string;
    code_verifier: string;
    user?: any;
    accessToken?: string;
  }
}

const app = express();

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(express.json());

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    const issuer = await Issuer.discover('http://localhost:3000');
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);

    const client = new issuer.Client({
      client_id: 'client_id',
      client_secret: 'client_secret',
      redirect_uris: ['http://localhost:3001/callback'],
      response_types: ['code'],
    });
    const serviceClient = new issuer.Client({
      client_id: 'service_client',
      client_secret: 'service_secret',
    });

    app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    app.get('/login', (req: Request, res: Response) => {
      const nonce = generators.nonce();
      const state = generators.state();
      const code_verifier = generators.codeVerifier();
      const code_challenge = generators.codeChallenge(code_verifier);
      req.session.nonce = nonce;
      req.session.state = state;
      req.session.code_verifier = code_verifier;
      const url = client.authorizationUrl({
        scope: 'openid email profile api:read',
        state,
        nonce,
        code_challenge,
        code_challenge_method: 'S256',
      });
      res.redirect(url);
    });

    app.get('/callback', async (req: Request, res: Response) => {
      const params = client.callbackParams(req);
      const { nonce, state, code_verifier } = req.session;
      const tokenSet = await client.callback('http://localhost:3001/callback', params, { state, nonce, code_verifier });
      console.log('received and validated tokens %j', tokenSet);
      console.log('validated ID Token claims %j', tokenSet.claims());
      let sessionUser = tokenSet.claims();
      if (tokenSet.access_token) {
        try {
          const userinfo = await client.userinfo(tokenSet.access_token);
          sessionUser = { ...sessionUser, ...userinfo };
        } catch (error) {
          console.error('Failed to load userinfo during callback:', error);
        }
      }
      req.session.user = sessionUser;
      req.session.accessToken = tokenSet.access_token;
      res.redirect('/');
    });

    app.get('/api/user', async (req: Request, res: Response) => {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = req.session.user;
      const accessToken = req.session.accessToken;
      let resourceData = null;
      let userinfo = user;

      if (accessToken) {
        try {
          // Get full userinfo
          userinfo = { ...userinfo, ...(await client.userinfo(accessToken)) };

          const response = await fetch('http://localhost:3002/protected', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            resourceData = await response.json();
          }
        } catch (error) {
          console.error('Failed to get userinfo or call resource:', error);
        }
      }

      res.json({
        user: userinfo,
        resource: resourceData,
      });
    });

    app.post('/api/client-credentials-resource', async (_req: Request, res: Response) => {
      try {
        const tokenSet = await serviceClient.grant({
          grant_type: 'client_credentials',
          scope: 'api:read',
        });
        if (!tokenSet.access_token) {
          return res.status(500).json({ error: 'Failed to obtain access token' });
        }

        const response = await fetch('http://localhost:3002/protected', {
          headers: {
            Authorization: `Bearer ${tokenSet.access_token}`,
          },
        });

        if (!response.ok) {
          console.error('Service resource request failed:', response.statusText);
          return res.status(response.status).json({ error: 'Protected resource request failed' });
        }

        const resourceData = await response.json();
        res.json({
          resource: resourceData,
          token: {
            access_token: tokenSet.access_token,
            expires_in: tokenSet.expires_in,
            scope: tokenSet.scope,
            token_type: tokenSet.token_type,
          },
        });
      } catch (error) {
        console.error('Client credentials flow failed:', error);
        res.status(500).json({ error: 'Client credentials flow failed' });
      }
    });

    app.get('/logout', (req: Request, res: Response) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.redirect('/');
      });
    });

    app.listen(3001, () => {
      console.log('Client app listening on http://localhost:3001');
    });
  } catch (err) {
    console.error(err);
  }
})();
