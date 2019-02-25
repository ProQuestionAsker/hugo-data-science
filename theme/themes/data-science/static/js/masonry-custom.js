let filterDrawerOpen = false;
let filterButton = document.getElementsByClassName('filters-click')[0]
let filterDrawer = document.getElementsByClassName('filters-drawer')[0]
let chevron = document.getElementById('tag-chevron')
let selectedTags = document.getElementsByClassName('filters-selected')
let allTags = document.getElementsByClassName('drawer-tag')

let tags = {}

// setup filter button click
filterButton.addEventListener('click', handleFilterDrawer)

Array.from(allTags).forEach(function(element) {
  element.addEventListener('click', handleAddTag);
});

Array.from(selectedTags).forEach(function(element) {
  element.addEventListener('click', handleAddTag);
});




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
let singular = "All Categories"

function handleCatChange(){
  const val = selectCat.value
  singular = val.slice(0, -1)
  console.log(tags)
  let anyTags = Object.values(tags).filter(d => d === true)

  if (anyTags.length === 0){
    if (val == "All Categories"){
      let selected = document.getElementsByClassName('item')
      show(selected)
      rearrange()
    }

    else if (val != "All Categories"){
      const unselected = document.querySelectorAll(`.item:not(.${singular})`)
      hide(unselected)

      const selected = document.getElementsByClassName(`item ${singular}`)
      show(selected)
      rearrange()
    }
  }

  else if (anyTags.length > 0){
    if (val == "All Categories"){
      let selected = document.getElementsByClassName('.tagFoun')
      show(selected)
      rearrange()
    }

    else if (val != "All Categories"){
      const unselected = document.querySelectorAll(`.item:not(.${singular})`)
      hide(unselected)

      const selected = document.getElementsByClassName(`item ${singular} tagFound`)
      show(selected)
      rearrange()
    }
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
      let postTags = getTags(post)
      const success = search.every((val) => postTags.includes(val))
      if (success === true) post.classList.add('tagFound')
    });
}

// if (bodyVals.length){
// const success = bodyVals.every((val) => d.bodyParts.includes(val))
// const bp = d.bodyParts
// return success}
// else return false
// }

function finalizeFilters(){
  const unselected = document.querySelectorAll(`.item:not(.tagFound)`)
  hide(unselected)

  const selected = document.getElementsByClassName(`item tagFound`)
  show(selected)

  console.log({selected, unselected})
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


function handleFilterDrawer(){

  filterDrawerOpen = !filterDrawerOpen

  if(filterDrawerOpen === true) {
    filterDrawer.classList.add('visible')
    chevron.classList.remove('fa-chevron-down')
    chevron.classList.add('fa-chevron-up')
  }
  if(filterDrawerOpen === false) {
    filterDrawer.classList.remove('visible')
    chevron.classList.remove('fa-chevron-up')
    chevron.classList.add('fa-chevron-down')
  }
}

function handleAddTag(){
  const $btn = this
  const sel = this.innerText.trim();
  const searchVal = sel === 'R' ? 'R' : sel.toLowerCase()
  let active = null

  // if the button was in the drawer
  if ($btn.classList.contains('drawer-tag')){
    active = $btn.classList.contains('is-active')
    const icon = this.getElementsByTagName('i')[0]

    if (active === false){
      icon.classList.remove('fa-plus')
      icon.classList.add('fa-times')
      $btn.classList.add('is-active')
    } else if (active === true){
      icon.classList.remove('fa-times')
      icon.classList.add('fa-plus')
      $btn.classList.remove('is-active')
    }
  } else if ($btn.classList.contains('filters-selected')){
    //const val = this.innerText.trim()
        console.log({sel})
    const drawerBtn = document.querySelector(`[data-drawertag="${sel}"]`)
    drawerBtn.classList.remove('is-active')
    const icon = drawerBtn.getElementsByTagName('i')[0]
    icon.classList.remove('fa-times')
    icon.classList.add('fa-plus')
    active = true
  }

  tags[searchVal] = !active

  let tagToUnhide = document.querySelector(`[data-tag="${sel}"]`)
  tagToUnhide.hidden = !tagToUnhide.hidden
  filterByTag()
}

function filterByTag(){
  const tagVals = Object.keys(tags)
    .filter(d => tags[d])
    .map(d => d)

  let selected = null
  if (singular == 'Post') {
    selected = document.querySelectorAll('.post')
  } else if (singular == 'Project'){
    selected = document.querySelectorAll('.project')
  } else selected = document.querySelectorAll('.item')
  searchEachPost(selected, tagVals)
  finalizeFilters()
}

function handleRemoveTag(){

}
