(function () {
    let currentPage = null;
    const isMobile = window.innerWidth < 1000;

    const home = 'home',
        dance_artist = 'dance_artist',
        choreographer = 'choreographer',
        educator = 'educator',
        on_the_move = 'on_the_move';

    const hamburgerButton = document.querySelector('.header__hamburger'),
        menu = document.querySelector('.menu'),
        menuOverlay = document.querySelector('.menu__overlay'),
        menuItem = document.querySelectorAll('.items__item');

    const loader = document.querySelector('.loading');

    loader.setAttribute('style', 'display: flex');


    hamburgerButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('header__hamburger--open');
        menu.classList.toggle('menu--open');
    });

    const menuOverlayDefaultStyle = menuOverlay.style;

    function menuItemMouseEnter() {
        const backgroundImage = this.dataset.name;
        menuOverlay.style.backgroundImage = `url('./assets/img/menu_backgrounds/menu__${backgroundImage}.jpg')`;
    }
    function menuItemMouseLeave() {
        menuOverlay.style = menuOverlayDefaultStyle;
    }

    menuItem.forEach(item => {item.addEventListener('mouseenter', menuItemMouseEnter)});
    menuItem.forEach(item => {item.addEventListener('mouseleave', menuItemMouseLeave)});

    function pageLoad(page) {
        const url = `${page}.html`,
            wrapper = document.querySelector('.wrapper');

        function setHeroImageHeight() {

            const heroImage = document.querySelector('.heroimage');
            heroImage.style.height = `${window.innerHeight}px`;

            window.addEventListener('resize', function() {
                heroImage.style.height = `${window.innerHeight}px`;
            });

            window.scrollTo(0,0);
        }

        function setEmbededVideoSize() {
            const iframe = document.querySelector('.story__single--video .single__photo iframe');
            iframe.setAttribute('width', `${window.innerWidth * 0.8}`);
            iframe.setAttribute('height', `${window.innerHeight * 0.8}`);

            if(isMobile) {
                iframe.setAttribute('width', `${window.innerWidth*0.9}`);
                iframe.setAttribute('height', `${window.innerHeight * 0.3}`);
            }

            window.addEventListener('resize', function() {
                iframe.setAttribute('width', `${window.innerWidth * 0.8}`);
                iframe.setAttribute('height', `${window.innerHeight * 0.8}`);
            });
        }

        function homePagePhotoSequenceEffect() {
            const heroImageHome = document.querySelector('.heroimage--home');

            heroImageHome.addEventListener('mousemove', function(e) {
                const windowWidth = window.innerWidth,
                    oneSixteen = windowWidth / 16,
                    currentSlice = (e.pageX / oneSixteen);
                heroImageHome.className = 'heroimage heroimage--home imgAdd';
                heroImageHome.classList.add(`img--${( Math.floor(currentSlice) + 1 )}`);
            });
        }

        function createParallaxEffect() {
            const singlePhoto = document.querySelectorAll('.single__photo'),
                singleSideText = document.querySelectorAll('.single__sidetext');

            singlePhoto.forEach(photo => { photo.classList.add('rellax') });
            singleSideText.forEach(text => {
                text.classList.add('rellax');
                text.style.transform = 'rotate(-90deg)';
                text.dataset.rellaxPercentage = '0';
            });

            const rellax = new Rellax('.rellax', {
                speed: 1.7,
                center: false,
                round: true
            });
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                currentPage = page;
                wrapper.innerHTML = xhr.responseText;

                if(currentPage !== home) {
                    const singles = document.querySelectorAll('.story__single');
                    imagesLoaded( singles, function() {
                        loader.setAttribute('style', 'display: none');
                    });
                } else {
                    const heroimageHome = document.querySelector('.heroimage--home');
                    imagesLoaded( heroimageHome, { background: true }, function() {
                        loader.setAttribute('style', 'display: none');
                    });
                }

                history.pushState(null,null, `#${currentPage}`);

                setHeroImageHeight();

                if(currentPage === home) {
                    homePagePhotoSequenceEffect();
                    const modalToggleOpen = document.querySelector('.open-thanks-js');
                    const modalToggleClose = document.querySelector('.close-thanks-js');
                    const thanksModal = document.querySelector('.thanks-modal');
                    modalToggleOpen.addEventListener('click', () => {
                       thanksModal.classList.add('thanks-modal--open');
                    });

                    modalToggleClose.addEventListener('click', () => {
                       if(thanksModal.classList.contains('thanks-modal--open')) {
                           thanksModal.classList.remove('thanks-modal--open');
                       }
                    });
                }

                if(currentPage !== home && !isMobile) {
                    createParallaxEffect();
                }

                if(currentPage === choreographer) {
                    setEmbededVideoSize();
                }

                if(currentPage === educator) {
                    const last = document.querySelector('.lastfix');
                    last.style.height = '120px';
                }

                if(currentPage === on_the_move) {
                  const last = document.querySelector('.lastfix');
                  last.style.height = '350px';
                }
            }
        };
        xhr.open('GET', `./subsites/${url}`, true);
        xhr.setRequestHeader('Content-Type', 'text/html');
        xhr.send();
    }

    const headerLogo = document.querySelector('.header__logo'),
        menuList = document.querySelector('.menu__items');

    headerLogo.addEventListener('click', function() {
        pageLoad(home);
        menu.classList.remove('menu--open');
        if (hamburgerButton.classList.contains('header__hamburger--open')){
            hamburgerButton.classList.remove('header__hamburger--open');
        }
    });

    menuList.addEventListener('click', function(e) {
        const itemsItem = e.target;

        if (itemsItem.tagName === "LI") {
            pageLoad(itemsItem.dataset.name);
            menu.classList.remove('menu--open');
            hamburgerButton.classList.remove('header__hamburger--open');
        }
    });

    if(window.location.hash) {
        const hash = window.location.hash.substring(1);
        if(hash !== home && hash !== dance_artist && hash !== educator && hash !== choreographer && hash !== on_the_move) {
            pageLoad(home);
        } else {
            pageLoad(hash);
        }
    } else {
        pageLoad(home);
    }

}());