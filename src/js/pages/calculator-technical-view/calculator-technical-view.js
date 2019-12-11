const calculatorTechView = document.querySelector('.calculator-technical-view');
const form = document.querySelector('.calculator-technical-view__form');
const formResults = document.querySelector('.form-communication');

const repairSelectModel = document.querySelector('#formControlSelectModel');
const repairSelectModification = document.querySelector('#formControlSelectModification');
const repairSelectMileage = document.querySelector('#formControlSelectMileage');

const formSummaryContainer = document.querySelector('.form-summary__container');
const calculatorTechViewContainer = document.querySelector('.calculator-technical-view__container');
const contentContainer = document.querySelector('.form-summary__wrapper');

const worksBodyTable = document.querySelector('.form-summary__tbody');
const servicesButtonElement = document.querySelector('.form-calculate__button');
const modalResults = document.querySelector('.modal-body');

const worksPrice = [];
const materialsPrice = [];

const dataWorksId = [];
const dataMaterialsId = [];

const worksPriceElement = document.querySelector('.works-price-amount');
const materialsPriceElement = document.querySelector('.materials-price-amount');
const totalAmmountElement = document.querySelector('.total-price-amount');

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

// Отправка данных селектов и создание элементов на основе полученных данных 
const handleFormSubmit = (event) => {
  event.preventDefault();

  disabledButton(servicesButtonElement);
  createLoader(calculatorTechViewContainer);

  // const form = event.target;
  // let data = {
  //   model: form.elements.models.value,
  //   brand: form.elements.brands.value,
  //   year: form.elements.years.value,
  // };

  fetch('http://localhost:8081/site/templates/mocks/technical-view-table.json'// ,{
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
      worksBodyTable.innerHTML = '';
      worksPrice.splice(0, worksPrice.length);
      materialsPrice.splice(0, materialsPrice.length);
      formSummaryContainer.style.display = "block";
      json.forEach((work) => {
        work.materials.forEach((material) => {
          worksBodyTable.insertAdjacentHTML(
            'beforeend',
            ` 
            <tr class="form-summary__tbody-tr">
              <td class="form-summary__tbody-td" data-work-id="${work.id}">${work.name}</td>
              <td class="form-summary__tbody-td">${work.price} ₽</td>
              <td class="form-summary__tbody-td" data-material-id="${material.id}">${material.name}</td>
              <td class="form-summary__tbody-td">${material.price} ₽</td>
              <td class="form-summary__tbody-td">${material.maker}</td>
            </tr>
            `
          );
          materialsPrice.push(material.price);
          dataMaterialsId.push(work.id);
        })
        worksPrice.push(work.price);
        dataWorksId.push(work.id);
      }
      )
    })
    .then(() =>{
      updateAmount(worksPrice, worksPriceElement);
      updateAmount(materialsPrice, materialsPriceElement);

      const totalAmmountPrice = worksPrice.concat(materialsPrice);
      updateAmount(totalAmmountPrice, totalAmmountElement)
    })
    .then(() => {
      deleteLoader(calculatorTechViewContainer);
    })
    .catch((error) => {
      console.error(error);
    })
}



  // Отправка выбранных чекбоксов и данных пользователя 
  const handleResultsFormSubmit = (event) => {
    event.preventDefault();

    createLoader(formResults);

    let data = {
      name: formResults.elements.inputName.value,
      email: formResults.elements.inputEmail.value,
      phone: formResults.elements.inputPhone.value,
      worksId : dataWorksId,
      materialsId : dataMaterialsId,
      model: form.elements.model.value,
      modification: form.elements.modif.value,
      mileage: form.elements.mileage.value
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
        modalResults.innerHTML = `
          <button class="close record__close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <div class="contact-us__wrapper">
            <div class="contact-us__picture-success">
              <img class="contact-us__image-success" src="site/templates/img/check.svg">
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
      })
      .catch((error) => {
        console.error(error);
      })
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

const updateAmount = (arrayPrice , totalAmmountElement) => {

  // console.log(selectedServices);
  let summary = arrayPrice.reduce((previousValue, currentValue) => {
    return (+previousValue) + (+currentValue);
  }, 0);

  totalAmmountElement.textContent = summary + " ₽";
}


repairSelectModel.addEventListener('change', handleSelect1);
repairSelectModification.addEventListener('change', handleSelect2);
repairSelectMileage.addEventListener('change', handleSelect3);

form.addEventListener('submit', handleFormSubmit);
formResults.addEventListener('submit', handleResultsFormSubmit);

  // Браузер полностью загрузил HTML, теперь можно выполнять функции
document.addEventListener("DOMContentLoaded", getModels);

}