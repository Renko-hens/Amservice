import validator from 'validator';

const calculatorTechView = document.querySelector('.calculator-technical-view');

if(calculatorTechView) {

  const form = document.querySelector('.calculator-technical-view__form');
  const formResults = document.querySelector('.form-communication');

  const repairSelectModel = document.querySelector('#formControlSelectModel');
  const repairSelectModification = document.querySelector('#formControlSelectModification');
  const repairSelectMileage = document.querySelector('#formControlSelectMileage');

  const email = formResults.elements.inputEmail;
  const phone = formResults.elements.inputPhone;
  const name = formResults.elements.inputName;
  const comments = formResults.elements.comments.value;

  const formSummaryContainer = document.querySelector('.form-summary__container');
  const calculatorTechViewContainer = document.querySelector('.calculator-technical-view__container');
  // const contentContainer = document.querySelector('.form-summary__wrapper');

  const worksBodyTable = document.querySelector('.form-summary__tbody');
  const modalResults = document.querySelector('.modal-body');

  const formResultsButtonElement = document.querySelector('.form-communication__button');
  const servicesButtonElement = document.querySelector('.form-calculate__button');
  const materialsPriceElement = document.querySelector('.materials-price-amount');
  const worksPriceElement = document.querySelector('.works-price-amount');
  const totalAmmountElement = document.querySelector('.total-price-amount');

  const worksPrice = [];
  const materialsPrice = [];
  let totalAmmountPrice = [];
  const table = [];

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
  const createLoader = ( item ) => {
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


  const updateAmount = (arrayPrice , totalAmmountElement) => {
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
    getMileageById(id);
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


  // Запрос на получение списка модели автомобиля (данные для первого селекта)
  const getMarks = () => {
    fetch('https://amservice.unilead.team/api/calculators/post/technical_inspection/marks/', {
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
      
        fillSelectElement(repairSelectModel, options);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Запрос на получение списка модификации по ID(данные для второго селекта))
  const getModelsById = (id) => {

    if (!id) {
      emptySelectElement(repairSelectModification);
      emptySelectElement(repairSelectMileage);
      disabledButton(servicesButtonElement);
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
      .then(function(json) {
        cleanSelectElement(repairSelectModification);
        emptySelectElement(repairSelectMileage);
        const options = json.response.map((el) => {
          const option = document.createElement('option');
          option.textContent = el.title;
          option.value = el.id;
          return option;
        });
      
        fillSelectElement(repairSelectModification, options);
      })
      .catch(function(error) {
        console.error(error);
      });
    }


  // Запрос на получение списка пробега по ID модификации
  const getMileageById = (id) => {
    if (!id) {
      emptySelectElement(repairSelectMileage);
      disabledButton(servicesButtonElement);
      return;
    };
    
    let dataMileage = {
      "modelID": id
    };
    
    fetch(`https://amservice.unilead.team/api/calculators/post/technical_inspection/mileage/`, {
      method: 'POST',
      body: JSON.stringify(dataMileage),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(function(json) {
        cleanSelectElement(repairSelectMileage);
        
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
        
        fillSelectElement(repairSelectMileage, options);
      })
      .catch(function(error) {
        console.error(error);
      });
    }

  // Отправка данных селектов и создание элементов на основе полученных данных 
  const handleFormSubmit = (event) => {
    event.preventDefault();

    disabledButton(servicesButtonElement);
    createLoader(calculatorTechViewContainer);

    const form = event.target;
    let data = {
      modelID: form.elements.modif.value,
      mileage: form.elements.mileage.value,
    };


    fetch('https://amservice.unilead.team/api/calculators/post/technical_inspection/services/' ,{
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
        worksBodyTable.innerHTML = '';
        formSummaryContainer.style.display = "block";

        worksPrice.splice(0, worksPrice.length);
        materialsPrice.splice(0, materialsPrice.length);
        
        json.response.forEach((work) => {
            worksBodyTable.insertAdjacentHTML(
              'beforeend',
              ` 
              <tr class="form-summary__tbody-tr">
                <td class="form-summary__tbody-td" data-work-id="${work.id}">${work.title}</td>
                <td class="form-summary__tbody-td">${work.price} ₽</td>
                <td class="form-summary__tbody-td" data-material-id="${work.materials.id}">${work.materials.title}</td>
                <td class="form-summary__tbody-td">${work.materials.price} ₽</td>
                <td class="form-summary__tbody-td">${work.materials.maker}</td>
              </tr>
              `
            );

            const operation = {};
            const stuff = {};
            
            operation.price = work.price;
            operation.title = work.title;
            operation.id = work.id;
            operation.materials = [];
            operation.materials.push(stuff);

            stuff.price = work.materials.price;
            stuff.title = work.materials.title;
            stuff.id = work.materials.id;
            stuff.maker = work.materials.maker;

            table.push(operation);
            materialsPrice.push(work.materials.price);
            worksPrice.push(work.price);
        }
        )
      })
      .then(() =>{
        updateAmount(worksPrice, worksPriceElement);
        updateAmount(materialsPrice, materialsPriceElement);

        totalAmmountPrice = worksPrice.concat(materialsPrice);
        updateAmount(totalAmmountPrice, totalAmmountElement);
      })
      .then(() => {
        deleteLoader(calculatorTechViewContainer);
      })
      .catch((error) => {
        console.error(error);
      })
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
      formId.append('model',  form.elements.model.value);
      formId.append('modification',  form.elements.modif.value);
      formId.append('mileage',  form.elements.mileage.value);
      formId.append('worksId', JSON.stringify(table));
      formId.append('pageId', pageId.value);
      formId.append('pageTitle', pageTitle.value);
      formId.append('totalAmmount', updateAmount(totalAmmountPrice, totalAmmountElement));

      // let data = {
      //   name: formResults.elements.inputName.value,
      //   email: formResults.elements.inputEmail.value,
      //   phone: formResults.elements.inputPhone.value,
      //   worksId : table,
      //   model: form.elements.model.value,
      //   modification: form.elements.modif.value,
      //   mileage: form.elements.mileage.value
      // };

      fetch('https://amservice.unilead.team/api/forms/post/calculator_technical_inspection/', {
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
            comments.value = '';
            disabledButton(formResultsButtonElement);
            modalForm.style.display = 'block';
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
        })
    }

  repairSelectModel.addEventListener('change', handleSelect1);
  repairSelectModification.addEventListener('change', handleSelect2);
  repairSelectMileage.addEventListener('change', handleSelect3);

  form.addEventListener('submit', handleFormSubmit);
  formResults.addEventListener('submit', handleResultsFormSubmit);

  name.addEventListener('change', handleValidator);
  email.addEventListener('change', handleValidator);
  phone.addEventListener('change', handleValidator);

    // Браузер полностью загрузил HTML, теперь можно выполнять функции
  document.addEventListener("DOMContentLoaded", getMarks);
}