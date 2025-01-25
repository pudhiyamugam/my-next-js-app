
let active = -1 //for arrow key navigation in search results



export function keyboardselect(e){  //function for arrow key navigation in search results
    if (e.keyCode == 40) {
    e.preventDefault()
      if (active < this.querySelector("#search-results").children.length-1) {
        active++
        this.querySelector("#search-results").children[active].focus()
      }
    }else if(e.keyCode == 38){
    e.preventDefault()
      if (active > 0) {
        active--
        this.querySelector("#search-results").children[active].focus()
      }
    }else if(e.keyCode == 13){
    e.preventDefault()
        active=-1
      document.activeElement?.click()
  
    }
  }

