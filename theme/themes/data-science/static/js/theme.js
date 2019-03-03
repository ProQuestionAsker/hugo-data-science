const body = document.getElementsByTagName('body')[0]
const lightDarkToggle = document.getElementsByClassName('theme-toggle')[0]
const icon = lightDarkToggle.getElementsByTagName('i')[0]
const image = document.getElementsByClassName('introImage')[0]
let pageTags = document.getElementsByClassName('post-tag')

// looking for any stored value in session storage of 'theme'
let theme = sessionStorage['theme']

// looking for any tags selected from the non-home-page
let tag = sessionStorage['tag']

//////////////////////////////////////////////////
///////// Light vs. Dark Theme Code //////////////
//////////////////////////////////////////////////

// get current time for user
const currentTime = new Date().getHours()

// if there is already a value stored for theme
if (theme){
  // and the value stored is light, keep it light
  if (theme === 'light') makeLight('newPage')
  // and the value stored is dark, keep it dark
  if (theme === 'dark') makeDark('newPage')
}
if (!theme){
  setTheme()
}

function setTheme(){
  // this is run if there is no stored theme

  // if after 9PM or before 6AM, make dark mode
  if (currentTime < 6 || currentTime >= 21) makeDark('first')
  else makeLight('first')
}

function makeDark(load){
  // set the key in session storage to 'dark'
  sessionStorage['theme'] = 'dark'

  // if this is not the first time the page loads, remove the light class
  if (load != 'first') body.classList.remove('light')

  // always add dark class, remove the (default) moon icon, and add the circle icon
  body.classList.add('dark')
  icon.classList.remove('fa-moon')
  icon.classList.add('fa-circle')

  // if this is run on a page where the image exists, switch to the dark one
  if (image) image.src = 'images/introImage-dark.svg'

  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

function makeLight(load){
  // set the key in session storage to 'light'
  sessionStorage['theme'] = 'light'

  // if this is not the first page load
  if (load != 'first'){
    // remove the dark tag
    body.classList.remove('dark')
    // remove the circle class and replace it with the (default) moon
    icon.classList.remove('fa-circle')
    icon.classList.add('fa-moon')

    // the light image is default,
    // so if this isn't the first load & there's an image, change to the light image
    if (image){
      image.src = 'images/introImage-light.svg'
    }
  }
  // regardless of everything else, add 'light' class to the body
  body.classList.add('light')

  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

function handleThemeToggle(){
  if (theme === 'light') makeDark('toggle')
  else if (theme === 'dark') makeLight('toggle')

  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

// setup light dark theme toggle
lightDarkToggle.addEventListener('click', handleThemeToggle)



//////////////////////////////////////////////////
////// Tag Filtering Between Pages Code //////////
//////////////////////////////////////////////////

// In this file, we only need to store the value of the tag that was clicked

// Add event listener to each tag on the article page
Array.from(pageTags).forEach(function(element) {
  element.addEventListener('click', handleStoreTag);
});

function handleStoreTag(){
  const $btn = this
  const sel = this.innerText.trim();
  const searchVal = sel === 'R' ? 'R' : sel.toLowerCase()

  sessionStorage['tag'] = sel
  window.location.replace('/')
}

// Now we'll just access this from the masonry-custom.js file
