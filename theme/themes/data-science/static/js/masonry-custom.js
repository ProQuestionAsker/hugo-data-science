var macy = Macy({
    container: '.portfolio__grid',
    trueOrder: true,
    waitForImages: false,
    margin: {
      x: 24,
      y: 0
    },
    columns: 3,
    breakAt: {
        1200: 3,
        940: 3,
        700: 2,
        400: 1
    }
});

macy.runOnImageLoad(function () { console.log("loaded") }, true)

function hide(selection){
  console.log("hide")
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.add("hidden")
  }
}

function show(selection){
  console.log("show")
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.remove("hidden")
  }
}

function rearrange(){
  console.log("rearrange")
  macy.recalculate(true)
}

const selectCat = document.getElementsByClassName("category-dropdown")[0]

function handleCatChange(){
  const val = selectCat.value
  const singular = val.slice(0, -1)
  console.log({val})
  if (val == "All"){
    let selected = document.getElementsByClassName('item')
    show(selected)
    rearrange()
  }

  else if (val != "All"){
    const unselected = document.querySelectorAll(`.item:not(.${singular})`)
    hide(unselected)

    const selected = document.getElementsByClassName(`item ${singular}`)
    show(selected)

    rearrange()
  }
}

selectCat.addEventListener("change", handleCatChange)

// macy.runOnImageLoad(function (d) {
//   const image = d.data.img
//   if (image){
//     const parent = image.parentNode
//     parent.classed('is-loaded', true)
//   }
// }, true);
