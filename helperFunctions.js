function notify(noteType){
  /* Here we have the notice types for the function notify
    welcome
    instructions
    add
    remove
    import
    export
    wipe
    clear
  */

   let noticeboard = document.getElementById("comms")

   function flashMsg(msg) {
    $(`#${msg}`).fadeIn()
        setTimeout(function () {
          $(`#${msg}`).fadeOut()
          setTimeout(function () {
            notify("clear")
          }, 1000);
        }, 2000);
   }

    switch (noteType){

      /* --- Notices of User Events --- */
      case "welcome":
        noticeboard.innerHTML = `<div id="welcome" class="bg-warning overlay card-body notify_text text-center">Welcome. Click the title for help.</div>`
        console.log("The noticeboard has been cleared!")
        flashMsg("welcome")
      break;
      case "instructions":
        noticeboard.innerHTML = `<div id="instructions" class="bg-info overlay card-body notify_text text-center">Remember: Ctrl+Shft+C for cleaning mode.</div>`
        console.log("Reminded Instructions.")
        flashMsg("instructions")
      break;


      /* --- Notices of User Events --- */
      case "add":
        noticeboard.innerHTML = `<div id="addMessage" class="bg-warning overlay card-body notify_text text-center">Your flag has been added.</div>`
        console.log("The flag has been added!")
        flashMsg("addMessage")
      break;
      case "remove":
        noticeboard.innerHTML = `<div id="removeMessage" class="bg-warning overlay card-body notify_text text-center">Your flag has been removed.</div>`
        console.log("The flag has been removed!")
        flashMsg("removeMessage")
      break;
      case "import":
        noticeboard.innerHTML = `<div id="importMessage" class="bg-info overlay card-body notify_text text-center">Importing Successful.</div>`
        console.log("The list has been imported!")
        flashMsg("importMessage")
      break;
      case "export":
        noticeboard.innerHTML = `<div id="exportMessage" class="bg-info overlay card-body notify_text text-center">Exporting Successful.</div>`
        console.log("The list has been exported!")
        flashMsg("exportMessage")
      break;
      case "wipe":
        noticeboard.innerHTML = `<div id="wipeMessage" class="bg-danger overlay card-body notify_text text-center">The Blacklist has been wiped empty.</div>`
        console.log("The list has been wiped!")
        flashMsg("wipeMessage")
      break;
      case "clear":
        noticeboard.innerHTML = ""
        console.log("The noticeboard has been cleared!")
      break;
  }

}