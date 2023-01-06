const forgotpassword = document.getElementById('forgotpassword');

forgotpassword.addEventListener('click', (e) => {

    // Get the values of the input elements
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (email == "") {
      alert("Please enter your email");
      return;
    }
   
    // Send a POST request to the server with the input values as the request body
    axios.post('http://localhost:5000/forgotpassword', {
      email,
    })
    .then(response => {
      // Check the status of the response
      alert(response.data.message);
      // send to login page
      window.location.href='http://localhost:5000/login.html';
    })
    .catch(error => {
      // Log the error to the console
      alert(error.response.data.message);
    });
});

