import validator from 'validator';
// import ImageMap from 'image-map/dist/image-map';

// ImageMap( 'img[usemap]' );
// console.log(ImageMap('img[usemap]'));

const calculatorPainting = document.querySelector('.calculator-painting');

if (calculatorPainting) {
  const form = document.querySelector('.calculator-repair__form');
  const formResults = document.querySelector('.form-communication');
  const formPageInfo = document.querySelector('#formPageInfo');

  const email = formResults.elements.inputEmail;
  const phone = formResults.elements.inputPhone;
  const name = formResults.elements.inputName;

  const formSummaryContainer = document.querySelector('.form-summary__container');
  const contentContainer = document.querySelector('.form-summary__wrapper');
  const servicesElementContainer = document.querySelector('.repair-services__wrapper-list');

  const categoriesList = document.querySelector('.form-summary__list-categories');
  const servicesList = document.querySelector('.repair-services__list');
  const resultsList = document.querySelector('.selected-services__list');

  const formResultsButtonElement = document.querySelector('.form-communication__button');
  const modalResults = document.querySelector('.modal-body');

  const totalAmmountElement = document.querySelector(".form-summary__value-amount");
  let selectedServices = [];


    // Проверка на то что запрос не отправлен
    const handleErrors = (response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }
 
    const updateAmount = (arrayPrice, totalAmmountElement) => {

      let summary = arrayPrice.reduce((previousValue, currentValue) => {
        return (+previousValue) + (+currentValue);
      }, 0);

      totalAmmountElement.textContent = summary + " ₽";
    }  

    // Создание лоадера
    const createLoader = (item) => {
      item.classList.add('contact-us__wrapper--loader');
      item.parentNode.insertAdjacentHTML(
        'beforeend', `
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        `
      );
    }

      // Удаление лоадера
  const deleteLoader = (item) => {
    let loader = document.querySelector('.lds-ring');
    loader.remove();
    item.classList.remove('contact-us__wrapper--loader');
  }

   //  Включение кнопки
   const includeButton = (buttonElement) => {
    buttonElement.disabled = false;
  }


  // Выключение кнопки
  const disabledButton = (buttonElement) => {
    buttonElement.disabled = true;
  }

  const getPricesFromService = (services) => {
    const prices = services.map((service) => service.price);
    return prices;
  }

  // Отправка данных селектов и создание элементов на основе полученных данных 
  const handleFormSubmit = (event) => {
    event.preventDefault();

    fetch('https://amservice.unilead.team/api/calculators/post/painting/categories' , {
        method: 'POST',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        formSummaryContainer.style.display = "block";
        categoriesList.innerHTML = '';
        json.response.forEach((category) => {
          categoriesList.insertAdjacentHTML(
            'beforeend',
            `<li class="form-summary__item-categories categories__item">
                <button class="form-summary__button-category categories__button" data-id=${category.id}>
                  <div class="categories__picture-wrapper"><img class="categories__image" src="${category.img}"></div>
                  <div class="categories__title-wrapper">
                    <h3 class="categories__title-category">${category.title}</h3>
                  </div>
                </button>
            </li>`
          );
        }
        );
      })
      .catch((error) => {
        console.error(error);
      })
  }

   // Отправка данных селектов и id нажатой кнопки для создания чекбоксов на основе полученных данных 
   const handleCategoryClick = (event) => {
    event.preventDefault();

    createLoader(servicesElementContainer);

    // // Меняет цвет кнопки
    const buttonCategoryElement = event.target.closest('button.categories__button');
    const categoriesButton = document.querySelectorAll('.categories__button');

    categoriesButton.forEach((button) => {
      if (buttonCategoryElement !== button) {
        button.classList.remove('categories__button--active');
        includeButton(button)
      } else {
        button.classList.add('categories__button--active');
        disabledButton(button)
      }
    });

    const buttonId = event.target.closest('button.form-summary__button-category');

    let data = {
      "categoryID" : buttonId.dataset.id
    };

    fetch(`https://amservice.unilead.team/api/calculators/post/painting/services` , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        servicesList.innerHTML = '';
        json.response.map((service) => {
          let _id = null;

          if (selectedServices.length > 0) {
            _id = selectedServices.find((selectedService) => {
              return selectedService.id == service.id;
            });
          }

          if (!_id) {
            servicesList.insertAdjacentHTML(
              'beforeend',
              `<li class="form-summary__item repair-services__item"  data-category-id="${buttonId.dataset.id}" data-service-id="${service.id}">
                <div class="form-summary__checkbox-block"> 
                  <div class="form-summary__checkbox-wrapper repair-services__checkbox-wrapper"> 
                      <label class="form-summary__label">
                        <input class="form-summary__checkbox repair-services__checkbox" type="checkbox" data-radioPower="light"  data-title="${service.title}" value=${service.serviceLightPrice}>
                        <div class="form-summary__checkbox-text"></div>
                      </label>
                  </div>
                  <div class="form-summary__description-wrapper repair-services__description-wrapper">
                    <p class="form-summary__description repair-services__description">${service.title}</p>
                  </div>
                  <div class="form-summary__price-wrapper repair-services__price-wrapper">
                    <p class="form-summary__price repair-services__price">${service.serviceLightPrice}₽</p>
                  </div>
                </div>
                <div class = "form-summary__radio-wrapper repair-services__radio-wrapper">
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="light" data-price="${service.serviceLightPrice}" name="radio${service.id}" checked>
                    Легкая степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="normal" data-price="${service.serviceNormalPrice}" name="radio${service.id}">
                    Средняя степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="hard" data-price="${service.serviceHardPrice}" name="radio${service.id}">
                    Тяжелая степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="change" data-price="${service.serviceChangePrice}" name="radio${service.id}">
                    Замена детали
                    <div class="form-summary__radio-text"></div>
                  </label>
                </div>
              </li>`
            );
          }
        });
      })
      .then(() => {
        deleteLoader(servicesElementContainer);
      })
      .catch((error) => {
        console.error(error);
      })
  }
  
  // Обработка чекбоксов и формирование массива с выбранными значениями
  const handleServices = (event) => {
    const checkbox = event.target.closest('input[type="checkbox"]');
    let selectedServiceObject = {};

    if (checkbox != null) {
      const li = checkbox.closest('li');
      // const priceValue = checkbox.value;

      const activeCategoryElement = document.querySelector('.categories__button--active');    
      const formButtonSignElement = document.querySelector('.form-summary__button-sign');

      selectedServiceObject.price = checkbox.value;
      selectedServiceObject.title = checkbox.dataset.title;
      selectedServiceObject.id = li.dataset.serviceId;
      selectedServiceObject.categoryId = li.dataset.categoryId;
      selectedServiceObject.degreeDamage = checkbox.dataset.radiopower;

      if (checkbox.checked == true) {
        // selectedServicesPrice.push(priceValue);
        selectedServices.push(selectedServiceObject);

        resultsList.append(li);
        updateAmount(getPricesFromService(selectedServices) , totalAmmountElement);
      } else {
        selectedServices = selectedServices.filter((service) => li.dataset.serviceId != service.id);

        updateAmount(getPricesFromService(selectedServices) , totalAmmountElement);
        
        if (activeCategoryElement != null) {
          const servicesCategoryId = activeCategoryElement.dataset.id;

          if (servicesCategoryId == li.dataset.categoryId) {
            servicesList.append(li);
          } else {
            li.remove();
          }
        }
      }

      if(selectedServices.length == 0) {      
        disabledButton(formButtonSignElement);
      } else {
        includeButton(formButtonSignElement);
      }
    }

    const radio = event.target.closest('input[type="radio"]');
    if (radio != null) {
      const parent = event.target.closest('.form-summary__item');
      const checkboxElement = parent.querySelector('.form-summary__checkbox');
      const priceElement = parent.querySelector('.form-summary__price');
      const radioPrice = radio.dataset.price;
      
      priceElement.textContent = radioPrice + "₽";
      checkboxElement.value = radioPrice;      
      checkboxElement.dataset.radiopower = radio.dataset.power;
      selectedServiceObject.degreeDamage = checkboxElement.dataset.radiopower;
      
      if(checkboxElement.checked) {
        const newSelectedServices = selectedServices.map((service) => {
          if(service.id == parent.dataset.serviceId) {
            service.price = radioPrice;
            service.degreeDamage = radio.dataset.power;
          }
  
          return service;
        });
  
        updateAmount(getPricesFromService(newSelectedServices) , totalAmmountElement);
      }
    }
  }

  
  const handleValidator = (event) => {
    event.preventDefault();
    let counter = 3;

    if(validator.isEmpty(name.value.trim())){
      name.classList.add('is-invalid');
    } else {
      name.classList.remove('is-invalid');
      counter -= 1;
    }

    if(!validator.isEmail(email.value)){
      email.classList.add('is-invalid');
    } else {
      email.classList.remove('is-invalid');
      counter -= 1;
    }

    if(!validator.isMobilePhone(phone.value, ['ru-RU'])){
      phone.classList.add('is-invalid');

    } else {
      phone.classList.remove('is-invalid');
      counter -= 1;
    }

    if(counter == 0 && validator.isEmail(email.value) && validator.isMobilePhone(phone.value) && !validator.isEmpty(name.value.trim())) {
      setTimeout(() => {
        includeButton(formResultsButtonElement);
      }, 400);
    } else {
        disabledButton(formResultsButtonElement);
    }
  }

  
  // Отправка выбранных чекбоксов и данных пользователя 
  const handleResultsFormSubmit = (event) => {
    event.preventDefault();

    createLoader(formResults);
    const formPageInfo = document.querySelector('#formPageInfo');
    const pageId = formPageInfo.querySelector('input[name="page_id"]');
    const pageTitle = formPageInfo.querySelector('input[name="pageTitle"]');
    
    const modalForm = document.querySelector('.modal-body__form');

    const formId = new FormData();
    formId.append('name', formResults.elements.inputName.value);
    formId.append('email', formResults.elements.inputEmail.value);
    formId.append('phone', formResults.elements.inputPhone.value);
    formId.append('selectedServices', JSON.stringify(selectedServices));
    formId.append('pageId', pageId.value);
    formId.append('pageTitle', pageTitle.value);

    // let data = {
    //   name: formResults.elements.inputName.value,
    //   email: formResults.elements.inputEmail.value,
    //   phone: formResults.elements.inputPhone.value,
    //   selectedServices: selectedServices
    // };

    fetch('https://amservice.unilead.team/api/forms/post/calculator_repair/', {
      method: 'POST',
      body: formId,
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        modalForm.style.display = 'none';

        modalResults.insertAdjacentHTML(
          'beforeend',
          ` <div class="contact-us__wrapper">
              <div class="contact-us__picture-success">
                <img class="contact-us__image-success" src="/site/templates/img/check.svg">
              </div>
              <div class="contact-us__text col-sm-12 text-center">
                <h3 class="contact-us__text-title title">Спасибо!</h3>
                <p class="contact-us__text-description--success">
                  Благодарим за оставленную заявку. <br> 
                  Мы обязательно свяжемся с Вами в ближайшее время.
                </p>
              </div>
            </div>
          `
        );
      })
      .then(() => {
        deleteLoader(formResults);
      })
      .then(() => {
        const formSuccess = document.querySelector('.contact-us__wrapper');

        setTimeout(() => {
          formSuccess.remove();
          name.value = '';
          email.value = '';
          phone.value = '';
          disabledButton(formResultsButtonElement);
          modalForm.style.display = 'block';
        }, 5000);
      })
      .catch((error) => {
        console.error(error);
      })
  }


  categoriesList.addEventListener("click", handleCategoryClick);
  contentContainer.addEventListener('click', handleServices);

  name.addEventListener('change', handleValidator);
  email.addEventListener('change', handleValidator);
  phone.addEventListener('change', handleValidator);  
  formResults.addEventListener('submit', handleResultsFormSubmit);

  // Браузер полностью загрузил HTML, теперь можно выполнять функции
  document.addEventListener("DOMContentLoaded", handleFormSubmit);

}
