import Utility from './Utility';
import CryptoJS from 'crypto-js';
import { OPERATORS } from './constants';
import userManager from "../utility/userManager";
import browserHasOidcEntry from "./oidcUser";
import store from "../index";
import Env from "../utility/env";
/**
 * Initialize class
 */
class Authorization {
    static ROLE_CONFIG_MANAGER = 'CONFIG MANAGER';
    static ROLE_ADMIN = 'ADMIN';
    /**
     * This is a constructor method
     */
    constructor(){
      this.userExpired = null;
      this.authUser = null;
      this.authUserId = null;
      this.authRole = null;
      this.accessToken = null;
    }
    /**
    * set auth user details to class property
    *
    * @return void
    */
    setAuthUser(){
      try{
        if (typeof sessionStorage.getItem("TUDS") === 'string') {
          this.authUser = JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem("TUDS"), 'kskfdstedsf').toString(CryptoJS.enc.Utf8));
        } else {
          this.authUser = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("AUDS"), 'kskfdste').toString(CryptoJS.enc.Utf8));
        }
      }catch(Exception) {
        this.logout();
      }
    }
    /**
     * User is expired
     * @param  {[type]}  expires_at [description]
     * @return {Boolean}            [description]
     */
    isExpired(expires_at) {
        let userFromWebStorage = browserHasOidcEntry();
        let timeStamp = Math.floor(Date.now() / 1000);
        if(userFromWebStorage && userFromWebStorage.expires_at && timeStamp > userFromWebStorage.expires_at) {
            return true;
        }
        return false;
    }

    /**
    * check is active user is logged in
    *
    * @return boolean
    */
    isLoggedIn(){
      let userFromWebStorage = browserHasOidcEntry();
      return (typeof localStorage.getItem("AUDS") === 'string' && userFromWebStorage) ||  (typeof sessionStorage.getItem("TUDS") === 'string' && userFromWebStorage)
    }
    /**
     * To check session storage
     *
     * @return boolean
     */
    isSessionStorage() {
      try {
        if (typeof sessionStorage.getItem("TUDS") === 'string' && JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem("TUDS"), 'kskfdstedsf').toString(CryptoJS.enc.Utf8))) {
          return true;
        }
      } catch (Exception) {
        return false;
      }
      return false
    }
    /**
    * check is active user has to verify OTP
    *
    * @return boolean
    */
    isPendingOtpVerify(){
      return typeof localStorage.getItem("landingUserDetails") === 'string'
    }
    /**
    * check is active user is logged in
    *
    * @return boolean
    */
    getLandedUserEmail(){
      let landingUser =  JSON.parse(localStorage.getItem("landingUserDetails"));
      return landingUser.email;
    }
    /**
    * check user is having the expected role
    *
    * @param role
    * @return boolean
    */
    isUserRole(role){
      let user = this.getAuthUser();

      return (
        Utility.isObject(user)
        && Utility.isObject(user.userRole)
        && user.userRole.name === role
      );
    }
    /**
    * check logged user is admin
    *
    * @return boolean
    */
    isAdmin(){
      return this.isUserRole(Authorization.ROLE_ADMIN);
    }
    /**
    * check logged user is config manager
    *
    * @return boolean
    */
    isConfigManager(){
      return this.isUserRole(Authorization.ROLE_CONFIG_MANAGER);
    }
    /**
    * get logged in user details
    *
    * @return boolean
    */
    getAuthUser(isLocalStorage){
      if (isLocalStorage && this.isLoggedIn()) {
        try {
          return JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("AUDS"), 'kskfdste').toString(CryptoJS.enc.Utf8));
        } catch (Exception) {
          this.logout();
        }
      }else if(this.isLoggedIn() && !this.authUser){
        this.setAuthUser();
      }

      return this.authUser;
    };
    /**
    * get oauth token
    *
    * @return string
    */
    getOauthToken() {
      let accessToken = null;
      if(!this.isLoggedIn()){
        accessToken = localStorage.getItem('oidc_token');
      }
      return accessToken;
    }
    /**
    * get logged in user details
    *
    * @return boolean
    */
    getAuthUserUpdated(){
      if(this.isLoggedIn()){
        this.setAuthUser();
      }
      return this.authUser;
    };
    /**
    * get auth user identifier
    *
    * @return int
    */
    getAuthUserId(){
      let user = this.getAuthUser();

      return (Utility.isObject(user) && user.id) ? user.id : 0;
    };

    signInOauth() {
      userManager.signinRedirect();
    }
    /**
    * Get authentication access token
    *
    * @return string
    */
    getAccessToken(){
      let accessToken = null;
      let authUser = this.getAuthUser(true);
      if(authUser && Utility.isString(authUser.token)){
        accessToken = authUser.token;
      } else {
        accessToken = this.getOauthToken();
      }
      return accessToken;
    };
    /**
    * login the user by setting it in local storage
    *
    * @return boolean
    */
    login(userDetails){
      if (typeof(Storage) !== "undefined") {
          localStorage.removeItem("oidc_token");
          localStorage.removeItem("AUDS");
          sessionStorage.removeItem("TUDS");
        if(userDetails.role === OPERATORS) {
          localStorage.setItem("TDST", CryptoJS.AES.encrypt('Tenant Login', 'kskfdste').toString());
        }
        localStorage.setItem("AUDS", CryptoJS.AES.encrypt(JSON.stringify(userDetails), 'kskfdste').toString());
        localStorage.setItem("TTDS", CryptoJS.AES.encrypt('0', 'kskfdste').toString());
      } else {
          console.error("local storage is not supported");
      }
    };
    /**
    * login the user by setting it in local storage
    *
    * @return boolean
    */
    pendingOtpVerify(userDetails){
      if (typeof(Storage) !== "undefined") {
          localStorage.removeItem("otpSentAt");
          localStorage.removeItem("otpExpiresAt");
          localStorage.removeItem("landingUserDetails");

          localStorage.setItem("otpSentAt", Math.floor(Date.now() / 1000));
          localStorage.setItem("landingUserDetails",JSON.stringify(userDetails));
      } else {
          console.error("local storage is not supported");
      }
    };
    /**
    * get logged in user details
    *
    * @return boolean
    */
    logout(){
      if (typeof(Storage) !== "undefined") {
          localStorage.removeItem("AUDS");
          sessionStorage.removeItem("TUDS");
          localStorage.removeItem("TTDS");
          localStorage.removeItem("TDST");
          // window.location.href = (Env.getEnv('REACT_APP_HOMEPAGE')) ? Env.getEnv('REACT_APP_HOMEPAGE') : '/';
      } else {
          console.error("local storage is not supported");
      }
    };

    /**
     * Clear landing user details
     *
     * @return boolean
     */
    clearOtpVerifyGoHome(){
      if (typeof(Storage) !== "undefined") {
          localStorage.removeItem("otpSentAt");
          localStorage.removeItem("otpExpiresAt");
          localStorage.removeItem("landingUserDetails");
      } else {
          console.error("local storage is not supported");
      }
    };

    /**
     * Get current Timestamp
     */
    getCurrentTimeStamp() {
      let timeStamp = Math.floor(Date.now() / 1000);
      return timeStamp;
    }

    /**
     * Get current Timestamp
     */
    otpSentAt() {
      return localStorage.getItem('otpSentAt');
    }
}

/**
 * Export class
 */
export default new Authorization();
