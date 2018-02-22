import RequestFactory from "./requestFactory";
import Request from "sync-request";

class Env {

    constructor() {
        this.env = null;
    }

    /**
     * To fetch the env values
     *
     * @return json
     */
    fetchEnv() {
        let url = window.location.origin+"/assets/env.json";
        var res = Request('GET', url, { headers: {
                  "Cache-Control": "no-cache, no-store, must-revalidate"
                  }});
        this.env = JSON.parse(res.getBody());
        document.getElementsByTagName("title")[0].text = this.env.REACT_APP_ENVIRONMENT_TITLE;
        document.getElementsByTagName("link")[1].href = "assets/" + this.env.REACT_APP_ENVIRONMENT+"/favicon.png";
    }

    /**
    * response parser
    *
    * @return string
    */
    responseParser() {
        return (response) => {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else if (contentType && ((contentType.indexOf("application/pdf") !== -1) || (contentType.indexOf("application/csv") !== -1) || (contentType.indexOf("text/csv") !== -1) || (contentType.indexOf("application/ms-excel") !== -1))) {
                return response.blob();
            } else {
                return response.text();
            }
        }
    }

    /**
     * To set the env values
     *
     * @return json
     */
    setEnv() {
        return this.env;
    }

    /**
     * Get the value based on key
     *
     * @return string
     */
    getEnv(key) {
        let value = this.setEnv();
        return value ? value[key] : '';
    }
}
export default new Env();
