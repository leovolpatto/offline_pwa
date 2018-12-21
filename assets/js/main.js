function setErrorState(){
    document.getElementById("error-content").className = "visible";
    document.getElementById("content").className = "hidden";
}

function detectAndRegisterServiceWorker(){
    /*if (!('serviceWorker' in navigator)) {
        setErrorState();
        return;
    }*/

    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service worker is now registered');
        })
        .catch(function(error) {
            console.log(error);
            alert("Unable to register service worker " + error);
    });
}

function detectFeatures(){
    detectAndRegisterServiceWorker();
}

function start(){
    var ui = new UI();
    ui.renderTodos();
}

window.onload = function () {
    detectFeatures();

    start();
}