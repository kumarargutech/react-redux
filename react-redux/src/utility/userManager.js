import { createUserManager } from 'redux-oidc';
import toastr from 'toastr';
import Authorization from './authorization';
import { Locale } from "../locale/index";
import userManagerConfig from "./userManagerConfig";

const userManager = createUserManager(userManagerConfig);

userManager.events.addAccessTokenExpired(function(){
    Authorization.logout();
    userManager.clearStaleState();
    userManager.signinRedirect();
});

userManager.events.addUserLoaded(function(response) {
  let authUser = Authorization.getAuthUser();
  if(authUser) {
    authUser.token = response.access_token;
    authUser.expires_at = response.expires_at;
    Authorization.login(authUser);
  }
});

userManager.events.addSilentRenewError(function(response){
    toastr.error(Locale.actions.somethingWentWrongReload)
});

export default userManager;
