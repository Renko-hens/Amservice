$('.loop').owlCarousel({
  center: true,
  margin: 24,
  loop: true,
  responsive:{
    0:{
      items: 1,
      autoWidth: false,
      touchDrag: true 
    },
    940:{
      items: 2,
      autoWidth: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause:true,
    }
  }
});


$('.about-us__slider').owlCarousel({
  items:1,
  loop:true,
  margin: 16,
  autoplay:true,
  autoplayTimeout: 3000,
  autoplayHoverPause:true,
});


$('.information-cards--slider-news').owlCarousel({
  margin: 30,
  nav:true,
  dots: false,
  responsive:{
    0:{
      items: 1,
      autoWidth: false,
      touchDrag: true 
    },
    768:{
      items: 2
    },
    940:{
      items: 4
    },
  }
});


$('.information-cards--slider-stocks').owlCarousel({
  margin: 30,
  nav:true,
  dots: false,
  responsive:{
    0:{
      items: 1,
      autoWidth: false,
      touchDrag: true 
    },
    768:{
      items: 2
    },
    940:{
      items: 3
    },
  }
});



