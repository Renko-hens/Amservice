$('.loop').owlCarousel({
  center: true,
  items:2,
  loop:true,
  autoWidth: true,
  margin: 24,
  responsive:{
    0:{
      items: 1,
      autoWidth: false,
      touchDrag: true 
    },
    940:{
      items: 2
    }
  }
});