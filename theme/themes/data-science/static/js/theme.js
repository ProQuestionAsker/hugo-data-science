let lightDark = 'light'
let body = document.getElementsByTagName('body')[0]
let lightDarkToggle = document.getElementsByClassName('theme-toggle')[0]
let currentTime = new Date().getHours()
let store = sessionStorage['theme']
let image = document.getElementsByClassName('introImage')[0]
console.log({image})

if (store){
  const theme = sessionStorage['theme']
  body.classList.add(`${theme}`)
} if (!store){
  setTheme()
}

// setup light dark theme toggle
lightDarkToggle.addEventListener('click', handleThemeToggle)


function handleThemeToggle(){
  console.log({store})
  let icon = this.getElementsByTagName('i')[0]
  if (store === 'light') {
    sessionStorage['theme'] = 'dark'
    body.classList.remove('light')
    body.classList.add('dark')
    icon.classList.remove('fa-moon')
    icon.classList.add('fa-circle')
    if (image){
      image.src = 'images/introImage-dark.svg'
    }

  }

  else if (store === 'dark') {
    sessionStorage['theme'] = 'light'
    body.classList.remove('dark')
    body.classList.add('light')
    icon.classList.remove('fa-circle')
    icon.classList.add('fa-moon')
    if (image){
      image.src = 'images/introImage-light.svg'
    }
  }
  store = sessionStorage['theme']
  // sessionStorage['theme'] = lightDark
  // let theme = sessionStorage['theme']
  //console.log({theme})
}

function setTheme(){
  store = sessionStorage['theme']

  if (currentTime < 6 || currentTime >= 21){
    sessionStorage['theme'] = 'dark'
  }
  else sessionStorage['theme'] = 'light'
  console.log({currentTime})

  handleThemeToggle()
}
