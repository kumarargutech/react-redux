class Service {
  constructor(){
  }
      //days to year
      years(data){
        return ((data/365 === +data/365 && data/365 !== (data/365|0)))?(data/365).toFixed(1):(data/365);
      }

      expirationDate = (date)=>{
      let val = new Date(date);
      let result =((val.getMonth())+1)+'-'+val.getDate()+'-'+ val.getFullYear() ;
      return result;
    }

    //find next 90 days date
    expiringSoon(date){
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var firstDate = new Date();
      var secondDate = new Date(date);
      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
      if(secondDate>firstDate && diffDays<process.env.REACT_APP_EXPIRY_DAYS_DIFF_COUNT){
      return true;
      }else {return false;}
    }
}
export default new Service();
