var macy = Macy({
    container: '.portfolio__grid',
    trueOrder: false,
    waitForImages: false,
    margin: 24,
    columns: 3,
    breakAt: {
        1200: 3,
        940: 3,
        520: 2,
        400: 1
    }
});

console.log({macy})
