window.onload = function() {
    
    //Get DOM elements
    const mainHeader_div = document.getElementById('mainHeader')
    const display_div = document.getElementById('display')
    const newTerm_input = document.getElementById('newTerm')
    const wipe_btn = document.getElementById('wipe')
    const import_btn = document.getElementById('import')
    const export_btn = document.getElementById('export')
    const removeTerm_btn = document.getElementById('removeTerm')
    const addTerm_btn = document.getElementById('addTerm')

    let blacklistWords = []
    let foundMatch = false
    let counter
    let currentSite
    let response

    //ADDING a new flag to MyBlacklist
    function addTerm(){
        foundMatch = true
        //Take the inputs
        let newTerm = newTerm_input.value
        //Push to array
        response.blacklist.push(newTerm)
        //Update Display
        updateDisplay()
        //**Save**
        save()
        newTerm_input.value = ""
        if(!foundMatch){
            console.log("We did not find a match!")
        }
    }

    //REMOVING a flag from MyBlacklist
    function removeTerm(){
        // console.log("We are removing a term...")
        //Selecting the terms from the multi-select list.
        const select = document.querySelectorAll('#display option:checked');
        const selectedValues = Array.from(select).map(el => el.value);
        //storing the values in selectedValues []
        //loop through the Blacklist and remove the matches
        for(let i = 0; i < response.blacklist.length; i++){
            let temp = `${response.blacklist[i]}`

            for(let k = 0; k < selectedValues.length; k++){
                if(temp==selectedValues[k]){
                    response.blacklist.splice(i,1)
                }
            }
        }
        updateDisplay()
        save()

    }

    //UPDATING DISPLAY - part 1
    function updateDisplay() {
        //UPDATING DISPLAY - part 2
        function displayFlags(term){
            const entry = `<option>${term}</option>`
            display_div.innerHTML += entry
        }
        foundMatch = false
        display_div.innerHTML = ""
        mainHeader_div.innerHTML = `${currentSite} <span title="Items removed" data-bs-toggle="popover" data-bs-trigger="hover" class="badge rounded-pill mx-2 bg-danger">${counter}</span>`
        for(let i = 0; i < response.blacklist.length; i++){
            displayFlags(response.blacklist[i])
            foundMatch = true
            console.log("this should not execute.")
        }
        if(!foundMatch){
            foundMatch = true
            let none = "None Yet"
            displayFlags(none)
        }
    }

    //SAVING
    function save() {
        //We can try our various options... starting with Secret Option 3:
        chrome.storage.local.set({"MyWords": response}, function(){
            console.log("We have saved.")
        })
    }

    function wipe(){
        response.blacklist.splice(0, response.blacklist.length)
        chrome.storage.local.set({"MyWords": response})
        chrome.storage.local.get("MyWords", function(response){
            response = response.MyWords
        })
        updateDisplay()
    }

    //IMPORTING
    async function importFile(){
        //Import
        const [fileHandle] = await showOpenFilePicker()
        const file = await fileHandle.getFile()
        const contents = await file.text()
        //Loading
        if(typeof contents === "string"){
            let temp = JSON.parse(contents)
            console.log(temp)
            response = temp
        }else if(typeof contents === "object"){
            //DO NOTHING
            response = contents
        }
        notify("import")
        save()
        updateDisplay()
    }

    //EXPORTING
    async function exportFile() {
        const fileHandle = await window.showSaveFilePicker()
        const contents = JSON.stringify(response)
        
        //Starting writing contents...
        async function writeFile(fileHandle, contents) {
            // Create a FileSystemWritableFileStream to write to.
            const writable = await fileHandle.createWritable();
            // Write the contents of the file to the stream.
            await writable.write(contents);
            // Close the file and write the contents to disk.
            await writable.close();                
        }
        
        notify("export")
        writeFile(fileHandle, contents)
    }

    //Add Button
    addTerm_btn.onclick = function(){
        addTerm()
        notify("add")
    }

    //Remove Button
    removeTerm_btn.onclick = function(){
        removeTerm()
        notify("remove")
    }    

    import_btn.onclick = function(){
        importFile()
    }

    export_btn.onclick = function(){
        exportFile()
    }

    wipe_btn.onclick = function(){
        if(confirm("Are you sure you want to PEREMANENTLY delete your word list?")){
            // console.log("Wiped!")
            wipe()
            notify("wipe")
        }else{
            // console.log("You have decided not to wipe the memory.")
        }
    }

    newTerm_input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault()
            addTerm()
            notify("add")
        }
      })

//LOADING BLACKLIST FROM STORAGE...
    function loadTheList() {
        //verifying it is an object
        
        chrome.storage.local.get("site", function(response) {
            currentSite = response.site
        })
        chrome.storage.local.get("count", function(response) {
            // console.log(response.count)
            counter = response.count
        })

        chrome.storage.local.get("MyWords", function(data) {
            if(typeof response === "string"){
                response = JSON.parse(data)
                console.log(response)
            }else if(typeof data === "object"){
                //DO NOTHING
                console.log(data.MyWords)
            }
            response = data.MyWords

            console.log("The counter is currently: ")
            console.log(counter)
            console.log("response is currently: ")
            console.log(response)


            try {
                // if(response.description===undefined){
                if(!response.description){
                    //The object we have in response is basically garbage.
                    console.log("It is undefined so we need to define it...")
                } else{ //I should check to verify what 'description' is valued as.
                    for(let i=0; i<response.blacklist.length; i++){
                        blacklistWords.push(response.blacklist[i])
                            }     
                }

            } catch (error) {
            console.error(error)                    
            }

            updateDisplay()
        })
    }
    
    notify("welcome")
    $('#myModal').on('hidden.bs.modal', function (e) {
        // do something...
        notify("instructions")
      })
    loadTheList()

}