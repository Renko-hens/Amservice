const calculatorTechView = document.querySelector('.calculator-technical-view');
const form = document.querySelector('.calculator-repair__form');
const formResults = document.querySelector('.form-communication');

const repairSelectModel = document.querySelector('#formControlSelectModel');
const repairSelectModification = document.querySelector('#formControlSelectModification');
const repairSelectMileage = document.querySelector('#formControlSelectMileage');

const formSummaryContainer = document.querySelector('.form-summary__container');
const calculatorTechViewContainer = document.querySelector('.calculator-technical-view__container');
const contentContainer = document.querySelector('.form-summary__wrapper');

const servicesButtonElement = document.querySelector('.form-calculate__button');
const modalResults = document.querySelector('.modal-body');


if(calculatorTechView) {

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
  'beforeend',`
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





// Запрос на получение списка модели автомобиля (данные для первого селекта)
const getModels = () => {

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
    
      fillSelectElement(repairSelectModel, options);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Запрос на получение списка модификации по ID(данные для второго селекта))
const getModificationById = (id) => {

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
  

// Обработка change-события первого селекта
const handleSelect1 = (event) => {
  const id = event.target.value;
  getModificationById(id);
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

repairSelectModel.addEventListener('change', handleSelect1);
repairSelectModification.addEventListener('change', handleSelect2);
repairSelectMileage.addEventListener('change', handleSelect3);

  // Браузер полностью загрузил HTML, теперь можно выполнять функции
document.addEventListener("DOMContentLoaded", getModels);

}