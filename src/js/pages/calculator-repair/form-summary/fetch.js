// Fetch


// // XHR
// const requestURL = 'http://localhost:8081/site/templates/mocks/repair-calculate.json';

// function sendRequest(method, url, body = null) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url);

//     xhr.responseType = 'json'
//     xhr.setRequestHeader('Content-Type', 'application/json')
    
//     xhr.onload = () => {
//       if (xhr.status >= 400) {
//         reject(xhr.response)
//       } else {
//         resolve(xhr.response)
//       }
//     }
    
//     xhr.onerror = () => {
//       reject(xhr.response)
//     }
    
//     xhr.send(JSON.stringify(body))
//   })
// }

// // sendRequest("GET", requestURL)
// //   .then( data => console.log(data))
// //   .catch( err => console.error(err))

// const body = {
//   id : 1,
//   name: "lel"
// }

// sendRequest("POST", requestURL, body)
//   .then( data => console.log(data))
//   .catch( err => console.log(err))


const domReady = () => {
  fetch('http://localhost:8081/site/templates/mocks/repair-calculate.json')
    .then(response => response.json())
    .then(json => console.log(json));
}