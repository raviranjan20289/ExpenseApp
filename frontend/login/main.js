document.getElementById('loginForm').addEventListener('submit',userLogin)
const emailInput = document.getElementById('email');
const password = document.getElementById('password')



async function userLogin(e){
    try{
        e.preventDefault();
        let obj ={
            
            email:emailInput.value,
            password: password.value
            
        }
         const response = await axios.post("http://localhost:3000/user/login",obj)
        
         console.log(response.status)
         if(response.status===201){
            alert('User Login Successful')
         }

        //  console.log(response.headers)
        
    }catch(err){
        
        console.log(err
            )
    }

}