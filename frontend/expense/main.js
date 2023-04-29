document.getElementById('myForm').addEventListener('submit',addExpense)

expenseList=document.getElementById('expenseList');


let item=document.getElementById('item')
let expense=document.getElementById('expense')
let category=document.getElementById('category')
let description =document.getElementById('description')


window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        let getReq =await axios.get("http://localhost:3000/expense/getExpenses")

        console.log(getReq)
        for(let i=0;i<getReq.data.expenseData.length;i++){
            displayExpense(getReq.data.expenseData[i])  
        }
    }catch(err){
        console.log(err)
        console.log("Something went wrong CODE:ERR DOM_CONT_LOADED")
    }
})

async function addExpense(e){
    try{
        
        e.preventDefault();
        let obj={
            item: item.value,
            expense: expense.value,
            category: category.value,
            description: description.value
        }
        console.log(obj)
        
        if(expense.value=='' || item.value=='' || category.value=='' || description.value==''){
            alert("Please enter all fields")
        }
        
        else{
            console.log(item)
            let postReq= await axios.post("http://localhost:3000/expense/addExpense",obj)
            console.log(postReq)
            displayExpense(postReq.data.expenseData)
            expense.value=''
            item.value=''
            category.value=''
            description.value=''
        }
    }catch(err){
        console.log(err)
        console.log("Something went wrong CODE:ERR ADD_Expense")
    }
}



async function displayExpense(obj){
    try{
        let li=document.createElement("li")

        let textNode=document.createTextNode(`Item Name: ${obj.item}  | Price: Rs ${obj.expense} | Category: ${obj.category} | Description: ${obj.description}`)

        li.appendChild(textNode)

        li.id=obj.id

        console.log(li)

        const editBtn=document.createElement('button')

        editBtn.className='edit-btn btn btn-prod'

        editBtn.appendChild(document.createTextNode('Edit Expense'))

        

        const delBtn=document.createElement('button')

        delBtn.className='btn btn-danger  btn-prod btn-sm '

        delBtn.appendChild(document.createTextNode('Delete Expense'))

        li.appendChild(delBtn);
        li.appendChild(editBtn);
        

        li.appendChild(document.createElement("br"))
        li.appendChild(document.createElement("br"))


        expenseList.appendChild(li);

        delBtn.onclick=() =>deleteExpense(obj.id);
        editBtn.onclick=()=>editExpense(obj);
        

    }catch(err){
        console.log(err)
        console.log("Something went wrong CODE:ERR DISP_Expense")
    }
}

async function editExpense(obj){
    try{
        if(confirm("Please confirm to edit")){
            expense.value=obj.expense;
            item.value=obj.item;
            description.value=obj.description;
            category.value=obj.category;


            await axios.delete(`http://localhost:3000/expense/deleteExpense/${obj.id}`)

            const child=document.getElementById(obj.id)
                console.log(child)
                console.log(child.parentElement)
                expenseList.removeChild(child)
            // let objNew={
            //     product:product.value,
            //     price:price.value,
            //     category:category.value
            // }

            

            console.log("Expense editted successfully")

        }
    }catch(err){
        console.log("Something went wrong CODE:ERR EDIT_Expense")
    }

}

async function deleteExpense(key){
    try{
        if(confirm("Press OK to confirm delete")){

            let resource=await axios.delete(`http://localhost:3000/expense/deleteExpense/${key}`)

                const child=document.getElementById(key)
                console.log(child)
                console.log(child.parentElement)
                expenseList.removeChild(child)
            }

        
    }catch(err){
        console.log(err)
      console.log("Something went wrong CODE:ERR DEL_Expense")
    }
}