let categoriesButton = document.querySelectorAll('.categories__button');

categoriesButton.forEach((button) => {
  button.addEventListener('click', () => {
    categoriesButton.forEach((item) =>{
      if(button !== item) {
        item.classList.remove('categories__button--active');
      } else {
        item.classList.toggle('categories__button--active');
      }
    });
  });
});
