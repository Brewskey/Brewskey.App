// Seeds the device cloud's admin user with a deterministic access token.
// Runs once on first mongo boot (the stack has no volume, so every
// `docker compose up` is a first boot).
//
// The token must match Particle__CloudAccessToken in docker-compose.yml and
// CLOUD_ADMIN_TOKEN in tests/fixtures/seed-api.ts. spark-server validates
// bearer tokens by looking them up in users.accessTokens; role
// 'administrator' makes the Brewskey.Web proxy's calls see every device.
const cloudDb = db.getSiblingDB('spark-server');

cloudDb.users.insertOne({
  username: 'e2e-cloud-admin@brewskey.test',
  // Never logged into via password; bearer-token auth only.
  passwordHash: 'password-login-disabled',
  salt: 'password-login-disabled',
  role: 'administrator',
  created_at: new Date(),
  accessTokens: [
    {
      accessToken: 'e2e-cloud-admin-token-3f9c1a7e5d2b4860',
      accessTokenExpiresAt: new Date('2099-01-01T00:00:00Z'),
    },
  ],
});
