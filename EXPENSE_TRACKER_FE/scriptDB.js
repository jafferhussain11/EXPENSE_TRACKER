
const form = document.getElementById('myform');

//userlist
const userList = document.getElementById('userlist');


var url = "http://localhost:5000";

//event listner1
form.addEventListener('submit',addExpense);

//event DOMreload
window.addEventListener('DOMContentLoaded',async ()=>{

    
    try{
        
       const prom = await axios.get(url);
       //console.log(prom.data);
       for(let i=0 ;i < prom.data.Expenses.length; i++){

            displayData(prom.data.Expenses[i]);
       }
        
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
            //console.log(prom.data);
            displayData(prom.data.value); //prom.data.value recieves the data from the server including the id and passed to displayData function !
        }
        catch(err){

            alert(err.response.data.message);

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
    userList.appendChild(li);
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

    const liToDelete = userList.querySelector('[id="'+id+'"]');//grabbing the li element

    try{

        const prom = await axios.delete(`${url}/deletexpense/${id}`);
        liToDelete.remove();

    }
    catch(err){
        console.log(err);
    }
}
