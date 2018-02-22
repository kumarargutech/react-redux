import dot from "dot-object";

Array.prototype.getKey = function () {
    var i;
    for (i = 0; i < this.length; i++) {
        if ((this[i] !== "" && !isNaN(this[i]))) {
            this.splice(i + 1)
            if (this.indexOf('WIFI') !== -1) {
                this.splice(i + 1, 1, "SSID");
            }else {
                this.splice(i + 1, 1, "name");
            }
            return this.join(".");
        }
    }
};

Array.prototype.hasNum = function () {
    var i;
    for (i = 0; i < this.length; i++) {
        if ((this[i] !== "" && !isNaN(this[i]))) {
            return true;
        }
    }
    return false;
};

Array.prototype.hasValue = function (data) {
    var i;
    var currentData = this;
    currentData.splice(4);
    for (i = 0; i < data.length; i++) {
        let value = data[i].split(".");
        value.splice(4);
        if (currentData.join(".") === value.join(".")) {
            return true;
        }
    }
    return false;
};
class Utility {


    /**
     * To check whether is valid json or not
     * 
     * @param {mixed} data 
     */
    static isJSON (data) {
       try {
         JSON.parse(data);
       } catch(e) {
         return false;
       }
       return true;
    }
   /**
    * Get element from array by property
    *
    * @param array
    * @param mixed
    * @param string
    * @return mixed
    */
    static getElementFromArrayByProperty(elements, value, property = "id") {
        let selectedScriptIndex = false;

        let selectedElement = elements.filter((element, index) => {
            let filtered = false;

            if (element[property] === value){
                filtered = true;
                selectedScriptIndex = index;
            }

            return filtered;
        });

        return {element: selectedElement.shift(), index: selectedScriptIndex};
    } 

   /**
    * Delete element from array by property value
    *
    * @param array
    * @param mixed
    * @param string
    * @return mixed
    */
    static removeElementFromArrayByProperty(elements, value, property = "id") {
        return elements.filter((element, index) => {
            return element[property] && element[property] !== value;
        });
    }

   /**
    * Safly push element to array
    *
    * @param elements
    * @param element
    * @param string
    * @return array
    */
    static safelyPushElementToArray(elements, element, property = "id") {
        let elementInfo = Utility.getElementFromArrayByProperty(elements, element[property]);

        if (!elementInfo.index && Array.isArray(elements)){
            elements.push(element);
        }

        return elements;
    }     

    /**
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    static isObject(value) {
        return value !== null && typeof value === "object";
    }        

    /**
     *
     * @description
     * Determines if a reference is a `String`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    static isString(value) {
        return typeof value === "string";
    } 

    /**
     *
     * @description
     * Format the date as {2017-04-03 / 14:58:00}
     *
     * @param date.
     * @returns String
     */
    static getFormattedDate(date) {
        date = new Date(date);
        let prefixAdder = (data) => {
            return data < 10 ? `0${data}` : data;
        };  

        return `${date.getFullYear()}-${prefixAdder((date.getMonth() + 1))}-${prefixAdder(date.getDate())} 
                / ${prefixAdder(date.getHours())}:${prefixAdder(date.getMinutes())}:${prefixAdder(date.getSeconds())}`;
    }  

    /**
     *
     * @description
     * Compare two objects
     *
     * @param object1
     * @param object2.
     * @returns boolean
     */
    static equals(o1, o2) {
        if (o1 === o2) {
            return true; 
        }
        if (o1 === null || o2 === null) {
            return false; 
        }
      // eslint-disable-next-line no-self-compare
        if (o1 !== o1 && o2 !== o2) {
            return true;
        } // NaN === NaN
        var t1 = typeof o1, t2 = typeof o2, key, keySet;
        if (t1 === t2 && t1 === "object") {
            keySet = Object.create(null);
            for (key in o1) {
                if (key.charAt(0) === "$" || Utility.isFunction(o1[key])) {
                    continue;
                }
                if (!Utility.equals(o1[key], o2[key])) {
                    return false; 
                }
                keySet[key] = true;
            }
            for (key in o2) {
                if (!(key in keySet) &&
                key.charAt(0) !== "$" &&
                Utility.isDefined(o2[key]) &&
                !Utility.isFunction(o2[key])) {
                    return false; 
                }
            }
            return true;
        // }
        }
        return false;
    }

    /**
     * Determines if a value is a regular expression object.
     *
     * @private
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    static isRegExp(value) {
        return toString.call(value) === "[object RegExp]";
    }

    /**
     * @description
     * Determines if a value is a date.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Date`.
     */
    static isDate(value) {
        return toString.call(value) === "[object Date]";
    }                  

    /**
     * @description
     * Determines if a reference is a `Function`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    static isFunction(value) {
        return typeof value === "function";
    }

    /**
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    static isDefined(value) {
        return typeof value !== "undefined";
    } 

    /**
     * @description
     * Check current browser is ie
     *
     * @returns {boolean} True if `value` is defined.
     */
    static isIE() {
        return /*@cc_on!@*/false || Boolean(document.documentMode);
    } 

    /**
     * @description
     * Check current browser is Edge
     *
     * @returns {boolean} True if `value` is defined.
     */
    static isEdge() {
        return !Utility.isIE() && Boolean(window.StyleMedia);
    } 

    /**
     * @description
     * Get image as base 64
     *
     * @param image
     * @param ext
     * @returns string
     */
    static getImageAsBase64(image, ext) {
        return `data:image/${ext};base64,${image}`;
    }  
    
    /**
     * To get the value based on the  condition
     * 
     * @param {object} nextProps 
     * @param {string} valid 
     * @param {mixed} invalid 
     */
    static checkValidJson(nextProps, valid, invalid,key) {
        let keyValue = (key) ? key : "selectedSite";
        return (nextProps[keyValue].devices && nextProps[keyValue].devices.length > 0 && nextProps[keyValue].devices[nextProps.deviceIndex].serviceConfigs) ? valid.split('.').reduce((o, i) => o[i], nextProps) : invalid;
    }

    /**
     * To get the value based on two condition
     * 
     * @param {object} nextProps 
     * @param {string} valid 
     * @param {mixed} invalid 
     */
    static checkConditionalJson(nextProps, valid, invalid, condition,key) {
        let keyValue = (key) ? key : "selectedSite";
        return (condition && nextProps[keyValue].devices && nextProps[keyValue].devices.length > 0 && nextProps[keyValue].devices[nextProps.deviceIndex].serviceConfigs) ? valid.split('.').reduce((o, i) => o[i], nextProps) : invalid;
    }

    /**
     * To check the ternary operator
     * 
     * @param {*} nextProps 
     * @param {*} valid 
     * @param {*} invalid 
     */
    static checkTernary(nextProps, valid, invalid) {
        return (nextProps.selectedSite.devices && nextProps.selectedSite.devices.length > 0) ? valid.split('.').reduce((o, i) => o[i], nextProps) : invalid;
    }
    
    /**
     * To check the ternary condition
     * 
     * @param {boolean} valid 
     * @param {mixed} value1 
     * @param {mixed} value2 
     */
    static checkCondition(valid,value1,value2) {
        return valid ? value1 : value2;
    }

    /**
     * To get the error message of the tab
     */
    static getErrorMessage(errorJson,valid,invalid) {
        let response = invalid;
        if (errorJson && typeof errorJson.configErrorMsg === "object" && dot.pick(valid, errorJson.configErrorMsg)) {
            let source = dot.pick(valid, errorJson.configErrorMsg);
            for(let k in source) {
                if (Array.isArray(source[k])) {
                    try{
                        response[Object.keys(source[k][0])[0]] = { has: true, message: Object.values(source[k][0])[0]}
                    }catch(e) {
                        response
                    }
                }else {
                    response[k] = { has: true, message: source[k]}
                }
            }
        }
        return response;
    }

    /**
     * To get the error message key
     */
    static getErrorMessageKey(key, device,locale) {
        let clonedKey = key;
        let value = "";
        let name = "";
        

        if (clonedKey && clonedKey.split(".").indexOf('qosDscp') === -1 && clonedKey.split(".").indexOf('urls') === -1 && clonedKey.split(".").indexOf('radioRangeMapping') === -1 && clonedKey.split(".").hasNum()) {
            clonedKey = clonedKey.split(".").getKey();
            name = Utility.getErrorMessageName(key, locale);
            if (dot.pick(clonedKey, device)) {
                value = (name) ? name + " : " + dot.pick(clonedKey, device) + " - " : name + dot.pick(clonedKey, device) + " - "; 
            }else {
                value = name+" : ";
            }
            return value;
        }
        name = Utility.getErrorMessageName(key, locale);
        value = (name) ? name+ " : " : "";
        return value;
    }

    static getErrorMessageName(key, locale) {
        let splitedKey = key.split(".");
        let serviceConfigKeys = ["WAN1", "WAN2", "LTE", "LAN", "WIFI", "dhcpV4", "macBinding","singlePortForwarding",
            "multiplePortForwarding", "remoteAccess", "enterpriseSecurity", "antivirus", "IPS","urls",
            "urlCategory", "reputation", "trafficSteering", "qosClass", "qosDscp","qosApplication"];
        let serviceConfigKeyName = {
            "WAN1": "WAN1", "WAN2": "WAN2", "LTE": "LTE", "LAN": "Intranet", "dhcpV4": "Intranet", "WIFI": "Wireless Network", "macBinding": "Device IP address reservation",
            "singlePortForwarding": "Single Port Forwarding", "multiplePortForwarding": "Multiple Port Forwarding", "remoteAccess": "Remote Access",
            "enterpriseSecurity": "Firewall Rules", "antivirus": "Antivirus", "IPS": "IPS", "urls" : "URLS",
            "urlCategory": "URL Category", "reputation": "Reputation", "trafficSteering": "Traffic Steering", "qosClass": "QOS Class",
            "qosDscp": "QOS Dscp", "qosApplication": "QOS Application"};
        for(let i=0;i<serviceConfigKeys.length;i++) {
            if(splitedKey.indexOf(serviceConfigKeys[i]) !== -1) {
                if (Object.prototype.hasOwnProperty.call(locale.errorMessages, serviceConfigKeys[i]) && splitedKey.indexOf("trafficSteering") !== -1) {
                    return "Traffic Steering " + locale.errorMessages[serviceConfigKeys[i]];
                } else if (Object.prototype.hasOwnProperty.call(locale.errorMessages, serviceConfigKeys[i]) && serviceConfigKeys[i] !== "qosDscp") {
                    return locale.errorMessages[serviceConfigKeys[i]];
                } else if (Object.prototype.hasOwnProperty.call(locale.errorMessages, serviceConfigKeys[i])) {
                    splitedKey.splice(4);
                    let index = (splitedKey.indexOf("0") !== -1) ? " : " + locale.errorMessages.High + " -" : (splitedKey.indexOf("1") !== -1) ? " : " + locale.errorMessages.Standard + " -" : " : " + locale.errorMessages.Low +" -";
                    return locale.errorMessages[serviceConfigKeys[i]] + index;
                }
            }
        }
        return false; 
    }

    static getObjectKey(key) {
        let response = [];
        
        for(let i=0;i<key.length;i++) {
            if (key[i] && key[i].split(".").indexOf('qosDscp') !== -1) {
                if (!key[i].split(".").hasValue(response)) {
                    response.push(key[i]);
                }
            }else {
                response.push(key[i]);
            }
        }
        return response;
    }

    static hasError (errors,key) {
        if(dot.pick(key, errors.configErrorMsg)){
            return "highlight-error-message";
        }
        return "";
    }
}

export default Utility;
