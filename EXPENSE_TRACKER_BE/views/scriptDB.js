
const form = document.getElementById('myform');

//userlist
const expenselist = document.getElementById('expenselist');

const addExpButton = document.getElementById('addExpButton');

const premiumButton = document.getElementById('rzp-button');

const messageDiv = document.getElementById('messageDiv');

const premiumFeaturesDiv = document.getElementById('premiumFeaturesDiv');

const userlist = document.getElementById('userlist');

let expenses = [];

var url = "http://localhost:5000";

//event listner1
form.addEventListener('submit',addExpense);

//event DOMreload
window.addEventListener('DOMContentLoaded',async ()=>{

    
    try{
        
       const token = localStorage.getItem('token');
       const prom1 = await axios.get(`${url}/expenses`, {headers: {Authorization: token} })
       const prom2 = await axios.get(`${url}/premium/check`, {headers: {Authorization: token} })
       expenses = prom1.data.Expenses;
       Promise.all([prom1,prom2]).then((values) => {

            console.log(values[0].data);
            console.log(values[1].data);
            if(values[1].data.isPremium){

                premiumButton.style.display = 'none';
                messageDiv.innerHTML = `You are a premium user !`;
                premiumFeatures();
                //

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

function premiumFeatures(){
    
    const leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.innerText = 'Show Leaderboard';

    const monthlyButton = document.createElement('button');
    monthlyButton.id = 'monthlyButton';
    monthlyButton.innerText = 'Monthly Expenses';
    

    const yearlyButton = document.createElement('button');
    yearlyButton.id = 'yearlyButton';
    yearlyButton.innerText = 'Yearly Expenses';

    const downloadexp = document.createElement('button');
    downloadexp.id = 'downloadexp';
    downloadexp.innerText = 'Download Expenses';

    premiumFeaturesDiv.prepend(leaderboardButton,monthlyButton,yearlyButton,downloadexp);


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

    monthlyButton.addEventListener('click',()=>{

        //convert expenses array to monthly expenses array and display as html table
        let monthlyExpenses = [];
        let curdate = new Date();
        let month = curdate.getMonth();

        for(let i=0;i<expenses.length;i++){

            let postdate = new Date(expenses[i].createdAt);
            let postmonth = postdate.getMonth();
            if(postmonth == month){

                monthlyExpenses.push(expenses[i]);
            }

        }
        if (document.getElementsByTagName("table").length === 0) {
                
                let table = document.createElement("table");
                // create table head with column names
                let headRow = document.createElement("tr");
                let dateHeading = document.createElement("th");
                let descriptionHeading = document.createElement("th");
                let categoryHeading = document.createElement("th");
                let expenseHeading = document.createElement("th");
                
                dateHeading.innerHTML = "Date";
                descriptionHeading.innerHTML = "Description";
                categoryHeading.innerHTML = "Category";
                expenseHeading.innerHTML = "Expense";
                
                headRow.appendChild(dateHeading);
                headRow.appendChild(descriptionHeading);
                headRow.appendChild(categoryHeading);
                headRow.appendChild(expenseHeading);
                table.appendChild(headRow);
                let totalExpense = 0;
                
                for (let i = 0; i < monthlyExpenses.length; i++) {
                  let row = document.createElement("tr");
                  let dateCell = document.createElement("td");
                  let descriptionCell = document.createElement("td");
                  let categoryCell = document.createElement("td");
                  let expenseCell = document.createElement("td");
                
                  let date = new Date(monthlyExpenses[i].createdAt);
                  let dateString = date.toDateString();
                  dateCell.innerHTML = dateString;
                  descriptionCell.innerHTML = monthlyExpenses[i].description;
                  categoryCell.innerHTML = monthlyExpenses[i].category;
                  expenseCell.innerHTML = monthlyExpenses[i].expenseval;
                
                  row.appendChild(dateCell);
                  row.appendChild(descriptionCell);
                  row.appendChild(categoryCell);
                  row.appendChild(expenseCell);
                  table.appendChild(row);
                  totalExpense += monthlyExpenses[i].expenseval;
                
                }
                // create total row
                let totalRow = document.createElement("tr");
                let totalCell = document.createElement("td");
                totalCell.innerHTML = "Total:";
                totalCell.colSpan = 3; // merge cells in the first column
                totalRow.appendChild(totalCell);
            
                let totalAmountCell = document.createElement("td");
                totalAmountCell.innerHTML = totalExpense;
                totalRow.appendChild(totalAmountCell);
            
                table.appendChild(totalRow);
            
                premiumFeaturesDiv.appendChild(table);

        }

        

    })

    yearlyButton.addEventListener('click',()=>{

        let yearlyExpenses = [];
        let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];

        for (let i = 0; i < expenses.length; i++) {
          let date = new Date(expenses[i].createdAt);
          let month = date.getMonth() + 1; // months are zero-indexed
          let year = date.getFullYear();
          let monthString = month.toString().padStart(2, "0"); // pad month with leading zero
          let key = `${year}-${monthString}`;
        
          if (!yearlyExpenses[key]) {
            // create new month if it does not exist
              yearlyExpenses[key] = {
              month: month,
              expenses: expenses[i].expenseval
            };
          } else {
            // add expenses for existing month
            yearlyExpenses[key].expenses += expenses[i].expenseval;
          }
        }

        // convert object to array
        yearlyExpenses = Object.values(yearlyExpenses);

        // sort array by year and month
        yearlyExpenses.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          } else {
            return a.month - b.month;
          }
        });

        console.log(yearlyExpenses);
        let div = document.getElementById("premiumFeaturesDiv");

        let table = document.createElement("table");

        // create table head with column names
        let headRow = document.createElement("tr");
        let monthHeading = document.createElement("th");
        let expensesHeading = document.createElement("th");

        monthHeading.innerHTML = "Month";
        expensesHeading.innerHTML = "Expenses";

        headRow.appendChild(monthHeading);
        headRow.appendChild(expensesHeading);
        table.appendChild(headRow);

        // create table rows with cells for each month
        for (let i = 0; i < yearlyExpenses.length; i++) {
          
          let row = document.createElement("tr");
          let monthCell = document.createElement("td");
          let expensesCell = document.createElement("td");
        
          monthCell.innerHTML = monthNames[yearlyExpenses[i].month - 1]; // get month name from array
          expensesCell.innerHTML = yearlyExpenses[i].expenses;
          row.appendChild(monthCell);
          row.appendChild(expensesCell);
          table.appendChild(row);
        }
        div.appendChild(table);



    
    })
}
   


