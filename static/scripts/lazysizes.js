import 'lazysizes';

const lazyLoad = new lazyLoad({
    elements_selector: ".lazy",
    threshold: 200,
    callback_loaded: function(element){
        console.log("Image loaded");
    }
});