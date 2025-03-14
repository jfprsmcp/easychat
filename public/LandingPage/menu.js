let btnMenu, btnMenuProduct, btnMenuResource
let contentMenu, contentMenuProduct, contentMenuResource
let iconMenu, iconClose, iconProductDown, iconProductRight, iconResourceDown, iconResourceRight

document.addEventListener("DOMContentLoaded", function () {
    initialize();
    listener();
});

function initialize() {
    btnMenu = document.querySelector("#headlessui-popover-button-116");
    btnMenuProduct = document.querySelector("#headlessui-disclosure-button-36");
    btnMenuResource = document.querySelector("#headlessui-disclosure-button-38");

    contentMenu = document.querySelector("#headlessui-popover-panel-13");
    contentMenuProduct = document.querySelector("#headlessui-disclosure-panel-33");
    contentMenuResource = document.querySelector("#headlessui-disclosure-panel-41");

    iconMenu = document.querySelector("#iconMenu");
    iconClose = document.querySelector("#iconClose");
    iconProductDown = document.querySelector("#iconProductDown");
    iconProductRight = document.querySelector("#iconProductRight");
    iconResourceDown = document.querySelector("#iconResourceDown");
    iconResourceRight = document.querySelector("#iconResourceRight");
}

function listener() {
    btnMenu.addEventListener("click", handlerToogleMenu);
    btnMenuProduct.addEventListener("click", handlerToogleMenuProduct);
    btnMenuResource.addEventListener("click", handlerToogleMenuResource);
}

function handlerToogleMenu() {
    iconMenu.classList.toggle("hidden");
    iconClose.classList.toggle("hidden");
    contentMenu.style.display = (contentMenu.style.display === "none") ? "" : "none";
}

function handlerToogleMenuProduct() {
    iconProductDown.classList.toggle("hidden");
    iconProductRight.classList.toggle("hidden");
    contentMenuProduct.style.display = (contentMenuProduct.style.display === "none") ? "" : "none";
}

function handlerToogleMenuResource() {
    iconResourceDown.classList.toggle("hidden");
    iconResourceRight.classList.toggle("hidden");
    contentMenuResource.style.display = (contentMenuResource.style.display === "none") ? "" : "none";
}