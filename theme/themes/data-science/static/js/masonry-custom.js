var macy = Macy({
    container: '.portfolio__grid',
    trueOrder: false,
    waitForImages: false,
    margin: 24,
    columns: 3,
    breakAt: {
        1200: 3,
        940: 3,
        700: 2,
        400: 1
    }
});

// macy.runOnImageLoad(function (d) {
//   const image = d.data.img
//   if (image){
//     const parent = image.parentNode
//     parent.classed('is-loaded', true)
//   }
// }, true);
