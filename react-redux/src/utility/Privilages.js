import Authorization from "../utility/authorization";
import {routes, ROLES} from "../utility/constants";
import toastr from "toastr";

class Privilages {


    /**
     * To check the privilage of the buttons,side menus
     *
     * @param array
     * @param boolean
     * @return boolean
     */
    static isAccessable(privilage, allow) {
        let user = Authorization.getAuthUser();
        if ((user.role === null && allow) || (Array.isArray(privilage) && user.role && privilage.indexOf(user.role) !== -1)) {
            return true;
        }
        return false;
    }

    /**
     * To check the privilage of the buttons,side menus
     *
     * @param string
     * @return boolean
     */
    static isRouteAccessable(routename) {
        let user = Authorization.getAuthUser();
        let allow = (routename === "configuration" || routename === "monitoring" || routename === "inventory" || routename === "user" || routename === "notifications") ? true : false;
        if (user.role !== null && ROLES.indexOf(user.role) === -1) {
            Authorization.logout();
            toastr.error("Not able to login please contact admin");
        }
        if ((user.role === null && allow) || (routes && user.role && routes[user.role] && routes[user.role].indexOf(routename) !== -1)) {
            return true;
        }
        return false;
    }

    /**
     * To check the privilage of the buttons,side menus
     *
     * @param string
     * @return boolean
     */
    static redirectPath(routename) {
        let allow = (routename === "configuration" || routename === "monitoring" || routename === "inventory" || routename === "user" || routename === "notifications") ? true : false;
        if (allow) {
            return "organizations";
        }
        return "configuration";
    }
}

export default Privilages;
