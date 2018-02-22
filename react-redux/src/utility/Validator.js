import english from "../utility/locale/en";
import spanish from "../utility/locale/spanish";
import japanese from "../utility/locale/japanese";
import IpSubnetCalculator from 'ip-subnet-calculator';
import $ from "jquery";
import { DSCPVALUES, VLANIDS} from "../utility/constants";
import "moment/locale/es";
import "moment/locale/ja";
import moment from "moment";

let locale="";
if ((typeof localStorage.getItem("language") === "string")) {
    let language=localStorage.getItem("language");
    if (language==="spanish") {
        locale=spanish;
        moment.locale("es");
    } else if (language==="japanese") {
        locale=japanese;
        moment.locale("ja");
    } else {
        locale=english;
        moment.locale("en");
    }
} else {
    locale=english;
    moment.locale("en");
}

var validator = {
    rules: {},
    locale: {},
    errors: {},
    params: {},
    forms: {},
    currentModule: false,
    localeLoaded: false,
    component: false,
    through: "angular",
    asyncErrors: {},
    angularPromise: false,
    RADIO: "radio",
    blurEventListner: function(event){
        const element = event.target;

        let initValidator = () => {
            var errors = validator.validateElement(element, null);

            if (validator.component && validator.component.hasOwnProperty("state")){
                errors = validator.getFormattedErrorMessage(errors, validator.component.state.inputErrors ? validator.component.state.inputErrors : {}, element);
                validator.component.setState({inputErrors: errors});
            }
        };

        if ((element.dataset !== undefined && element.dataset.hasOwnProperty("datepicker")) || element.getAttribute("data-datepicker")){
            setTimeout(initValidator, 200);
        } else {
            initValidator();
        }
    },
    setComponent: function(component){
        this.component = component;

        return this;
    },
    reintializeValidation: function(form, scope, module){
        if (module && !scope.errors[module]){
            scope.errors[module] = {};
        }

        if (module && module.trim().length > 0){
            validator.setCurrentModule(module).setFormByModule(form);
        }

        form.find("textarea,select,input:not(input[type=\"hidden\"],input[type=\"submit\"],input[type=\"file\"],input[data-ignore-validation])").each(function(){
            $(this).on("blur", function(){
                var element = this;

                var initValidator = function(){
                    var errors = validator.validateElement(element, module);

                    if (scope.hasOwnProperty("errors")){
                        if (module && module.trim().length > 0){
                            scope.errors[module] = validator.getFormattedErrorMessage(errors, scope.errors.hasOwnProperty(module) ? scope.errors[module] : {}, element);
                        } else {
                            scope.errors = validator.getFormattedErrorMessage(errors, scope.errors, element);
                        }

                        if (!scope.$$phase){
                            scope.$apply();
                        }
                    }
                };

                if ((element.dataset !== undefined && element.dataset.hasOwnProperty("datepicker")) || element.getAttribute("data-datepicker")){
                    setTimeout(initValidator, 200);
                } else {
                    initValidator();
                }
            });
        });
    },
    validateReactForm: function(form, module){
        if (!validator.component || !validator.component.state){
            validator.component = {state: {inputErrors: {}}};
        }
        if (module && !validator.component.state.inputErrors[module]){
            validator.component.state.inputErrors[module] = {};
        }
        $(form).find("textarea,select,input:not(input[type=\"submit\"],input[type=\"file\"],input[data-ignore-validation],input[data-unique])").each(function(){
            var validationErrors = validator.validateElement(this, module);

            if (module){
                Object.assign(
            validator.component.state.inputErrors[module],
            validator.getFormattedErrorMessage(validationErrors, validator.component.state.inputErrors[module], this)
          );
            } else {
                Object.assign(validator.component.state.inputErrors, validator.getFormattedErrorMessage(validationErrors, validator.component.state.inputErrors, this));
            }
        });

        validator.component.setState({inputErrors: validator.component.state.inputErrors});

        return Object.keys(typeof module === "string" ? validator.component.state.inputErrors[module] : validator.component.state.inputErrors).length === 0;
    },
    loadLocale: function(){
        if (typeof locale === "object" && locale !== null){
            validator.setLocale(locale);
        }
    },
    getFormattedErrorMessage: function(validationErrors, errors, element) {
        var index = (element.dataset !== undefined && element.dataset.hasOwnProperty("index")) ? element.dataset.index : element.hasAttribute("index") ? element.getAttribute("index") : false;
        var parent = (element.dataset !== undefined && element.dataset.hasOwnProperty("parent")) ? element.dataset.parent : element.hasAttribute("parent") ? element.getAttribute("parent") : false;
        if (Object.keys(validationErrors).length === 0){
            if (
        index
        && parent
        && errors.hasOwnProperty(parent)
        && errors[parent].hasOwnProperty(index)
        && errors[parent][index].hasOwnProperty(element.getAttribute("name"))
      ){
                delete errors[parent][index][element.getAttribute("name")];

                if (Object.is({}, errors[parent][index])){
                    delete errors[parent][index];
                }

                if (Object.is({}, errors[parent])){
                    delete errors[parent];
                }
            } else if (errors.hasOwnProperty(element.getAttribute("name"))){
                delete errors[element.getAttribute("name")];
            }
            return errors;
        }

        Object.keys(validationErrors).forEach((field) => {
            var msg = validationErrors[field];

            if (msg){
                if (index && parent){
                    if (!errors.hasOwnProperty(parent)){
                        errors[parent] = {};
                    }

                    if (!errors[parent].hasOwnProperty(index)){
                        errors[parent][index] = {};
                    }

                    errors[parent][index][field] = {has: true, message: msg};
                } else {
                    errors[field] = {has: true, message: msg};
                }
            } else if (errors.hasOwnProperty(element.getAttribute("name"))){
                delete errors[element.getAttribute("name")];
            }
        });
        return errors;
    },
    fillElementErrorMessageUsingJquery: function(element, errors) {
        var eleName = element.getAttribute("name");
        errors = (typeof errors === "object") ? errors : this.errors;

        if (errors.hasOwnProperty(eleName) && errors[eleName]) {
            $(element).parent().addClass("has-error").find(".help-block").removeClass("hide").text(errors[eleName]);
        }
    },
    fillMultiCheckErrorMessageUsingJquery: function(element, errors, elementName) {
        errors = (typeof errors === "object") ? errors : this.errors;

        if (errors.hasOwnProperty(elementName) && errors[elementName]) {
            $(element).closest("div.form-group").addClass("has-error").find(".help-block").removeClass("hide").text(errors[elementName]);
        }
    },
    cleanElementErrorMessage: function(element) {
        $(element).parent().removeClass("has-error").find(".help-block").addClass("hide").text("");

        return this;
    },
    cleanMultiCheckElementErrorMessage: function(element) {
        $(element).closest("div.form-group").removeClass("has-error").find(".help-block").addClass("hide").text("");

        return this;
    },
    reintializeEventValidationByModule: function(module, scope) {
        if (this.forms.hasOwnProperty(module) && typeof this.forms[module] === "object"){
            this.forms[module].find("textarea,select,input:not(input[type=\"hidden\"],input[data-datepicker],input[type=\"submit\"],input[type=\"file\"],input[data-ignore-validation])").each(function(){
                $(this).on("blur", function(){
                    var errors = validator.validateElement(this, module);

                    if (scope.hasOwnProperty("errors")){
                        scope.errors[module] = validator.getFormattedErrorMessage(errors, scope.errors.hasOwnProperty(module) ? scope.errors[module] : {}, this);

                        if (!scope.$$phase){
                            scope.$apply();
                        }
                    }
                });
            });
        }

        return this;
    },
    validateElement: function(element, module){
        if (!element.hasAttribute("data-ignore-validation")){
            var elementRule = this.getRuleByElement(element, module);

            if (elementRule){
                return this.validate(element, elementRule);
            }
        }

        return {};
    },
    validate: function(element, elementRule){
        var rules = elementRule.split("|");
        if (this.through !== "jQuery"){
            this.errors = {};
        }
        this.errors = {};
        for (var iter = 0; iter < rules.length; iter++){
            var validatorMethod = this.getValidatorName(rules[iter]);
            this.setParamByRule(rules[iter]);

            if (this.hasOwnProperty(validatorMethod) && !this[validatorMethod](element)){
                if (validatorMethod !== "validateUnique"){
                    this.setErrorMessageForElement(this.getParseRuleName(rules[iter]), element);
                }
                break;
            }
        }
        return this.errors;
    },
    setRules: function(rules, module){
        if (typeof rules === "object" && rules !== null && typeof module === "string"){
            this.rules[module] = rules;
        } else if (typeof rules === "object" && rules != null){
            this.rules = rules;
        } else {
            this.rules = {};
        }

        return this;
    },
    setLocale: function(locale){
        this.locale = (typeof locale === "object") ? locale : {};

        return this;
    },
    setScope: function(scope){
        this.scope = scope;

        return this;
    },
    setCurrentModule: function(module){
        this.currentModule = module;

        return this;
    },
    setFormByModule: function(form){
        if (this.currentModule){
            this.forms[this.currentModule] = form;
        }

        return this;
    },
    setAngularPromise: function(promise){
        this.angularPromise = promise;

        return this;
    },
    setTinyMceElementValidation: function(element){
        element.on("blur", function(e) {
            if (typeof element.targetElm === "object"){
                element.targetElm.innerHTML = element.getContent();
                validator.cleanElementErrorMessage(element.targetElm).validateElement(element.targetElm);
                validator.fillElementErrorMessageUsingJquery(element.targetElm, false);
            }
        });
    },
    getRuleByElement: function(element, module){
        var eleName = (typeof element === "string") ? element : element.getAttribute("name");
        var rulesByModule = (typeof module === "string" && this.rules.hasOwnProperty(module))? this.rules[module] : this.rules;

        return rulesByModule.hasOwnProperty(eleName) ? rulesByModule[eleName] : false;
    },
    ucfirst: function(str) {
        str = String(str);
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    },
    getErrorMessageByRule: function(rule){
        let message = false;

        try {
            message = (this.locale.hasOwnProperty(rule)) ? this.locale[rule] : false;
        } catch (error){
            return error;
        }

        return message;
    },
    getValidatorName: function(rule) {
        var validatorMethod = "validate"+this.ucfirst(this.camelCase(rule));

        if (validatorMethod.indexOf(":") !== -1){
            validatorMethod = validatorMethod.substr(0, validatorMethod.indexOf(":"));
        }

        return validatorMethod;
    },
    camelCase: function (str) {
        return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
            return (p2) ? p2.toUpperCase() : p1.toLowerCase();
        });
    },
    getParseRuleName: function(ruleName) {
        if (ruleName.indexOf(":") !== -1){
            ruleName = ruleName.substr(0, ruleName.indexOf(":"));
        }

        return ruleName;
    },
    setParamByRule: function(rule) {
        var params = this.getParamFromRule(rule);
        var ruleName = this.getParseRuleName(rule);

        if (typeof params === "object" && params.length > 0){
            switch (ruleName){
            case "max":
                var maxLength = parseInt(params[0], 10);

                if (typeof maxLength === "number"){
                    this.params[ruleName] = maxLength;
                }
                break;

            case "min":
                var minLength = parseInt(params[0], 10);

                if (typeof minLength === "number"){
                    this.params[ruleName] = minLength;
                }
                break;
            case "required_unless":
            case "required_if":
                if (params.length > 1){
                    this.params[ruleName] = {inputName: params[0], inputValue: params[1]};
                }
                break;
            case "url":
                this.params[ruleName] = {inputName: params[0]};
                break;
            case "required_with":
                this.params[ruleName] = {inputName: params[0]};
                break;
            case "same":
                this.params[ruleName] = {inputName: params[0]};
                break;
            case "password":
                this.params[ruleName] = {inputName: params[0]};
                break;
            case "different":
                this.params[ruleName] = {inputName: params[0]};
                break;
            default:
                break;
            }
        }

        return ruleName;
    },
    getParamFromRule: function(rule) {
        var params = [];

        if (rule.indexOf(":") !== -1){
            params = rule.substr(rule.indexOf(":") + 1).split(",");
        }

        return params;
    },
    formatName: function(name) {
        if (name && name.indexOf("_id") !== -1){
            name = name.substr(0, name.indexOf("_id"));
        } else if (name){
            name = this.camelCase(name);
        }

        return name;
    },

  /**
   * Get dom element object by name
   * if index is set get the element by id
   *
   * @param string name
   * @param string index
   * @return object
   */
    getElement: function(name, index) {
        if (typeof index !== "undefined"){
            return document.getElementById(name+"_"+index);
        }

        var elements = document.getElementsByName(name);
        var matchedElement = false;

        if (elements.length > 0){

      /**
       * If the element is radio will return the selected radio element
       */
            if (elements[0].getAttribute("type") === this.RADIO){
                for (var i = 0;i < elements.length; i++) {
                    if (elements[i].checked){
                        matchedElement = elements[i];
                        break;
                    }
                }
            } else {
                matchedElement = elements[0];
            }
        }

        return matchedElement;
    },
    setErrorMessageForElement: function(rule, element, params) {
        var eleName = element.getAttribute("name");
        var eleValidationName = element.getAttribute("data-validation-name") ? element.getAttribute("data-validation-name") : element.getAttribute("name");
        var displayName = eleValidationName;
        var message = this.getErrorMessageByRule(rule);

        if (element.hasAttribute("data-validation-message")){
            message = element.getAttribute("data-validation-message");
        } else if (message){
            switch (rule){
            case "max":
                if (typeof message === "object" && element.getAttribute("type") === "number" && message.hasOwnProperty("numeric") ){
                    message = message.numeric.replace(/:attribute/g, this.ucfirst(displayName)).
                                      replace(/:max/g, this.params.hasOwnProperty("max") ? this.params.max : "");
                } else if (typeof message === "object" && message.hasOwnProperty("string")){
                    message = message.string.replace(/:attribute/g, this.ucfirst(displayName)).
                                    replace(/:max/g, this.params.hasOwnProperty("max") ? this.params.max : "");
                }
                break;

            case "min":
                if (typeof message === "object" && element.getAttribute("type") === "number" && message.hasOwnProperty("numeric") ){
                    message = message.numeric.replace(/:attribute/g, this.ucfirst(displayName)).
                                      replace(/:min/g, this.params.hasOwnProperty("min") ? this.params.min : "");
                } else if (typeof message === "object" && message.hasOwnProperty("string")){
                    message = message.string.replace(/:attribute/g, this.ucfirst(displayName)).
                                      replace(/:min/g, this.params.hasOwnProperty("min") ? this.params.min : "");
                }
                break;
            case "required_unless":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                             replace(/:other/g, this.ucfirst(this.formatName(this.params.required_unless.inputName))).
                             replace(/:value/g, this.params.required_unless.hasOwnProperty("label")
                              ? this.params.required_unless.label : "");
                break;
            case "required_if":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                             replace(/:other/g, this.ucfirst(this.formatName(this.params.required_if.inputName))).
                             replace(/:value/g, this.params.required_if.hasOwnProperty("label")
                              ? this.params.required_if.label : "");
                break;
            case "required_with":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                             replace(/:values/g, this.ucfirst(this.formatName(this.params.required_with.inputName))).
                             replace(/:value/g, this.params.required_with.hasOwnProperty("label"));
                break;
            case "same":
                if (this.params.same.inputName==="userpassword"){
                    message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                             replace(/:other/g, this.ucfirst("password")).
                             replace(/:value/g, this.params.same.hasOwnProperty("label"));
                } else {
                    message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                     replace(/:other/g, this.ucfirst(this.formatName(this.params.same.inputName))).
                                 replace(/:value/g, this.params.same.hasOwnProperty("label"));
                }
                break;
            case "different":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                     replace(/and :other/g, "").
                     replace(/:value/g, this.params.different.hasOwnProperty("label"));
                break;
            case  "ipabove20":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                    replace(/and :other/g, "").
                    replace(/:value/g, this.params.hasOwnProperty("ipabove20") ? this.params.ipabove20 : "");
                break;
            case "url":
                message = message.replace(/:attribute/g, this.ucfirst(displayName));
                break;
            case "vlanID":
                message = message.replace(/:attribute/g, this.ucfirst(displayName)).
                    replace(/and :other/g, "").
                    replace(/:value/g, Array.isArray(VLANIDS) ? VLANIDS.join(" (or) ") : "");
                break;
            default:
                message = message.replace(/:attribute/g, this.ucfirst(displayName));
                break;
            }
            this.errors[eleName] = message;
        }

        if (message){
            switch (displayName){
            case "userpassword":
                message=message.replace(/Userpassword/g, this.ucfirst(displayName.substring(4)));
                break;
            default:
                message = message.replace(/:attribute/g, this.ucfirst(displayName));
                break;
            }
            this.errors[eleName] = message;
        }
    },
    getPromise: function(url) {
        var promise = false;

        if (url){
            switch (this.through){
            case "jQuery":
                promise = $.ajax({url: url});
                break;
            default:
                promise = this.angularPromise ? this.angularPromise.get(url) : false;
                break;
            }
        }

        return promise;
    },
    promiseFailHandler: function(response, element) {
        var eleName = element.getAttribute("name");
        this.asyncErrors[eleName] = this.getErrorMessageByRule("unique").replace(/:attribute/g, this.ucfirst(eleName));
        this.fillElementErrorMessageUsingJquery(element, this.asyncErrors);
    },
    promiseSuccessHandler: function(response, element) {
        var eleName = element.getAttribute("name");

        if (this.asyncErrors.hasOwnProperty(eleName)){
            delete this.asyncErrors[eleName];
        }
    },
    validateRequired: function(element) {
        if (element.getAttribute("type") == "checkbox" && element.hasAttribute("data-checked")) {
            return element.checked;
        }
        return (element.value && element.value.trim().length > 0);

    },
    validateIpaddress: function(element) {
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return (element.value && element.value.match(ipformat));
    },
    validateIpstartrange: function(element) {
      var valueData = IpSubnetCalculator.toDecimal(element.value);
        var subNet = (element.hasAttribute("data-network-address") && element.getAttribute("data-network-address")) ? element.getAttribute("data-network-address").split("/") : '';
        if (subNet !== '' && subNet[1] < 33) {
            var res = IpSubnetCalculator.calculateSubnetMask(subNet[0],subNet[1]);
            return (res !== undefined && valueData >= res.ipLow);
        }
        return false;
    },
    validateIpendrange: function(element) {
      var valueData = IpSubnetCalculator.toDecimal(element.value);
        var subNet = (element.hasAttribute("data-network-address") && element.getAttribute("data-network-address")) ? element.getAttribute("data-network-address").split("/") : '';
        if (subNet !== '' && subNet[1] < 33 && element.value.split(".")[3] < 255) {
            var res = IpSubnetCalculator.calculateSubnetMask(subNet[0],subNet[1]);
            return (res !== undefined && valueData <= res.ipHigh);
        }
        return false;
    },
    validateIpabove20: function(element) {
        var value = element.value.split(".");
        var subNet = (element.hasAttribute("data-network-address") && element.getAttribute("data-network-address")) ? element.getAttribute("data-network-address").split("/") : '';
        var subnetArray = subNet[0].split(".");
        this.params['ipabove20'] = subnetArray[0] + "." + subnetArray[1] + "." + subnetArray[2]+".20";
        return !(subnetArray[0] === value[0] && subnetArray[1] === value[1] && subnetArray[2] === value[2] && value[3] < 21);
    },
    validateWithinrange: function (element) {
        var valueData = IpSubnetCalculator.toDecimal(element.value);
        var startIpAddress = (element.hasAttribute("data-start-ip-address") && element.getAttribute("data-start-ip-address") && IpSubnetCalculator.isIp(element.getAttribute("data-start-ip-address"))) ? IpSubnetCalculator.toDecimal(element.getAttribute("data-start-ip-address")) : "";
        return (valueData >= startIpAddress);
    },
    validateWithiniprange: function (element) {
        var startRange = (element.hasAttribute("data-intranet-startip") && element.getAttribute("data-intranet-startip") && IpSubnetCalculator.isIp(element.getAttribute("data-intranet-startip"))) ? IpSubnetCalculator.toDecimal(element.getAttribute("data-intranet-startip")) : '';
        var endRange = (element.hasAttribute("data-intranet-endip") && element.getAttribute("data-intranet-endip") && IpSubnetCalculator.isIp(element.getAttribute("data-intranet-endip"))) ? IpSubnetCalculator.toDecimal(element.getAttribute("data-intranet-endip")) : '';
        var compareValue = IpSubnetCalculator.toDecimal(element.value);

        return (startRange <= compareValue && endRange >= compareValue);
    },

    validateGreaterThan : function(element) {
        var startPort = (element.hasAttribute("data-start-port") && element.getAttribute("data-start-port")) ? element.getAttribute("data-start-port") : '';

        return (parseInt(element.value,10) > parseInt(startPort,10));
    },
    
    validateIporsubnetaddress: function(element) {
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        var subnet = /^((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}(((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}|\/((0|1|2|3(?=0|1|2))\d|\d))\b$/;
        return (element.value && (element.value.match(ipformat) || element.value.match(subnet)));
    },
    validatePort: function(element) {
        var ipformat = /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3})([,-](6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3})){1,20}$/;
        return (element.value && (((typeof element.value === "string") && element.value === "ANY") || element.value.match(ipformat) || /^[0-9]+$/.test(element.value)));
    },
    validateMacaddress: function(element) {
        var macformat =/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
        return (element.value && element.value.match(macformat));
    },
    validateDscpValue: function(value) {
      var valueArray = value[0].value.concat(value[1].value).concat(value[2].value);
      var valueData = valueArray.join();
      if(valueData !== null) {
        // var res = /^[0-9]{1,2}( *, *[0-9]{1,2})*$/.test(valueData)
        var res = /^[A-Z0-9,]+$/.test(valueData);
        let duplicateValues = [];
        if (res) {
            for (let i = 0; i < valueArray.length;i++) {
                if (/^\d+$/.test(valueArray[i]) && !(parseInt(valueArray[i], 10) >= 0 && parseInt(valueArray[i], 10) <= 63)) {
                    return true;
                } else if (!(/^\d+$/.test(valueArray[i])) && DSCPVALUES.indexOf(valueArray[i]) === -1) {
                    return true;
                } else if (valueArray.indexOf(String(valueArray[i]),i+1) !== -1) {
                    duplicateValues.push(valueArray[i]);
                }
            }
            return (duplicateValues.length === 0) ? !res : duplicateValues;
        }else {
            return !res;
        }
      }
      return true;
    },
    validateLen: function(element) {
        var length =element.value.length;
        if (length >= 50){
            return (element.value && element.value.match(length));
        }
        return true;
    },
    validateIpaddressorany: function(element) {
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return (element.value && (((typeof element.value === "string") && element.value === "ANY") || element.value.match(ipformat)));
    },
    validateVlanID : function(element) {
        var validVlanIDs = VLANIDS;
        return (validVlanIDs.indexOf(parseInt(element.value,10)) !== -1);
    },
    validateIprange: function(element) {
        var ipformat = /^((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}(-((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}|\/((0|1|2|3(?=1|2))\d|\d))\b$/;
        return (element.value && element.value.match(ipformat));
    },
    validateIpsubnet: function(element) {
        var ipformat = /^((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}(((\b|\.)(0|1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}|\/((0|1|2|3(?=0|1|2))\d|\d))\b$/;
        return (element.value && element.value.match(ipformat));
    },
    validateNumericorany: function(element) {
        return (element.value && element.value.trim()) ? (((typeof element.value === "string") && element.value === "ANY") || /^-?\d*(\.\d+)?$/.test(element.value)) : true ;
    },
    validateAlpha: function(element) {
        return /^[A-Za-z ]+$/.test(element.value);
    },
    validateNospace: function (element) {
        return /^\S*$/.test(element.value);
    },
    validateAlphanumeric: function(element) {
        return /^[a-zA-Z0-9-_ ]+$/.test(element.value);
    },
    validateAlphanumericwithhyphens: function (element) {
        return /^[a-zA-Z0-9-]+$/.test(element.value);
    },
    validateEmail: function(element) {
        return (element.value && element.value.trim()) ? /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(element.value) : true ;
    },
    validateUrl: function(element) {
        return (element.value && element.value.trim()) ? /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(element.value) : true ;
    },
    validateUrlValue : function (value) {
        return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(value);
    },
    validateNumeric: function(element) {
        return (element.value && element.value.trim()) ? /^\d+$/.test(element.value) : true ;
    },
    validateMax: function(element) {
        if (this.params.hasOwnProperty("max")){

            return (element.getAttribute("type") === "number") ? Number(element.value) <= this.params.max : element.value.trim().length <= this.params.max;
        }

        return true;
    },
    validateMin: function(element) {
        if (this.params.hasOwnProperty("min")){
            return (element.getAttribute("type") === "number") ? Number(element.value) >= this.params.min : element.value.trim().length >= this.params.min;
        }
        return true;
    },
    validateSame: function(element) {
        if (
      this.params.hasOwnProperty("same")
      && typeof this.params.same === "object"
      && this.params.same.hasOwnProperty("inputName")
    ){
            var dependendElement = this.getElement(this.params.same.inputName);
            if (element.value!==dependendElement.value){
                return false;
            }
        }
        return true;
    },
    validatePassword: function(element) {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/.test(element.value);
    },
    validateDifferent: function(element) {
        var dependendElement = this.getElement(this.params.different.inputName);
        if (element.value===dependendElement.value){
            return false;
        }
        return true;
    },
    validateRegex: function(element) {
        let str=element.value;
        if (str.indexOf(" ") !== -1){
            return false;
        } else if (str === ''){
            return false;
        }else if (/^[a-zA-Z0-9]*$/.test(str) === false){
            return false;
        }
        return true;
    },
    validateRequiredIf: function(element) {
        if (
      this.params.hasOwnProperty("required_if")
      && typeof this.params.required_if === "object"
      && this.params.required_if.hasOwnProperty("inputName")
      && this.params.required_if.hasOwnProperty("inputValue")
    ){
            var dependendElement = this.getElement(this.params.required_if.inputName, element.dataset.hasOwnProperty("index") ? element.dataset.index : false);
            if (
        dependendElement
        && dependendElement.value === this.params.required_if.inputValue
        && !this.validateRequired(element)
      ){
                if (dependendElement.getAttribute("type") === "SELECT"){

              /**
               * Set the selected value label so we can use it for error message
               */
                    this.params.required_if.label = dependendElement.options[dependendElement.selectedIndex].innerHTML;
                } else {
                    this.params.required_if.label = "";
                }
                return false;
            }
        }
        return true;
    },
    validateRequiredUnless: function(element) {
        if (
      this.params.hasOwnProperty("required_unless")
      && typeof this.params.required_unless === "object"
      && this.params.required_unless.hasOwnProperty("inputName")
      && this.params.required_unless.hasOwnProperty("inputValue")
    ){
            var dependendElement = this.getElement(this.params.required_unless.inputName);
            var dependendValue = dependendElement && dependendElement.value ? parseInt(dependendElement.value, 10) : false;

            if (
        typeof dependendValue === "number"
        && parseInt(dependendElement.value, 10) !== parseInt(this.params.required_unless.inputValue, 10)
        && !this.validateRequired(element)
      ){

        /**
         * Set the selected value label so we can use it for error message
         */
                this.params.required_unless.label = dependendElement.options[dependendElement.selectedIndex].innerHTML;
                return false;
            }
        }

        return true;
    },
    validateRequiredWith: function(element) {
        if (
      this.params.hasOwnProperty("required_with")
      && typeof this.params.required_with === "object"
    ){
            var dependendElement = this.getElement(this.params.required_with.inputName, (element.dataset !== undefined && element.dataset.hasOwnProperty("index")) ? element.dataset.index : element.hasAttribute("index") ? element.getAttribute("index") : false);

            if (
          dependendElement
          && typeof dependendElement === "object"
          && dependendElement.value.trim().length > 0
          && !this.validateRequired(element)
      ){
                return false;
            }
        }

        return true;
    },

  /**
   * Validate user entry is date
   * @see http://jsfiddle.net/EywSP/849/
   */
    validateDate: function(element){
        return (element.value.trim().length > 0) ? this.isDate(element.value.trim()) : true;
    },
    isValidateDateofBirth: function(dob){
        var isValideDate = true;
        if (this.isDate(dob)){
            var today = new Date();
            var birthDate = new Date(dob);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age <= 18) {
                isValideDate = false;
            } else {
                isValideDate = true;
            }
        } else {
            isValideDate = false;
        }

        return isValideDate;
    },
    isDate: function(date){
        var isValideDate = true;
        if (date){
            var dateArray = date.match(/^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/);

            if (typeof dateArray === "object" && dateArray !== null && dateArray.length >= 6){
                var dateMonth = dateArray[3];
                var dateDay= dateArray[5];
                var dateYear = dateArray[1];

                if (dateMonth < 1 || dateMonth > 12 || dateDay < 1 || dateDay> 31){
                    isValideDate = false;
                } else if ((dateMonth===4 || dateMonth===6 || dateMonth===9 || dateMonth===11) && dateDay===31){
                    isValideDate = false;
                } else if (dateMonth === 2 && (dateDay> 29 || (dateDay ===29 && !(dateYear % 4 === 0 && (dateYear % 100 !== 0 || dateYear % 400 === 0))))) {
                    isValideDate = false;
                }
            } else {
                isValideDate = false;
            }
        }

        return isValideDate;
    },
    validateUnique: function(element) {
        if (element.hasAttribute("data-unique")){
            var xhr = new XMLHttpRequest();
            var eleName = element.getAttribute("name");

            xhr.open("GET", element.getAttribute("data-unique")+"?q="+element.value);

            xhr.addEventListener("load", function() {
                if (this.status !== 200 && validator.scope && validator.scope.hasOwnProperty("errors")){
                    validator.scope.errors[eleName] = {
                        has: true,
                        message: validator.getErrorMessageByRule("unique").replace(/:attribute/g, validator.ucfirst(eleName))
                    };


                } else {
                    delete validator.scope.errors[eleName];
                }

                if (!validator.scope.$phase){
                    validator.scope.$apply();
                }
            }, false);

            xhr.send();
        }

        return true;
    },
    validateMultiCheckbox: function(checkboxElements) {
        var lastCheckboxElement = checkboxElements[checkboxElements.length - 1];
        var eleName = lastCheckboxElement.getAttribute("data-multicheck-validate");
        var dependendParams = lastCheckboxElement.hasAttribute("data-dependend-checkbox") ? lastCheckboxElement.getAttribute("data-dependend-checkbox") : false;

        if (dependendParams){
            var params = dependendParams.split(",");
            if (params.length > 1){
                var inputName = params[0], inputValue = params[1];
            }
            var dependendElement = this.getElement(inputName);

            if (typeof dependendElement === "object"){
                var dependendValue = dependendElement.value ? parseInt(dependendElement.value, 10) : false;

                if (
                typeof dependendValue === "number"
                && parseInt(dependendElement.value, 10) !== parseInt(inputValue, 10)
            ){
                    return true;
                }
            }
        }

        this.cleanMultiCheckElementErrorMessage(lastCheckboxElement);

        var isChecked = false;

        for (let iter = 0; iter < checkboxElements.length; iter++){
            if (checkboxElements[iter].checked === true){
                isChecked = true;
                break;
            }
        }
        if (!isChecked){
            eleName = lastCheckboxElement.getAttribute("data-multicheck-validate");

            this.errors[eleName] = this.getErrorMessageByRule("multlicheck").replace(/:attribute/g, this.ucfirst(eleName));

            this.fillMultiCheckErrorMessageUsingJquery(lastCheckboxElement, false, eleName);
        }
    }
};

validator.loadLocale();

export default validator;
