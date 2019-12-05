const calculatorRepair = document.querySelector('.calculator-repair');
const calculatorRepairContainer = document.querySelector('.calculator-repair__container');
const form = document.querySelector('.calculator-repair__form');
const formResults = document.querySelector('.selected-services__list');
const repairSelectMark = document.querySelector('#formControlSelectMark');
const repairSelectModel = document.querySelector('#formControlSelectModel');
const repairSelectYears = document.querySelector('#formControlSelectYears');
const contentElement = document.querySelector('.form-summary__wrapper');
const servicesElement = document.querySelector('.repair-services__list');
const resultsElement = document.querySelector('.selected-services__list');
const servicesButtonElement = document.querySelector('.form-calculate__button');
const selectedServices = [];


// Проверка на то что запрос не пидр
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


const cleanSelectElement = (selectElement) => {
  selectElement.innerHTML = '<option value="">Выберите параметры</option>';
}


const includeButton = (buttonElement) => {
    buttonElement.disabled = false;
}


const disabledButton = (buttonElement) => {
    buttonElement.disabled = true;
}


const createLoader = (parentInsert , lastChild) => {
  parentInsert.insertAdjacentHTML(
    'beforeend',`
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    `
  );
  
  lastChild.classList.add('contact-us__wrapper--loader');
}


const deleteLoader = (lastChild) => {
  let loader = document.querySelector('.lds-ring')
  loader.remove();

  lastChild.classList.remove('contact-us__wrapper--loader');
}


// Отправка данных селектов и создание чекбоксов на основе полученных данных 
const handleFormSubmit = (event) => {
  event.preventDefault();

  disabledButton(servicesButtonElement)
  createLoader(calculatorRepair, calculatorRepairContainer);
  
  const form = event.target;
  
  let data = {
    model: form.elements.models.value,
    brand: form.elements.brands.value,
    year: form.elements.years.value,
    services: [
        {
          id: 221,
          name: "Диагностика экрана",
          price: 2000
        },
        {
          id: 222,
          name: "Мощность",
          price: 2000
        }
      ]
  };
    
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(handleErrors)
  .then(response => response.json())
  .then((json) => {
    servicesElement.innerHTML = '';
    json.services.forEach((service) => {
      servicesElement.insertAdjacentHTML(
        'beforeend',
        `<li class="form-summary__item repair-services__item">
          <div class="form-summary__checkbox-wrapper repair-services__checkbox-wrapper"> 
            <label class="form-summary__label">
              <input class="form-summary__checkbox repair-services__checkbox" type="checkbox" value=${service.id}>
              <div class="form-summary__checkbox-text"></div>
            </label>
          </div>
          <div class="form-summary__description-wrapper repair-services__description-wrapper">
            <p class="form-summary__description repair-services__description">${service.name}</p>
          </div>
          <div class="form-summary__price-wrapper repair-services__price-wrapper">
            <p class="form-summary__price repair-services__price">${service.price}₽</p>
          </div>
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


// Отправка выбранных чекбоксов и данных пользователя 
const handleResultsFormSubmit = (event) => {
  event.preventDefault();
  
  const form = event.target;
  
  let data = {
    name: 'Renko Hens',
    services: selectedServices
  };
    
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(handleErrors)
  .then(response => response.json())
  .then((json) => {
    formResults.innerHTML = 'Thank you! Pidr!'; // json.message
  })
  .catch((error) => {
    console.error(error);
  })
}


// Обработка чекбоксов и формирование массива с выбранными значениями
const handleServices = (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  
  if (checkbox != null) {
    const li = checkbox.closest('li');
    const value = checkbox.value;
    
    if (checkbox.checked) {
      checkbox.c
      selectedServices.push(value);
      resultsElement.append(li);
    } else {
      selectedServices.splice(selectedServices.indexOf(value), 1);
      servicesElement.append(li);
    }
  };
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
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const options = json.response.map((el) => {
        const option = document.createElement('option');
        option.textContent = el.title;
        option.value = el.id;
        return option;
      });
    
      fillSelectElement(repairSelectMark, options);
    })
    .catch(function(error) {
      console.error(error);
    });
}


// Запрос на получение списка марок по ID(данные для второго селекта))
const getModelsById = (id) => {
  if (!id) {
    emptySelectElement(repairSelectModel);
    emptySelectElement(repairSelectYears);
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
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const options = json.response.map((el) => {
        cleanSelectElement(repairSelectModel);
        emptySelectElement(repairSelectYears);
        const option = document.createElement('option');
        option.textContent = el.title;
        option.value = el.id;
        return option;
      });
    
      fillSelectElement(repairSelectModel, options);
    })
    .catch(function(error) {
      console.error(error);
    });
}


// Запрос на получение списка Годов по ID марки
const getYearsById = (id) => {
  if (!id) {
    emptySelectElement(repairSelectYears);
    disabledButton(servicesButtonElement);
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
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const options = json.response.map((el) => {
        cleanSelectElement(repairSelectYears);
        const option = document.createElement('option');
        option.textContent = el;
        option.value = el;
        return option;
      });
      
      fillSelectElement(repairSelectYears, options);
    })
    .catch(function(error) {
      console.error(error);
    });
}


repairSelectMark.addEventListener('change', handleSelect1);
repairSelectModel.addEventListener('change', handleSelect2);
repairSelectYears.addEventListener('change', handleSelect3);
form.addEventListener('submit', handleFormSubmit);
contentElement.addEventListener('click', handleServices);
formResults.addEventListener('submit', handleResultsFormSubmit);

// Браузер полностью загрузил HTML, теперь можно выполнять функции
document.addEventListener("DOMContentLoaded", getBrands);
