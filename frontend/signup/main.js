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
        console.log(response)
        if(response.data.errors && response.data.errors[0].message==='email must be unique'){
            alert('User already exists')
        }
        else if(response.data.userData.email===email.value){
            alert('user sign up successful')
            window.location.href='../login/index.html'
        }
        console.log(response);
    }catch(err){
        console.log(err)
    }

}