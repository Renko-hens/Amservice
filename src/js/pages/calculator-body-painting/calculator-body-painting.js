// import ImageMap from 'image-map/dist/image-map';

// ImageMap( 'img[usemap]' );
// console.log(ImageMap('img[usemap]'));

const calculatorPainting = document.querySelector('.calculator-painting');
const form = document.querySelector('.calculator-repair__form');
const formResults = document.querySelector('.form-communication');

const repairSelectMark = document.querySelector('#formControlSelectMark');
const repairSelectModel = document.querySelector('#formControlSelectModel');
const repairSelectYears = document.querySelector('#formControlSelectYears');

const formSummaryContainer = document.querySelector('.form-summary__container');
const calculatorRepairContainer = document.querySelector('.calculator-repair__container');
const contentContainer = document.querySelector('.form-summary__wrapper');
const servicesElementContainer = document.querySelector('.repair-services__wrapper-list');

const categoriesList = document.querySelector('.form-summary__list-categories');
const servicesList = document.querySelector('.repair-services__list');
const resultsList = document.querySelector('.selected-services__list');

const servicesButtonElement = document.querySelector('.form-calculate__button');
const modalResults = document.querySelector('.modal-body');

const totalAmmount = document.querySelector(".form-summary__value-amount");
const selectedServicesPrice = [];
const selectedServicesId = [];




if (calculatorPainting) {

    // Проверка на то что запрос не отправлен
    const handleErrors = (response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }
 
    const updateAmount = (arrayPrice, totalAmmountElement) => {

      // console.log(selectedServices);
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

  // Отправка данных селектов и создание элементов на основе полученных данных 
  const handleFormSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8081/site/templates/mocks/repair-calculate-categories.json')
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        formSummaryContainer.style.display = "block";
        categoriesList.innerHTML = '';
        json.forEach((category) => {
          categoriesList.insertAdjacentHTML(
            'beforeend',
            `<li class="form-summary__item-categories categories__item">
                <button class="form-summary__button-category categories__button" data-id=${category.id}>
                  <div class="categories__picture-wrapper"><img class="categories__image" src="/site/templates/img/diagnostick.svg"></div>
                  <div class="categories__title-wrapper">
                    <h3 class="categories__title-category">${category.name}</h3>
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
      } else {
        button.classList.toggle('categories__button--active');
      }
    });

    const buttonId = event.target.closest('button.form-summary__button-category');

    // let data = {
    //   model: form.elements.models.value,
    //   brand: form.elements.brands.value,
    //   year: form.elements.years.value,
    //   id : buttonId.dataset.id
    // };

    fetch(`http://localhost:8081/site/templates/mocks/repair-calculate-services-${buttonId.dataset.id}.json`// , {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8"
      //   }
      // }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        servicesList.innerHTML = '';
        json.map((service) => {
          let _id = null;

          if (selectedServicesId.length > 0) {
            _id = selectedServicesId.find((id) => {
              return id == service.id;
            });
          }

          if (!_id) {
            servicesList.insertAdjacentHTML(
              'beforeend',
              `<li class="form-summary__item repair-services__item"  data-category-id="${buttonId.dataset.id}" data-service-id="${service.id}">
                <div class="form-summary__checkbox-block"> 
                  <div class="form-summary__checkbox-wrapper repair-services__checkbox-wrapper"> 
                      <label class="form-summary__label">
                        <input class="form-summary__checkbox repair-services__checkbox" type="checkbox" value=${service.price}>
                        <div class="form-summary__checkbox-text"></div>
                      </label>
                  </div>
                  <div class="form-summary__description-wrapper repair-services__description-wrapper">
                    <p class="form-summary__description repair-services__description">${service.name}</p>
                  </div>
                  <div class="form-summary__price-wrapper repair-services__price-wrapper">
                    <p class="form-summary__price repair-services__price">${service.price}₽</p>
                  </div>
                </div>
                <div class = "form-summary__radio-wrapper repair-services__radio-wrapper">
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="light" name="radio${service.price}">
                    Легкая степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="normal" name="radio${service.price}">
                    Средняя степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="hard" name="radio${service.price}">
                    Тяжелая степень повреждения
                    <div class="form-summary__radio-text"></div>
                  </label>
                  <label class = "form-summary__label form-summary__radio-label">
                    <input class = "form-summary__radio repair-services__radio" type="radio" data-power="change" name="radio${service.price}">
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
    const radio = event.target.closest('input[type="radio"]');
    const checkbox = event.target.closest('input[type="checkbox"]');


    if (checkbox != null) {
      const li = checkbox.closest('li');
      const value = checkbox.value;
      const serviceId = li.dataset.serviceId;
      const activeCategoryElement = document.querySelector('.categories__button--active');

      if (checkbox.checked == true) {
        selectedServicesPrice.push(value);
        selectedServicesId.push(serviceId);

        resultsList.append(li);

        updateAmount(selectedServicesPrice , totalAmmount);
      } else {
        selectedServicesPrice.splice(selectedServicesPrice.indexOf(value), 1);

        selectedServicesId.splice(selectedServicesId.indexOf(serviceId), 1);

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
    }
  }



  categoriesList.addEventListener("click", handleCategoryClick);
  contentContainer.addEventListener('click', handleServices);
  // Браузер полностью загрузил HTML, теперь можно выполнять функции
  document.addEventListener("DOMContentLoaded", handleFormSubmit);

}
