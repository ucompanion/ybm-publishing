$(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const tabIdFromUrl = urlParams.get('tabId');

    if (tabIdFromUrl) {
        const targetElement = document.getElementById(tabIdFromUrl);
        if (targetElement) {
            targetElement.click();
        }
    }
})