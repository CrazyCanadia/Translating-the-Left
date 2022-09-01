window.onload = function() {
    let host = window.location.host
    let bt = '("Bad Thing")'
    let blacklistWords = []
    let pTags = []
    let h1Tags = []
    // let foundMatch = false
    let counter = 0

    function TranslateLeft() {
      pTags = document.querySelectorAll('p')
      h1Tags = document.querySelectorAll('h1')

      h1Tags.forEach(tag => {
        for(i=0; i<blacklistWords.length; i++) {
          if(tag.innerText.includes(blacklistWords[i])){
            let newTag = tag.innerText.replaceAll(blacklistWords[i], bt)
            tag.innerText = newTag 
            counter++
          }
        }
      })
      pTags.forEach(tag => {
        for(i=0; i<blacklistWords.length; i++) {
          if(tag.innerText.includes(blacklistWords[i])){
            let newTag = tag.innerText.replaceAll(blacklistWords[i], bt)
            tag.innerText = newTag
            counter++
          }
        }
      })
      console.log(counter + " items were 'translated'.") 

    }


    // chrome.storage.local.clear()

    //Cleaning the DOM objects from the page.
    function cleanUp() {            
        blacklistWords.forEach(term => {
            const elementList = document.querySelectorAll(`p`)
            // console.log(elementList); // 👉️ div#box1
            // console.log("printed...")
            
            for(elementListElt of elementList) {
                foundMatch = elementListElt.includes(blacklistWords)
                if(result) {

                }
                counter++
                // console.log(elementListElt)
            }  
        })

        console.log("The Translator has edited " + counter + " unwanted items from view. Enjoy! :)")
    }

    //Save the Blacklist to local storage
    function saveBlacklist(package) {
        chrome.storage.local.set({"MyWords": package})
        console.log("My words for translation have been saved as: ")
        console.log(package)
    }

    //Communicating with background script
    function messageBackground(){
        var port = chrome.runtime.connect({name: "knockknock"})
        console.log("Creating port...")
        port.postMessage({site: host})
        // port.postMessage({count: counter})
        port.onMessage.addListener(function(msg) {
        console.log(msg.done)
        })
        //Sent the site: host to the background script
        //Save the counter to the storage...
        chrome.storage.local.set({"count": counter})
        //Save the site too...
        chrome.storage.local.set({"site": host})
    }

    function ScanMode() {
      el = document.querySelectorAll('div')
      for(let i = 0; i < el.length; i++) {
        el[i].addEventListener('mouseover', bordering)
        el[i].addEventListener('mouseout', unbordering)
        el[i].addEventListener('click', click)
      }
    }

    function bordering() {
      this.style.border = "5px solid red"
    }
    function unbordering() {
      this.style.border = ""
    }

    function click() {
      console.log(el)
      for(let i = 0; i < el.length; i++) {
        //DIS-ENGAGE or remove the onmouseover eventListeners... Leaving only the one clicked.
        el[i].removeEventListener('mouseover', bordering)
        el[i].removeEventListener('mouseout', bordering)
        el[i].removeEventListener('click', click)
      }
      //DISPLAY class and id INFO.- This selectable info will be displayed on the overlay
    }

    //Message Reciever
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension")
            if (request.mode === "ScanMode"){
                sendResponse({farewell: "Now initiating ScanMode..."});
                // ScanMode()
            }
            if (request.mode === "Info"){
              sendResponse({farewell: "Now displaying Instructions..."});
              // ScanMode()
          }
        }
    )

    //LOADING BLACKLIST FROM STORAGE...
    //verifying it is an object
    chrome.storage.local.get("MyWords", function(data) {
        if(typeof response === "string"){
            response = JSON.parse(data)
            console.log(response)
        }else if(typeof data === "object"){
            //DO NOTHING
            console.log(data.MyWords)
        }
        response = data.MyWords
        // console.log(response)

        
        
        try {
          // if(response.description===undefined){
          if(!response.description){
              //The object we have in response is basically garbage.
              console.log("It is undefined so we are now defining it...")
              //Create a new structure
              let blStructure = {
                  "description": "This is a blacklist of terms to Translate.",
                  "blacklist": []
                }
                console.log("This should not FIRE!")
                saveBlacklist(blStructure)
              } else{ //I should check to verify what 'description' is valued as.
                //We have retrieved our blacklist and should check for a match with currentSite
                for(let i=0; i<response.blacklist.length; i++){
                  blacklistWords.push(response.blacklist[i])                      
                }
                
              }
              
            } catch (error) {
          console.error(error) 
          //We got a strange error: We will now reset the local storage and initialize TheBlacklist Structure.      
        }

        // saveBlacklist(response)
        console.log("We have finished the loading process.")
        console.log(blacklistWords)
        TranslateLeft()
        console.log("The counter is currently: ")
        console.log(counter)
        console.log("--------------------------------")
        messageBackground()
    })

    

    var interval = setInterval(function() {
        if(document.readyState === 'complete') {
            clearInterval(interval)
            TranslateLeft()
            console.log("We just translated.")
        }    
    }, 1000)

}