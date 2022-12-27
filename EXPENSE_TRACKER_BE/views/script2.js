
const form = document.getElementById('myform');

//userlist
const userList = document.getElementById('userlist');

//crudURDL
var url = "https://crudcrud.com/api/f312afa3fd2848d1ba04fcd9463de4cd/expense_tracker";

//event listner1
form.addEventListener('submit',addUser);

//event DOMreload
window.addEventListener('DOMContentLoaded',async ()=>{

    
    try{
        
       const prom = await axios.get(url);
       for(let i=0 ;i < prom.data.length; i++){

            displayData(prom.data[i]);
       }
        
    }  
    catch(err){
        console.log(err);
    }

});



function addUser(event){

    
    event.preventDefault();
    let data = {

        expenseval : event.target.expenseval.value,
        desc: event.target.desc.value,
        cat: event.target.cat.value
    }
    
    async function postData(data){

        try{

            const prom = await axios.post(url,data);
            displayData(prom.data);
        }
        catch(err){
            console.log(err);
        }
    }
   postData(data);
    
}
    
function displayData(data){

    let li = document.createElement('li');
    li.setAttribute('id',data._id); // setting this att value for the new li item helps us to grab an html element and delete it
    li.innerHTML =`${data.expenseval}   ${data.desc}  ${data.cat}
     <button id="edit" onClick=editUser('${data.expenseval}','${data.desc}','${data.cat}','${data._id}')>edit</button> 
     <button id="delete" onClick=deleteUser('${data._id}')>delete</button>`;
    userList.appendChild(li);
    console.log(data);

}

function editUser(expenseval,desc,cat,id){

    //copyback to text fields
    document.getElementById('expenseval').value = expenseval;
    document.getElementById('desc').value = desc;
    document.getElementById('cat').value = cat;

    deleteUser(id);
}
async function deleteUser(id){

    const liToDelete = userList.querySelector('[id="'+id+'"]');//grabbing the li element

    try{

        const prom = await axios.delete(`${url}/${id}`);
        liToDelete.remove();

    }
    catch(err){
        console.log(err);
    }
}
