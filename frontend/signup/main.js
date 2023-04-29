document.getElementById('signUpForm').addEventListener('submit',addUser)
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const password = document.getElementById('password')



async function addUser(e){
    try{
        e.preventDefault();
        let obj ={
            name:nameInput.value,
            email:emailInput.value,
            password:password.value
        }
        const response = await axios.post("http://localhost:3000/user/signup",obj)
        if(response.data.errors[0].message==='email must be unique'){
            alert('User already exists')
        }
        console.log(response);
    }catch(err){
        console.log(err)
    }

}