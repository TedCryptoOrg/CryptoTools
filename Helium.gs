/**
 * Given hotspotname grab the hotspot address which can be used to identify
 * the hotspot in the API
 */
async function GETHOTSPOTADDRESS(hotspotName) {
  var hotspotName = hotspotName.toLowerCase().split(' ').join('-');
  console.log(hotspotName);
  var apiUrl = 'https://api.helium.io/v1/hotspots/name/' + hotspotName;
  var res = await UrlFetchApp.fetch(apiUrl) ;   
  var content = res.getContentText();
  var obj= JSON.parse(content);
  
  console.log(obj)

  return obj.data[0].address;
}

/**
 * Given the hotspot address and a min time in a Google Date Time object
 * (and optionally a max time) it will return the rewards based on those restrictions
 * 
 * e.g.:
 *   Return the last 31 days rewards
 *   =GETHOTSPOTREWARDS(GETHOTSPOTADDRESS("your hotspot name", TODAY() - 31))
 *   Return november rewards
 *   =GETHOTSPOTREWARDS(GETHOTSPOTADDRESS("your hotspot name", "2021/11/01", "2021/11/30"))
 */
async function GETHOTSPOTREWARDS(address, min_time, max_time = null) {
  min_time_formatted = Utilities.formatDate(min_time, "GMT+1", "YYYY-MM-dd")

  console.log(min_time_formatted);
  var apiUrl = 'https://api.helium.io/v1/hotspots/'+address+'/rewards/sum?min_time='+min_time_formatted;
  if (max_time) {
    max_time_formatted = Utilities.formatDate(max_time, "GMT+1", "YYYY-MM-dd")

    apiUrl += '&max_time='+max_time_formatted;
  }

  console.log(apiUrl);
  var res = await UrlFetchApp.fetch(apiUrl) ;   
  var content = res.getContentText();
  var obj= JSON.parse(content);

  console.log(obj, 'total', obj.data.total);

  return obj.data.total;
}
