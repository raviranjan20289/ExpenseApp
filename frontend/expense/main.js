document.getElementById('myForm').addEventListener('submit',addExpense)

const expenseList=document.getElementById('expenseList');

const token = localStorage.getItem('token')

const itemsPerPage = document.getElementById("itemsPerPage");

itemsPerPage.addEventListener('click',getExpense);




window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        let page=1
        let getReq =await axios.get(`http://localhost:3000/expense/getExpenses?page=${page}&items=${itemsPerPage.value}`, {headers: {'Authorization': token}})
        if(getReq.data.premium){
            document.getElementById('myForm').innerHTML+="<br><br>You are a Premium user "
            document.getElementById('myForm').appendChild(leaderBtn)
            document.getElementById('rzp-btn1').style.display='none';
            document.getElementById('myForm').appendChild(reportBtn)  
        }
        
        const pageData = getReq.data
        
        // console.log(getReq)
         pagination(pageData)
         
        // for(let i=0;i<getReq.data.expenseData.length;i++){

        //     displayExpense(getReq.data.expenseData[i])  
        // }
    }catch(err){
        console.log(err)
        console.log("Something went wrong CODE:ERR DOM_CONT_LOADED")
    }
})
async function getExpense(page){
    try{
        let getReq =await axios.get(`http://localhost:3000/expense?page=${page}&items=${itemsPerPage.value}`, {headers: {'Authorization': token}})
        const pageData = getReq.data;
        console.log(pageData)
        expenseCount= pageData.length;
        pagination(pageData);
    }catch(err){
        console.log("ERR in getExpense main.js_expense ",err)
        throw new Error(err);
    }
    
    
}

function pagination(obj){
    const pagination=document.getElementById('pagination');
    pagination.innerHTML="";
    if(obj.hasPrevPage){
        const btnPrev= document.createElement('button');
        btnPrev.type= "button";
        btnPrev.innerHTML= obj.prevPage;
        btnPrev.addEventListener('click',()=>getExpense(obj.prevPage))
        pagination.appendChild(btnPrev)
    }
    const btn= document.createElement('button');
    btn.type= "button";
    btn.innerHTML= `<h3>${obj.currentPage}</h3>`
    expenseList.innerHTML='';
    for(let i=0;i<obj.expenseData.length;i++){
        displayExpense(obj.expenseData[i])
    }
    console.log(obj.expenseData)
    pagination.appendChild(btn)
    if(obj.hasNextPage){
        const btnNext= document.createElement('button');
        btnNext.type= "button";
        btnNext.innerHTML= obj.nextPage;
        btnNext.addEventListener('click',()=>getExpense(obj.nextPage))
        pagination.appendChild(btnNext) 
    }
    if(obj.lastPage!=obj.currentPage){
        const lastbtn = document.createElement('button');
        lastbtn.type = 'button';
        lastbtn.innerHTML= '>>'
        lastbtn.addEventListener('click',()=>getExpense(obj.lastPage))
        pagination.appendChild(lastbtn)

    }
}


async function addExpense(e){
    try{
        e.preventDefault();
        
        let item=document.getElementById('item')
        let expense=document.getElementById('expense')
        let category=document.getElementById('category')
        let description =document.getElementById('description')
        
        let obj={
            item: item.value,
            expense: expense.value,
            category: category.value,
            description: description.value
        }
        // console.log(obj)
        
        // if(expense.value=='' || item.value=='' || category.value=='' || description.value==''){
        //     alert("Please enter all fields")
        // }
        
        // else{
            
            let postReq= await axios.post("http://localhost:3000/expense/addExpense",obj, {headers: {'Authorization': token}})
            if(postReq.data.message){
                alert(postReq.data.message)
            }
            console.log(postReq)
            

                displayExpense(postReq.data.expenseData)
            
            expense.value=''
            item.value=''
            category.value=''
            description.value=''
        // }
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
                
            expenseList.removeChild(child)

            console.log("Expense editted successfully")
            
        }
    }catch(err){
        console.log("Something went wrong CODE:ERR EDIT_Expense")
    }
    
}


async function deleteExpense(key){
    try{
        if(confirm("Press OK to confirm delete")){
            
            const delReq = await axios.delete(`http://localhost:3000/expense/deleteExpense/${key}`,{headers: {'Authorization': token}})
                
                console.log(delReq)
                
                const child=document.getElementById(key)
            
                expenseList.removeChild(child)
            }

        
    }catch(err){
        console.log(err)
      console.log("Something went wrong CODE:ERR DEL_Expense")
    }
}

const leaderBtn = document.createElement('button') 
leaderBtn.type='button'   
leaderBtn.id='leaderBoard'
leaderBtn.classList='leaderBoard btn-right'
leaderBtn.appendChild(document.createTextNode('Leaderboard'))


leaderBtn.onclick =async function leaderBoard() {
    try{
       
        const resp =await axios.get('http://localhost:3000/premium/leaderboard', {headers: {'Authorization': token}})
        // console.log(resp.data[0].name)
        document.getElementById('myForm').innerHTML+='<br><br><ul id="lBoard"><h4>Leaderboard</h4></ul>'
        const lboard=document.getElementById('lBoard')
        

        for(let i=0;i<resp.data.length;i++){
            let li=document.createElement('li')
            if(!resp.data[i].totalExpense){
                resp.data[i].totalExpense=0;
            }
            li.appendChild(document.createTextNode(`Name: ${resp.data[i].name}  Expense: ${resp.data[i].totalExpense} `));
            lboard.appendChild(li);
            
        }
    }catch(err){
        console.log("ERR_LeaderBoard Fn",err)
        throw new Error(JSON.stringify(err))

    }

}


document.getElementById('rzp-btn1').onclick = async function(e) {
 try{
    
    let response = await axios.get("http://localhost:3000/purchase/premium", {headers: {'Authorization': token}})
    let options = {
    "key": response.data.key_id,
    "orderId": response.data.order.id,
    "handler": async function(response) {
        await axios.post("http://localhost:3000/purchase/update-transaction",{
            orderId: options.orderId,
            payment_id: response.razorpay_payment_id,
        },{headers: {'Authorization': token}})
        document.getElementById('myForm').innerHTML+="<br><br>You are a Premium user "
        document.getElementById('myForm').appendChild(leaderBtn) 
        
        document.getElementById('rzp-btn1').style.display='none';

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

function displayDownloadHistory(data) {
    document.getElementById('myForm').innerHTML+=`<br><br>Download History <br><hr> `
    for(let i=0;i<data.length;i++){
        document.getElementById('myForm').innerHTML+=` <br>url:<a href=${data[i].url}> report${i+1}</a> <br> Dowloaded at ${data[i].createdAt}<br><br> <hr>`
    }
}
const reportBtn = document.createElement('button') 
reportBtn.type='button'   
reportBtn.id='report'
reportBtn.classList='report btn-right'
reportBtn.appendChild(document.createTextNode('Expense Report'))
reportBtn.style.marginRight='5px'

reportBtn.onclick = async function expenseReport(){
    try{
        
        const response = await axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
        if(response.status==200){
            console.log('resp',response)
            displayDownloadHistory(response.data.downloaded)
            const a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        }else{
            throw new Error(response.data.message)
        }
        // document.getElementById('myForm').innerHTML+='<br><br><ul id="daily"><h4>Daily Expense Report</h4></ul>'
        // document.getElementById('myForm').innerHTML+='<br><br><ul id="weekly"><h4>Weekly Expense Report</h4></ul>'
        // document.getElementById('myForm').innerHTML+='<br><br><ul id="monthly"><h4>Monthly Expense Report</h4></ul>'

    }catch(err){
        console.log(err)
        throw new Error(JSON.stringify(err))
    }
}