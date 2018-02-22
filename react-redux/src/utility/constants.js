export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const ENTERPRISE = "enterpriseadmin";
export const ADMIN = "enterpriseuser";
export const SUPERUSER = "superuser";
export const OPERATORS = "operator";
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const THREE = 3;
export const THOUSAND = 1000;
export const SIXTYK = 60000;
export const PROCESS_ENV = process.env;
export const UNCLIAMED = 'unclaimed';
export const NOTACTIVATED = "not_activated";
export const INSERVICE = "in_service";
export const OUTOFSERVICE = "out_of_service";
export const DATE_FORMAT = "DD-MMM-YYYY";
export const TIMESSTAMP_FORMAT = "h:mm A";
export const DATE_FORMAT_WITH_TIMESSTAMP = "DD-MMM-YYYY HH:mm";
export const DATE_FORMAT_FOR_LOAD_PREVIOUS = "MMM D, YYYY, h:mmA";
export const DATE_FORMAT_FOR_LOAD_PREVIOUS_PREVIEW = "MMM D, YYYY, h:mm:ssA Z";

export const routes = {
    enterpriseadmin: ["configuration", "monitoring", "inventory", "user", "notifications"],
    enterpriseuser: ["configuration", "monitoring", "notifications"],
    superuser: ["organizations", "operators"],
    operator: ["organizations", "operators"]
};

export const DSCPVALUES = ["CS0","CS1","AF11","AF12","AF13","CS2","AF21","AF22","AF23",
                            "CS3","AF31","AF32","AF33","CS4","AF41","AF42","AF43",
                            "CS5","EF","CS6","CS7"];

export const VLANIDS = [1,2,147,483,647];

export const ROLES = ["enterpriseadmin", "enterpriseuser", "superuser", "operator"];
