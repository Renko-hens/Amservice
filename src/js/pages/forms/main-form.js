// import $ from 'jquery';
// import validate from 'jquery-validation';

// //Валидация форм
// $(document).ready(function () {
//   var validator = $("#mainForm").validate({
//       errorPlacement : function(error, element) {
//           $(element).addClass('is-invalid');
//       },
//       highlight: function(element) {
//           $(element)
//               .addClass('is-invalid');
//       },
//       unhighlight: function(element) {
//           $(element)
//               .removeClass('is-invalid');
//       },
//       rules: {
//           name: {
//               required: true,
//           },
//           phone: {
//               required: true,
//           },
//           email: {
//               required: true,
//           },
//           terms: {
//               required: true,
//           }
//       },
//       messages: {
//           name: {
//               required: '',
//           },
//           phone: {
//               required: '',
//           },
//           email: {
//               required: '',
//           },
//           terms: {
//               required: '',
//           },
//       },
//       success: "valid",
//       submitHandler: function() { 
//           validator.destroy();
//           sendMainForm();
//           return false;
//       }
//   });
  
//   function sendMainForm() {
      
//       var f = $('#mainForm').serializeArray();
//       var i = $('#formPageInfo').serialize();
      
//       var url = "/api/forms/post/main/";

//       $.ajax({
//           url: url,
//           type: "POST",
//           dataType: "json",
//           data: {
//               "name":f[0].value,
//               "phone":f[1].value,
//               "email":f[2].value,
//               "page_id":i.page_id,
//           },
//           beforeSend : function (){
//               $(".contact-us .contact-us__wrapper").addClass("contact-us__wrapper--loader");
//           },
//           success: function(data){
//               setTimeout(function(){
//                   console.log(data);
//                   if (data.success == true){
//                       $(".contact-us .contact-us__wrapper").removeClass("contact-us__wrapper--loader");
//                       $("#mainForm").html("");
//                       $("#mainForm").append("<div class=\"contact-us__wrapper row\"><div class=\"contact-us__picture-success mb-4\"><img class=\"contact-us__image-success\" src=\"site/templates/img/check.svg\"></div><div class=\"contact-us__text col-sm-12 text-center\"><h3 class=\"contact-us__text-title title\">Спасибо!</h3><p class=\"contact-us__text-description--success\"> Благодарим за оставленную заявку. <br> Мы обязательно свяжемся с Вами в ближайшее время.</p></div> </div>");
  
//                   } else {
//                       $(".contact-us .contact-us__wrapper").removeClass("contact-us__wrapper--loader");
//                   }
//               }, 1000);
//           },
//           error: function(){
//               $(".contact-us .contact-us__wrapper").removeClass("contact-us__wrapper--loader");
//           }
//       });

//   }
// });
