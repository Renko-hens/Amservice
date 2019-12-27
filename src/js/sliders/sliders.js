$('.promo-carousel').owlCarousel({

  responsive:{
    0:{
      items: 1,
      margin: 20,
      autoWidth: false,
      touchDrag: true 
    },
    980:{
      items: 1,
      center: true,
      margin: 20,
      autoWidth: true,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000
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


$('.information-cards--slider-carousel').owlCarousel({
  margin: 20,
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


$('.car__slider').owlCarousel({
  margin: 20,
  nav:true,
  loop:true,
  dots: false,
  responsive:{
    0:{
      items: 1,
      autoWidth: false,
      touchDrag: true,
      dots: true,
      nav:false
    },
    768:{
      items: 1,
      dots: false,
    }
  }
});