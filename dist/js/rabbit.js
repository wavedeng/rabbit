




(function (global, factory) {
    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports == global.document ?
            factory(global) :
            function (w) {
                if (!w.document) {
                    throw new Error("rabbit requires a window with a document");
                }
                return factory(w);
            }
    } else {
        factory(global);
    }

})(typeof window !== "undefined" ? window : this, function (window) {
    "use strict";

    var _rabbit = {};

    _rabbit.init = function () {
        _rabbit.initNavbar();
        _rabbit.initCarousel();
        _rabbit.initDropdownMenu();
        _rabbit.initDocNav();
    };


    //init navbar 
    _rabbit.initNavbar = function () {
        var navbar = document.querySelector(".rabbit-navbar");
        var navbarMiddle = document.querySelector(".navbar-middle");

        var bread = navbar.querySelector(".bread-menu");
        if (bread != null) {
            var hidden = true;

            bread.addEventListener("click", () => {
                if (hidden) {
                    navbarMiddle.style.height = "100vh";
                }
                else {
                    navbarMiddle.style.height = "0px";
                }

                hidden = !hidden;
            });
        }
    }




    //init carousels if more than one.
    _rabbit.initCarousel = function () {
        var carousels = document.querySelectorAll(".rabbit-carousel");
        carousels.forEach(carousel => {
            let ballsContainer = carousel.querySelector(".carousel-balls");
            let balls = null;
            let ballsCount = 0;
            let withBalls = false;

            if (ballsContainer != null) {
                balls = ballsContainer.querySelectorAll(".carousel-ball");
                ballsCount = balls.length;
                withBalls = true;
            }

            let intervalTime = carousel.getAttribute("data-interval-time");
            let transitionTime = carousel.getAttribute("data-transition-time");
            if (intervalTime === null) {
                intervalTime = 3000;
                transitionTime = 500;
            }

            let slidersContainer = carousel.querySelector(".carousel-sliders");
            if (slidersContainer === null) {
                console.error("please put .carousel-sliders in .rabbit-carousel");
                return;
            }

            let sliders = slidersContainer.querySelectorAll(".slider-item");
            let slidersCount = sliders.length;

            if (ballsContainer !== null) {
                slidersCount == ballsCount ? "" : withBalls = false; console.warn("balls count is not equal to slidera count so the balls do not work.");
            }
            slidersContainer.style.transition = "transform " + transitionTime / 1000 + "s ease";




            let currentIndex = 0;
            let loopOffset = 0;
            let moving = false;

            if (withBalls) {
                balls[currentIndex].classList.add("current");
            }

            setInterval(nextSlider, intervalTime);

            function nextSlider(reverse) {
                if (moving == true) {
                    return;
                }

                //move to left
                if (reverse) {
                    currentIndex--;
                    if (currentIndex < 0) {
                        currentIndex = slidersCount - 1;
                    }

                    if (currentIndex == slidersCount - 1 - loopOffset) {
                        loopOffset -= 1;
                        if (loopOffset < 0) {
                            loopOffset = slidersCount-1;
                        }
                        loopOffset = loopOffset % slidersCount;
 
                        slidersContainer.style.transition = "transform 0s ease";
                        slidersContainer.style.transform = "translateX(" +(0-(slidersCount - 1)) * 100 + "%)";
                        sliders = slidersContainer.querySelectorAll(".slider-item");

                        for (let i = slidersCount - 1; i > 0; i--) {
                            slidersContainer.insertBefore(sliders[i], slidersContainer.children[0]);
                        }

                        //requestAnimationFrame(() => {
                        //    slidersContainer.style.transition = "transform " + transitionTime / 1000 + "s ease";
                        //    slidersContainer.style.transform = "translateX(" + (0 - (slidersCount - 2)) * 100 + "%)";
                        //});

                        setTimeout(() => {
                            slidersContainer.style.transition = "transform " + transitionTime / 1000 + "s ease";
                            slidersContainer.style.transform = "translateX(" + (0 - (slidersCount - 2)) * 100 + "%)";
                        }, 100);

                        if (withBalls == true) {
                            balls.forEach(ball => {
                                ball.classList.remove("current");
                            })
                            balls[currentIndex].classList.add("current");
                        }

                        return;
                    }
                }
                else {
                    currentIndex++;
                }

                currentIndex = currentIndex % slidersCount;
                slidersContainer.style.transform = "translateX(" + (-((currentIndex + loopOffset) % slidersCount) * 100) + "%)";
                slidersContainer.style.transition = "transform " + transitionTime / 1000 + "s ease";

                moving = true;

                if (withBalls == true) {
                    balls.forEach(ball => {
                        ball.classList.remove("current");
                    })
                    balls[currentIndex].classList.add("current");
                }

                setTimeout(() => { moving = false }, transitionTime);

                if (currentIndex == slidersCount - 1 - loopOffset) {
                    loopOffset += 1;
                    loopOffset = loopOffset % slidersCount;
                    setTimeout(() => {
                        slidersContainer.style.transition = "transform 0s ease";
                        slidersContainer.style.transform = "translateX(0%)";
                        sliders = slidersContainer.querySelectorAll(".slider-item");
                        for (let i = 0, l = slidersCount; i < l - 1; i++) {
                            slidersContainer.appendChild(sliders[i]);
                        }
                    }, transitionTime);
                }

            }


            let lastBtn = carousel.querySelector(".last");
            let nextBtn = carousel.querySelector(".next");

            lastBtn.addEventListener("click", () => {
                nextSlider(true);
            });

            nextBtn.addEventListener("click", () => {
                nextSlider();
            });

        });
    }

    _rabbit.initDocNav = function () {
        var navDom = document.querySelectorAll(".rabbit-document-nav");
        navDom = navDom[navDom.length - 1];
        if (navDom == null) {
            return;
        }
        var outerHooks = navDom.querySelectorAll(".section-name");
        var sections = navDom.querySelectorAll(".document-section");
        var innerHooks = [];
        sections.forEach(outer => {
            innerHooks.push(outer.querySelectorAll(".nav>a"));
        });
        var calculating = false;

        var lastOutIndex = null;
        var lastInnerIndex = null;

        window.addEventListener("scroll", () => {
            if (calculating == true) {
                return;
            }
            else {
                calculating = true;
            }
            var scrollTop = document.documentElement.scrollTop;
            var outIndex = getIndexOfCurrentElement(outerHooks, scrollTop);

            var changedSection = false;

            if (outIndex != lastOutIndex) {
                outerHooks[outIndex].parentElement.classList.add("current-section");
                lastOutIndex != null ? outerHooks[lastOutIndex].parentElement.classList.remove("current-section") : '';
                changedSection = true;
            }

            var innerNows = innerHooks[outIndex];
            var innerIndex = null;

            if (innerNows.length > 0) {
                innerIndex = getIndexOfCurrentElement(innerNows, scrollTop);

                if (changedSection) {
                    lastInnerIndex != null ? innerHooks[lastOutIndex][lastInnerIndex].parentElement.classList.remove("current-nav") : '';
                }
                else {
                    innerNows[lastInnerIndex].parentElement.classList.remove("current-nav");
                }

                innerNows[innerIndex].parentElement.classList.add("current-nav");
            }
            else {
                lastInnerIndex != null ? innerHooks[lastOutIndex][lastInnerIndex].parentElement.classList.remove("current-nav") : '';
            }

            lastOutIndex = outIndex;
            lastInnerIndex = innerIndex;
            calculating = false;
        });

    }

    function getIndexOfCurrentElement(hooks, scrollTop) {
        var currentStart = 0;
        var currentEnd = hooks.length;
        while (true) {
            if (currentEnd == currentStart || currentEnd == currentStart + 1) {
                return currentStart;
            }
            var currentMiddle = Math.floor((currentEnd - currentStart) / 2) + currentStart;
            var targetId = hooks[currentMiddle].getAttribute("href");
            var targetDom = document.querySelector(targetId);
            if (targetDom == null) {
                console.error("the hook you hanged is null,please check " + targetId);
                return
            }
            var offsetTop = targetDom.offsetTop;
            if (offsetTop > scrollTop) {
                currentEnd = currentMiddle;
            }
            else {
                currentStart = currentMiddle;
            }
        }
    }


    _rabbit.initDropdownMenu = function () {
        var dropdownGroups = document.querySelectorAll(".rabbit-dropdown-group");
        dropdownGroups.forEach(dropdown => {
            var trigger = dropdown.querySelector(".rabbit-dropdown-trigger");
            var menu = dropdown.querySelector(".rabbit-dropdown-menu");

            if (trigger === null) {
                console.debug("rabbit can not find the trigger in one of your dropdown groups please check")
                return;
            }
            if (menu === null) {
                console.debug("rabbit can not find the menu in  one of your dropdown groups please check")
                return;
            }

            let show = false;

            trigger.addEventListener("click", () => {
                if (show === true) {
                    menu.style.display = "none";
                }
                else {
                    menu.style.display = null;
                }
                show = !show;
            });
        });
    }


    _rabbit.showInfo = function (type, content, time) {
        if (typeof type !== "string") {
            console.error("showInfo except a string in 'fail' 'success' 'warn' to identify the type of info");
        }
        if (time === undefined) {
            time = 2000;
        }
        var infoDom = document.createElement("span");
        infoDom.classList.add("rabbit-info-" + type);
        infoDom.classList.add("top-info");
        infoDom.classList.add("rabbit-info");
        infoDom.innerText = content;
        document.body.appendChild(infoDom);
        setTimeout(() => {
            document.body.removeChild(infoDom);
        }, time);
    }

    _rabbit.showModal = function (title, content, confirmText, cancelText, confirmCallback, cancelCallback) {
        var modalDom = _createDom("div", ["rabbit-modal", "pop-up"]);
        var modalTopDom = _createDom("div", "modal-top");
        var modalBottomDom = _createDom("div", "modal-bottom");

        var modalTitleDom = _createDom("p", "modal-title");
        modalTitleDom.innerText = title;
        var modalContentDom = _createDom("p", "modal-content");
        modalContentDom.innerText = content;
        modalTopDom.appendChild(modalTitleDom);
        modalTopDom.appendChild(modalContentDom);

        var confirmBtn = _createDom("button", "rabbit-rectangle-button");
        var cancelBtn = _createDom("button", "rabbit-rectangle-button");
        confirmBtn.innerText = confirmText ? confirmText : "confirm";
        cancelBtn.innerText = cancelText ? cancelText : "cancel";

        modalBottomDom.appendChild(confirmBtn);
        modalBottomDom.appendChild(cancelBtn);

        modalDom.appendChild(modalTopDom);
        modalDom.appendChild(modalBottomDom);

        document.body.appendChild(modalDom);

        confirmBtn.addEventListener("click", () => {
            if (confirmCallback !== undefined) {
                confirmCallback();
            }
            document.body.removeChild(modalDom);
        });

        cancelBtn.addEventListener("click", () => {
            if (cancelCallback !== undefined) {
                cancelCallback();
            }
            document.body.removeChild(modalDom);
        });

    }


    function _createDom(tag, className) {
        var dom = document.createElement(tag);
        if (Array.isArray(className)) {
            className.forEach(name => {
                dom.classList.add(name);
            });
        }
        else {
            dom.className = className;
        }
        return dom;
    }



    window.rabbit = _rabbit;
    return _rabbit;
});
