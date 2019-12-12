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


// $('.information-cards--slider-stocks').owlCarousel({
//   margin: 30,
//   nav:true,
//   dots: false,
//   responsive:{
//     0:{
//       items: 1,
//       autoWidth: false,
//       touchDrag: true 
//     },
//     768:{
//       items: 2
//     },
//     940:{
//       items: 3
//     },
//   }
// });

// var $this = $('.promo-carousel').owlCarousel({ autoWidth: true });
// var $stageOuter = $this.find('.owl-stage-outer');
// var stageOuterWidth = $stageOuter.width();
// var $stage = $this.find('.owl-stage');
// var stageWidth = $stage.width();
// var $items = $stage.children();
// var largestChild = 0;
// for (var i = 0, ic = $items.length; i < ic; i++) {
// 	var itemWidth = $($items[i]).width();
// 	largestChild = largestChild > itemWidth ? largestChild : itemWidth;
// }
// if (largestChild > stageOuterWidth) {
// 	$stage.width(stageWidth + Math.ceil((largestChild - stageOuterWidth) * 1.2));
// 	var addedWidth = Math.ceil((largestChild - stageOuterWidth) * 1.2)
// 	var stageNewWidth = $stage.width();
// 	console.log(stageOuterWidth, stageWidth, stageNewWidth, addedWidth, largestChild);
// }


// var $this = $('.promo-carousel').owlCarousel({ autoWidth: true }).trigger('refresh.owl.carousel');