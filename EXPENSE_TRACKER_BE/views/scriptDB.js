
const form = document.getElementById('myform');

//userlist
const expenselist = document.getElementById('expenselist');

const addExpButton = document.getElementById('addExpButton');

const premiumButton = document.getElementById('rzp-button');

const messageDiv = document.getElementById('messageDiv');

const leaderboardcontent = document.getElementById('leaderboardcontent');

const userlist = document.getElementById('userlist');


var url = "http://localhost:5000";

//event listner1
form.addEventListener('submit',addExpense);

//event DOMreload
window.addEventListener('DOMContentLoaded',async ()=>{

    
    try{
        
       const token = localStorage.getItem('token');
       const prom1 = await axios.get(`${url}/expenses`, {headers: {Authorization: token} })
       const prom2 = await axios.get(`${url}/premium/check`, {headers: {Authorization: token} })
       Promise.all([prom1,prom2]).then((values) => {

            console.log(values[0].data);
            console.log(values[1].data);
            if(values[1].data.isPremium){

                premiumButton.style.display = 'none';
                messageDiv.innerHTML = `You are a premium user !`;
                leaderboard();

            }else{

                premiumButton.style.display = 'block';
            }
            for(let i=0;i<values[0].data.Expenses.length;i++){

                displayData(values[0].data.Expenses[i]);
            }
        })
    }  
    catch(err){
        console.log(err);
    }

});



function addExpense(event){

    
    event.preventDefault();
    let data = {

        expenseval : event.target.expenseval.value,
        desc: event.target.desc.value,
        cat: event.target.cat.value
    }

    async function postData(data){

        try{

            const prom = await axios.post(`${url}/addexpense`,data);
            console.log(prom.data);
            displayData(prom.data.value); //prom.data.value recieves the data from the server including the id and passed to displayData function !
        }
        catch(err){

            alert(err.response.message);

        }
    }
   postData(data);
    
}
    
function displayData(data){

    let li = document.createElement('li');
    li.setAttribute('id',data.id); // setting this att value for the new li item helps us to grab an html element and delete it
    li.innerHTML =`${data.expenseval}   ${data.description}  ${data.category}
     <button id="edit" onClick=editExpense('${data.expenseval}','${data.description}','${data.category}','${data.id}')>edit</button> 
     <button id="delete" onClick=deleteExpense('${data.id}')>delete</button>`;
    expenselist.appendChild(li);
    console.log(data);

}

function editExpense(expenseval,desc,cat,id){

    //copyback to text fields
    document.getElementById('expenseval').value = expenseval;
    document.getElementById('desc').value = desc;
    document.getElementById('cat').value = cat;

    deleteExpense(id);
}
async function deleteExpense(id){

    const liToDelete = expenselist.querySelector('[id="'+id+'"]');//grabbing the li element

    try{

        const prom = await axios.delete(`${url}/deletexpense/${id}`);
        liToDelete.remove();

    }
    catch(err){
        console.log(err);
    }
}

document.getElementById('rzp-button').onclick = async function(e){

    const token = localStorage.getItem('token');
    const prom = await axios.get(`${url}/premium`, {headers: {Authorization: token} })
   
    var options = {
       
        "key" : prom.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id" : prom.data.order.id,
        "handler" :  async function (response){

            await axios.post(`${url}/premium`,
            {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,}
                ,{headers: {Authorization: token} })

            alert("You are Now A premium Member !");
            premiumButton.style.display = 'none';
            messageDiv.innerHTML = `You are a premium user ! <br><br>`;
            //leaderboard();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    
    rzp1.on('payment.failed', async function (response){

        console.log(response);
        await axios.post(`${url}/premium`,
        {
            razorpay_order_id: response.error.metadata.order_id},
            {headers: {Authorization: token}
        })
        alert("Payment Failed !");
    });
}

function leaderboard(){
    
    const leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.innerText = 'Show Leaderboard';
    leaderboardcontent.prepend(leaderboardButton);
    leaderboardButton.addEventListener('click',()=>{
        
        axios.get(`${url}/premium/leaderboard`)
        .then((res) => {
          console.log(res.data);
          res.data.leaderboard.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `User: ${item.name} - Total Expenses: ${item.amount}`;
            userlist.appendChild(li);
          });
        leaderboardButton.style.display = 'none';
        }).catch((err) => {
          console.log(err);
        });
       
    })

}
   


