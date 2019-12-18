const cardsContainer = document.querySelector('#myBtnContainer');

if(cardsContainer) {
  const showMoreButton = document.querySelector('.information-card__button');

  // Проверка на то что запрос не отправлен
  const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }


  // const getCards = (event) => {
  //   event.preventDefault();
    
  //   const formPageInfo = document.querySelector('#formPageInfo');
  //   const pageId = formPageInfo.querySelector('input[name="page_id"]');
  //   const pageTitle = formPageInfo.querySelector('input[name="pageTitle"]');
  
  //   let data = {
  //     "offset":"0",
  //     "count": "12",
  //     "parent_id": pageId.value
  //   };

  //   fetch('https://amservice.unilead.team/api/content/list_item/', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8"
  //     }
  //   })
  //     .then(handleErrors)
  //     .then(response => response.json())
  //     .then((json) => {
  //       cardsContainer.innerHTML = json.response;
  //       showMoreButton.dataset.count = json.count;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     })
  // }

  const handleShowMore = (event) => {
    event.preventDefault();
    let offset = cardsContainer.querySelectorAll('.information-card');
    
    // Длина контейнера
    console.log(offset.length);

    let data = {
      "offset": offset.length,
      "count": showMoreButton.dataset.count,
      "parent_id": showMoreButton.dataset.pageId
    };

    console.log(data)

    fetch('https://amservice.unilead.team/api/content/list_item/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(handleErrors)
    .then(response => response.json())
    .then((json) => {
      console.log(json)
      if(offset.length != json.count){
        cardsContainer.insertAdjacentHTML(
          'beforeend', json.response
        );
      }
      
      offset = cardsContainer.querySelectorAll('.information-card');

      if(offset.length == json.count) {
        showMoreButton.remove();
      } 
    })
    .catch((error) => {
      console.error(error);
    })
  }

  // // Браузер полностью загрузил HTML, теперь можно выполнять функции
  // document.addEventListener("DOMContentLoaded", getCards);

  showMoreButton.addEventListener("click", handleShowMore)
}