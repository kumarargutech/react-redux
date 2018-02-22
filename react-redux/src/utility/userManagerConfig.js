import { WebStorageStateStore } from 'redux-oidc/node_modules/oidc-client';
import Env from "./env";

Env.fetchEnv();

const userManagerConfig = {
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  client_id: Env.getEnv('REACT_APP_OAUTH_CLIENT_ID'),
  post_logout_redirect_uri: Env.getEnv('REACT_APP_SERVER_URL') + Env.getEnv('REACT_APP_HOMEPAGE'),
  redirect_uri: Env.getEnv('REACT_APP_SERVER_URL') + Env.getEnv('REACT_APP_HOMEPAGE')+'oauth/callback',
  silent_redirect_uri: Env.getEnv('REACT_APP_SERVER_URL') + '/renew/index.html',
  response_type: 'token id_token', //
  scope: Env.getEnv('REACT_APP_OAUTH_SCOPE'),
  nonce: Env.getEnv('REACT_APP_OAUTH_NONCE'),
  acr_values: Env.getEnv('REACT_APP_OAUTH_ACR'),
  authority: Env.getEnv('REACT_APP_OAUTH_SERVER'),
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: Env.getEnv('REACT_APP_OAUTH_EXPIRY_CHECK'),
  revokeAccessTokenOnSignout: true,
};

export default userManagerConfig;
