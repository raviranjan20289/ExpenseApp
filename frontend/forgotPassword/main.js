document.getElementById('forgotForm').addEventListener('submit',forgotPassword)
const email= document.getElementById('email')

async function forgotPassword(e){
    try{
        e.preventDefault()
        const obj={
            email:email.value
        }
       
        
        const data = await axios.post('http://localhost:3000/password/forgotpassword',obj)
        console.log(data)

    }catch(err){
        console.log(err)
        throw new Error(JSON.stringify(err))
    }
}