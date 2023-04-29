document.getElementById('myForm').addEventListener('submit',addExpense)

expenseList=document.getElementById('expenseList');



let item=document.getElementById('item')
let expense=document.getElementById('expense')
let category=document.getElementById('category')
let description =document.getElementById('description')


window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const token = localStorage.getItem('token')
        let getReq =await axios.get("http://localhost:3000/expense/getExpenses", {headers: {'Authorization': token}})

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
            const token = localStorage.getItem('token')
            let postReq= await axios.post("http://localhost:3000/expense/addExpense",obj, {headers: {'Authorization': token}})
            
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
        
        editBtn.className='edit-btn btn btn-right'
        
        editBtn.appendChild(document.createTextNode('Edit Expense'))
        
        

        const delBtn=document.createElement('button')
        
        delBtn.className='btn btn-danger  btn-right btn-sm '
        
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
    

document.getElementById('rzp-btn1').onclick = async function(e) {
 try{
    const token = localStorage.getItem('token')
    let response = await axios.get("http://localhost:3000/purchase/premium", {headers: {'Authorization': token}})
    let options = {
    "key": response.data.key_id,
    "orderId": response.data.order.id,
    "handler": async function(response) {
        await axios.post("http://localhost:3000/purchase/update-transaction",{
            orderId: options.orderId,
            payment_id: response.razorpay_payment_id,
        },{headers: {'Authorization': token}})

        alert('you are a premium user now')
    }
}
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault;

rzp1.on('payment.failed',async function(){
    try{
        
        const resp=await axios.post("http://localhost:3000/purchase/update-transaction",{
                "orderId":response.data.order.id,
                "payment_id":null
            },{headers:{"Authorization":token} })
            
            alert('something went wrong')
            
        

    }catch(err){
        console.log(err)
        throw new Error(JSON.stringify(err))
    }
})
 }catch(err){
    throw new Error(JSON.stringify(err))
 }   

}