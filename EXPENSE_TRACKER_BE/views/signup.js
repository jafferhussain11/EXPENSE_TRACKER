
const submitbtn = document.getElementById('submitbtn');

submitbtn.addEventListener('click', (e) => {
    // Get the values of the input elements
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Send a POST request to the server with the input values as the request body
    axios.post('http://13.233.133.166:5000/signup', {
      name,
      email,
      password
    })
    .then(response => {
      // Check the status of the response
   
        alert(response.data.message);
       // send to login page
       window.location.href='http://13.233.133.166:5000/login.html';
      
    })
    .catch(error => {
      // Log the error to the console
      alert(error.response.data.message);
    });
  });
  