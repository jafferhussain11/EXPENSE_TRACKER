
const loginbtn = document.getElementById('loginbtn');

loginbtn.addEventListener('click', (e) => {
    // Get the values of the input elements
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Send a POST request to the server with the input values as the request body
    axios.post('http://localhost:5000/login', {
    
      email,
      password
    })
    .then(response => {
   
        //alert(response.data.message);
        //store token in local storage
        console.log(response);
        localStorage.setItem('token', response.data.token);
        //window.location.reload();
        window.location.href = "http://localhost:5000/expenses.html";
      
    })
    .catch(error => {
      alert(error.response.data.message);
    });
  });
  