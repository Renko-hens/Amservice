import validator from 'validator';

const calculatorRepair = document.querySelector('.calculator-repair');

if (calculatorRepair) {
  const form = document.querySelector('.calculator-repair__form');
  const formResults = document.querySelector('.form-communication');

  const repairSelectMark = document.querySelector('#formControlSelectMark');
  const repairSelectModel = document.querySelector('#formControlSelectModel');
  const repairSelectYears = document.querySelector('#formControlSelectYears');

  const email = formResults.elements.inputEmail;
  const phone = formResults.elements.inputPhone;
  const name = formResults.elements.inputName;
  const comments = formResults.elements.comments.value;

  const formSummaryContainer = document.querySelector('.form-summary__container');
  const calculatorRepairContainer = document.querySelector('.calculator-repair__container');
  const contentContainer = document.querySelector('.form-summary__wrapper');
  const servicesElementContainer = document.querySelector('.repair-services__wrapper-list');

  const categoriesList = document.querySelector('.form-summary__list-categories');
  const servicesList = document.querySelector('.repair-services__list');
  const resultsList = document.querySelector('.selected-services__list');

  const formResultsButtonElement = document.querySelector('.form-communication__button');
  const servicesButtonElement = document.querySelector('.form-calculate__button');
  const modalResults = document.querySelector('.modal-body');
  const totalAmmount = document.querySelector(".form-summary__value-amount");

  const selectedServicesPrice = [];
  const selectedServices = [];

  // Проверка на то что запрос не отправлен
  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }


  // Заполняем select, options - массив элементов options
  const fillSelectElement = (selectElement, options) => {
    options.forEach((option) => {
      selectElement.appendChild(option);
    });

    selectElement.disabled = false;
  }


  // Опустошаем select
  const emptySelectElement = (selectElement) => {
    selectElement.innerHTML = '<option value="">Выберите параметры</option>';
    selectElement.disabled = true;
  }

  //  Очищаем select
  const cleanSelectElement = (selectElement) => {
    selectElement.innerHTML = '<option value="">Выберите параметры</option>';
  }

  //  Включение кнопки
  const includeButton = (buttonElement) => {
    buttonElement.disabled = false;
  }


  // Выключение кнопки
  const disabledButton = (buttonElement) => {
    buttonElement.disabled = true;
  }


  // Создание лоадера
  const createLoader = (item) => {
    item.classList.add('contact-us__wrapper--loader');
    item.parentNode.insertAdjacentHTML(
      'beforeend',
      `
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


  const updateAmount = (arrayPrice, totalAmmountElement) => {
    let summary = arrayPrice.reduce((previousValue, currentValue) => {
      return (+previousValue) + (+currentValue);
    }, 0);

    totalAmmountElement.textContent = summary + " ₽";
    return summary;
  }


  // Обработка change-события первого селекта
  const handleSelect1 = (event) => {
    const id = event.target.value;
    getModelsById(id);
  }


  // Обработка change-события второго селекта
  const handleSelect2 = (event) => {
    const id = event.target.value;
    getYearsById(id);
  }


  // Обработка change-события третьего селекта
  const handleSelect3 = (event) => {
    const id = event.target.value;
    if (!id) {
      disabledButton(servicesButtonElement);
    } else {
      includeButton(servicesButtonElement);
    }
  }



  // Запрос на получение списка марки автомобиля (данные для первого селекта)
  const getBrands = () => {
    fetch('https://amservice.unilead.team/api/calculators/post/calculator_repair/marks', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        const options = json.response.map((el) => {
          const option = document.createElement('option');
          option.textContent = el.title;
          option.value = el.id;
          return option;
        });

        fillSelectElement(repairSelectMark, options);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  // Запрос на получение списка марок по ID(данные для второго селекта))
  const getModelsById = (id) => {

    if (!id) {
      emptySelectElement(repairSelectModel);
      emptySelectElement(repairSelectYears);
      disabledButton(servicesButtonElement);
      categoriesList.innerHTML = '';
      return;
    };

    let dataBrand = {
      "markID": id
    };

    fetch('https://amservice.unilead.team/api/calculators/post/calculator_repair/models', {
      method: 'POST',
      body: JSON.stringify(dataBrand),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(function (json) {
        cleanSelectElement(repairSelectModel);
        emptySelectElement(repairSelectYears);
        const options = json.response.map((el) => {
          const option = document.createElement('option');
          option.textContent = el.title;
          option.value = el.id;
          return option;
        });

        fillSelectElement(repairSelectModel, options);
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  // Запрос на получение списка Годов по ID марки
  const getYearsById = (id) => {
    if (!id) {
      emptySelectElement(repairSelectYears);
      disabledButton(servicesButtonElement);
      categoriesList.innerHTML = '';
      return;
    };

    let dataYears = {
      "modelID": id
    };

    fetch(`https://amservice.unilead.team/api/calculators/post/calculator_repair/years`, {
      method: 'POST',
      body: JSON.stringify(dataYears),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(function (json) {
        cleanSelectElement(repairSelectYears);

        if (json.response == 0) {
          console.log(json);
          console.log("ошибка");
        }

        const options = json.response.map((el) => {
          const option = document.createElement('option');
          option.textContent = el;
          option.value = el;
          return option;
        });

        fillSelectElement(repairSelectYears, options);
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  // Отправка данных селектов и создание элементов на основе полученных данных 
  const handleFormSubmit = (event) => {
    event.preventDefault();

    disabledButton(servicesButtonElement);
    createLoader(calculatorRepairContainer);
    categoriesList.innerHTML = '';

    const form = event.target;
    let data = {
      "modelID": form.elements.brands.value,
      "year": form.elements.years.value,
    };

    fetch('https://amservice.unilead.team/api/calculators/post/calculator_repair/categories',{
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
        formSummaryContainer.style.display = "block";
        categoriesList.innerHTML = '';
        servicesList.innerHTML = '';
        resultsList.innerHTML = '';

        selectedServicesPrice.splice(0 , selectedServicesPrice.length)
        updateAmount(selectedServicesPrice , totalAmmount);
        
        selectedServices.splice(0 , selectedServices.length)
        updateAmount(selectedServices , totalAmmount);

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
      .then(() => {
        deleteLoader(calculatorRepairContainer)
      })
      .catch((error) => {
        console.error(error);
      })
  }


  // Отправка данных селектов и id нажатой кнопки для создания чекбоксов на основе полученных данных 
  const handleCategoryClick = (event) => {
    event.preventDefault();

    createLoader(servicesElementContainer);

    // Меняет цвет кнопки
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
      "modelID": form.elements.brands.value,
      "year": form.elements.years.value,
      "categoryID": buttonId.dataset.id
    };

    fetch(`https://amservice.unilead.team/api/calculators/post/calculator_repair/services`, {
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
                      <input class="form-summary__checkbox repair-services__checkbox" type="checkbox" data-title="${service.title} - ${service.type}" value=${service.price}>
                      <div class="form-summary__checkbox-text"></div>
                    </label>
                  </div>
                  <div class="form-summary__description-wrapper repair-services__description-wrapper">
                    <p class="form-summary__description repair-services__description">${service.title} - ${service.type}</p>
                  </div>
                  <div class="form-summary__price-wrapper repair-services__price-wrapper">
                    <p class="form-summary__price repair-services__price">${service.price}₽</p>
                  </div>
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


  // Обработка чекбоксов и формирование массива объектов с выбранными значениями
  const handleServices = (event) => {
    const checkbox = event.target.closest('input[type="checkbox"]');

    if (checkbox != null) {
      const li = checkbox.closest('li');
      const priceValue = checkbox.value;
      
      const activeCategoryElement = document.querySelector('.categories__button--active');    
      const formButtonSignElement = document.querySelector('.form-summary__button-sign');
      
      let selectedService = {};
      selectedService.price = checkbox.value;
      selectedService.title = checkbox.dataset.title;
      selectedService.id = li.dataset.serviceId;
      selectedService.categoryId = li.dataset.categoryId;

      if (checkbox.checked == true) {
        selectedServicesPrice.push(priceValue);
        selectedServices.push(selectedService);

        resultsList.append(li);

        updateAmount(selectedServicesPrice , totalAmmount);
      } else {
        selectedServicesPrice.splice(selectedServicesPrice.indexOf(priceValue), 1);
        selectedServices.splice(selectedServices.indexOf(selectedService), 1);

        updateAmount(selectedServicesPrice , totalAmmount);
       
        if (activeCategoryElement != null) {
          const servicesCategoryId = activeCategoryElement.dataset.id;

          if (servicesCategoryId == li.dataset.categoryId) {
            servicesList.append(li);
          } else {
            li.remove();
          }
        }
      }

      if(selectedServicesPrice.length == 0) {      
        disabledButton(formButtonSignElement);
      } else {
        includeButton(formButtonSignElement);
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
    formId.append('comments', formResults.elements.comments.value);
    formId.append('model',  form.elements.models.value);
    formId.append('brand',  form.elements.brands.value);
    formId.append('year',  form.elements.years.value);
    formId.append('selectedServices', JSON.stringify(selectedServices));
    formId.append('pageId', pageId.value);
    formId.append('pageTitle', pageTitle.value);
    formId.append('totalAmmount', updateAmount(selectedServicesPrice , totalAmmount));

    let data = {
      name: formResults.elements.inputName.value,
      email: formResults.elements.inputEmail.value,
      phone: formResults.elements.inputPhone.value,
      selectedServices: selectedServices,
      model: form.elements.models.value,
      brand: form.elements.brands.value,
      year: form.elements.years.value
    };

    fetch('https://amservice.unilead.team/api/forms/post/calculator_repair/', {
      method: 'POST',
      body: formId,
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(() =>{
        modalForm.style.display = "none";
        return;
      })
      .then((json) => {
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
          comments.value = '';
          disabledButton(formResultsButtonElement);
          modalForm.style.display = "block";
          return;
        }, 5000);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  repairSelectMark.addEventListener('change', handleSelect1);
  repairSelectModel.addEventListener('change', handleSelect2);
  repairSelectYears.addEventListener('change', handleSelect3);
  form.addEventListener('submit', handleFormSubmit);

  categoriesList.addEventListener("click", handleCategoryClick);
  contentContainer.addEventListener('click', handleServices);
  
  name.addEventListener('change', handleValidator);
  email.addEventListener('change', handleValidator);
  phone.addEventListener('change', handleValidator);  
  formResults.addEventListener('submit', handleResultsFormSubmit);

  // Браузер полностью загрузил HTML, теперь можно выполнять функции
  document.addEventListener("DOMContentLoaded", getBrands);
}

