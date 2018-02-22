import userManagerConfig from "./userManagerConfig";
/*
 * Oidc-client stores the user object in sessionStore by default.
 * on e.g. a refresh when the redux state is cleared, we use this function
 * to fetch the stored data as a JavaScript object so that the state can
 * be rehydrated.
 * Returns a user object is found and the client_id matches, else false.
 */
const browserHasOidcEntry = () => {
  if(!window.localStorage)
    throw new Error('Storage not available');
  if(window.localStorage.length > 0) {
    return JSON.parse(window.localStorage.getItem('oidc.user:'+userManagerConfig.authority+':'+userManagerConfig.client_id));
  }
  return false;
};
export default browserHasOidcEntry;
