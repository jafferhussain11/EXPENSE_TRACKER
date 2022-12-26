//clears local storage on page reload
//window.onload = window.localStorage.clear();
//form
const form = document.getElementById('myform');
//userlist
const userList = document.getElementById('userlist');
//crudURDL
var url = "https://crudcrud.com/api/f312afa3fd2848d1ba04fcd9463de4cd/expense_tracker";
//event listner1
form.addEventListener('submit',addUser);

//event listner2
window.addEventListener('DOMContentLoaded',()=>{

    axios.get(url)
    .then((res)=>{

        console.log(res.data);//array of objects
        for(let i=0 ;i < res.data.length; i++){

            displayData(res.data[i]);
        }
        
    });
   
})



function addUser(event){

    
    event.preventDefault();
    let data = {

        expenseval : event.target.expenseval.value,
        desc: event.target.desc.value,
        cat: event.target.cat.value
    }
    //let data_serial = JSON.stringify(data);//converting to JSON string
    
    function postData(data){

        
        return new Promise((resolve,reject)=>{

                    axios.post(url,data)
                    .then((res)=>{
                        
                        console.log(res.data);
                        displayData(res.data);
                        
                    })
                    .catch((err)=>console.log(err));
                });
            
        
    }
   postData(data);
    // let resp = checkifpresent(data.cat);
    // if(resp){
        
    //     localStorage.setItem(data.cat,data_serial);
    //     displayData(data);
    // }else{

    //     alert("Category of Expense already added!");
    // }
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
function deleteUser(id){

    const liToDelete = userList.querySelector('[id="'+id+'"]');//grabbing the li element

    //localstorage delete
    //localStorage.removeItem(cat);
    //CRUDCRUD DELETE
    //console.log(id);
    axios({
                    
            method: 'delete',
            url : `https://crudcrud.com/api/f312afa3fd2848d1ba04fcd9463de4cd/expense_tracker/${id}`

    })
    .then(liToDelete.remove())
    .catch((err)=>console.log(err));

}
        

    
    //liToDelete.remove();


// function checkifpresent(cat){

//     if(localStorage.getItem(cat) === null) return true;
//     else return false;


// }