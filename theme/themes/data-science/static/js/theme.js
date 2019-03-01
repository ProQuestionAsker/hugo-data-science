let lightDark = 'light'
let body = document.getElementsByTagName('body')[0]
let lightDarkToggle = document.getElementsByClassName('theme-toggle')[0]
console.log({lightDarkToggle})

// setup light dark theme toggle
lightDarkToggle.addEventListener('click', handleThemeToggle)


function handleThemeToggle(){
  let icon = this.getElementsByTagName('i')[0]
  console.log({lightDark})
  if (lightDark === 'light') {
    lightDark = 'dark'
    console.log({lightDark})
    body.classList.remove('light')
    body.classList.add('dark')
    icon.classList.remove('fa-moon')
    icon.classList.add('fa-circle')
  }

  else if (lightDark === 'dark') {
    lightDark = 'light'
    body.classList.remove('dark')
    body.classList.add('light')
    icon.classList.remove('fa-circle')
    icon.classList.add('fa-moon')
  }
  localStorage['theme'] = lightDark
  let theme = localStorage['theme']
  console.log({theme})
}

function setTheme(){
  let store = localStorage['theme']
  localStorage['theme'] = 'light'
}

setTheme()
