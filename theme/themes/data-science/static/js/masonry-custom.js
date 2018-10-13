var Shuffle = window.Shuffle;

console.log("running")
console.log({Shuffle})

const myShuffle = new Shuffle(document.querySelector('.portfolio__grid'), {
  itemSelector: '.item',
  sizer: '.portfolio__filters',
  buffer: 1,
});

console.log({shuffle})
