const express =require ('express');
const cors = require('cors');
const { readFileSync } = require('fs');
const app = express()

const port = 3001;

app.use(express.json());
app.use(cors({
    origin: '*'
}));

let users = [
    {
        "email": "test1@email.com",
        "password": "password1",
        "id": Math.random(),
        date: new Date()
        },
        {
            "email": "test2@email.com",
            "password": "password2",
            "id": Math.random(),
            date: new Date()
            }
];
let emptyUsers = [];

app.post('/login', async(req,res) => {
    console.log('req.body', req.body)
    const { email, password} = req.body;
    const data = await readFileSync('./jsonData/users.json');
    const AllUserData = JSON.parse(data);
  
    const loginUser = AllUserData.find((user) => user.email=== email && user.password === password );
    console.log(loginUser)
    if(loginUser){
        loginUser.auth = `${Math.random()} ${loginUser.email} ${Math.random()}`;
        res.send({status: 200, msg: 'user loged in successfully', userData: loginUser});
    }else {
        res.send({status: 404, msg: 'User Not found'})
    }
})

app.get('/users', (req,res) => {
    
    if(users.length > 0){
        res.send({status: 200, allUsers: users});
    }else {
        res.status(501).send({msg: "No user Data found"});
    }

    
})
app.get('/error-path', (req,res) => {
    // res.send({status:404, msg: 'page not found'})
    res.status(500).send({msg: 'error from backend'})
})

app.post('/add', (req,res) => {
    console.log(req.body)
    const { email , password} = req.body;
    if(email && password){
        users = [...users , {email, password, id: Math.random()}];
        res.send({status: 200, msg: 'user added', users});
    }else {
        res.send({status: 500, msg: 'something went wrong'})
    };
});


app.listen(port, () => {
    console.log('Server started on port ' + port);
})

app.listen