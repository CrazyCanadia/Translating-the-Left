let counter = 0

//Communicating with content script
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "knockknock")
    // console.log("The port has been opened.")
    port.onMessage.addListener(function(msg) {
      // console.log("The msg.site is: " + msg.site)
      if (msg.site){
        chrome.storage.local.get("count", function(response) {
          // console.log(response.count)
          counter = response.count
          if(counter!==0){
            chrome.browserAction.setBadgeText({text: counter.toString()})
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'})
          }else{
            chrome.browserAction.setBadgeText({text: ""})
          }
      })
        port.postMessage({done: "Finished!"})
      }
      // console.log("The port is closed.")  
    }) 
})