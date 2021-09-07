const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `http://${host}:${port}/auth/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    // audience: 'YOUR_API_IDENTIFIER',
    issuer: ['https://fiorfor.eu.auth0.com/', 'https://seller.eu.auth0.com/'],
    algorithms: ['RS256']
});

export {checkJwt}