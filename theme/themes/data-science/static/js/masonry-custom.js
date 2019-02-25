var macy = Macy({
    container: '.portfolio__grid',
    trueOrder: true,
    waitForImages: false,
    margin: {
      x: 25,
      y: 25
    },
    columns: 3,
    breakAt: {
        1200: 3,
        940: 3,
        700: 2,
        400: 1
    }
});

//macy.runOnImageLoad(function () { console.log("loaded") }, true)

function hide(selection){
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.add("hidden")
  }
}

function show(selection){

  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.remove("hidden")
  }
}

function rearrange(){
  macy.recalculate(true)
}

const selectCat = document.getElementsByClassName("category-dropdown")[0]

// dropdown selections
let singular = "All"

function handleCatChange(){
  const val = selectCat.value
  singular = val.slice(0, -1)

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

  // empty tag filter
  const val = selectTag.value = ""
  }
}

selectCat.addEventListener("change", handleCatChange)



const selectTag = document.getElementById("tag-search")

function getTags(elem) {
  return elem.getAttribute('data-tags')
            .split(", ")
            .filter(function(el){
              return el.length > 0
            });
}

let tagMatches = []

function searchEachPost(allPosts, search){
  [...allPosts].forEach((post) => {
      post.classList.remove('tagFound')
      let tags = getTags(post)
      if (tags.includes(search)) post.classList.add('tagFound')
    });
}

function finalizeFilters(){
  const unselected = document.querySelectorAll(`.item:not(.tagFound)`)
  hide(unselected)

  const selected = document.getElementsByClassName(`item tagFound`)
  show(selected)

  rearrange()
}

function filterTags(){
  const val = selectTag.value
  const options = document.getElementById('tags').childNodes
  console.log({val})

  if (val === ""){
    const all = document.querySelectorAll('.item')

    const spread = [...all]
    console.log({spread})
    spread.forEach((post) => {
        post.classList.remove('tagFound')
      });
    handleCatChange()
  }

  else {
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === val) {
          const thisVal = options[i].value
          const searchVal = thisVal === 'R' ? 'R' : thisVal.toLowerCase()
          const val = selectCat.value

          let selected = null
          if (singular == 'Post') {
            selected = document.querySelectorAll('.post')
          } else if (singular == 'Project'){
            selected = document.querySelectorAll('.project')
          } else selected = document.querySelectorAll('.item')
          console.log({singular, selected})
          searchEachPost(selected, searchVal)
          finalizeFilters()

          break;
        }
      }
  }

}
console.log({selectTag})

// macy.runOnImageLoad(function (d) {
//   const image = d.data.img
//   if (image){
//     const parent = image.parentNode
//     parent.classed('is-loaded', true)
//   }
// }, true);
