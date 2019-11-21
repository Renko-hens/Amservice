const header = document.querySelector('.main-header');
const headerNav = document.querySelector('.main-header__navigation');
const menuButton = document.querySelector('.main-header__menu-button');

if(menuButton) {
  menuButton.addEventListener('click', () => {
    header.classList.toggle('main-header--mobile');

    menuButton.classList.toggle('main-header__menu-button--show');

    if( headerNav.classList.contains('main-header__navigation--show') ){
      headerNav.classList.toggle('main-header__navigation--show');
      headerNav.classList.toggle('main-header__navigation--hide');
    } else if( headerNav.classList.contains('main-header__navigation--hide') ) {
      headerNav.classList.toggle('main-header__navigation--show');
      headerNav.classList.toggle('main-header__navigation--hide');
    } else {
      headerNav.classList.toggle('main-header__navigation--show');
    }

  });

  if( window.innerWidth <= 768 ){
    headerNav.classList.add('main-header__navigation--hide');
  } 

};