const express = require("express");
const cors = require("cors");
const { readFileSync, writeFileSync } = require("fs");
const app = express();

const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let users = [
  {
    email: "test1@email.com",
    password: "password1",
    id: Math.random(),
    date: new Date(),
  },
  {
    email: "test2@email.com",
    password: "password2",
    id: Math.random(),
    date: new Date(),
  },
];
let emptyUsers = [];

app.post("/login", async (req, res) => {
  console.log("req.body", req.body);
  const { email, password } = req.body;
  const data = await readFileSync("./jsonData/users.json");
  const AllUserData = JSON.parse(data);

  const loginUser = AllUserData.find(
    (user) => user.email === email && user.password === password
  );
  console.log(loginUser);
  if (loginUser) {
    loginUser.auth = `${Math.random()} ${loginUser.email} ${Math.random()}`;
    res.send({
      status: 200,
      msg: "user loged in successfully",
      userData: loginUser,
    });
  } else {
    res.send({ status: 404, msg: "User Not found" });
  }
});

app.get("/users", (req, res) => {
  if (users.length > 0) {
    res.send({ status: 200, allUsers: users });
  } else {
    res.status(501).send({ msg: "No user Data found" });
  }
});
app.get("/error-path", (req, res) => {
  // res.send({status:404, msg: 'page not found'})
  res.status(500).send({ msg: "error from backend" });
});

app.post("/saveevent", async(req, res) => {
  console.log(req.body);
  const { id, title, start, end, allDay, userId } = req.body;
  if (id && title && start) {
    const data = await readFileSync("./jsonData/events.json");
    const allEvents = JSON.parse(data);

    const newEvents = [...allEvents, {  id, title, start, end, allDay, userId }];

    await writeFileSync('./jsonData/events.json', JSON.stringify(newEvents));
    res.send({ status: 200, msg: "event added" });
  } else {
    res.send({ status: 500, msg: "something went wrong" });
  }
});

app.post("/getevent", async(req, res) => {
    console.log(req.body);
    const {  userId } = req.body;
    if (userId != -1) {
      const data = await readFileSync("./jsonData/events.json");
      const allEvents = JSON.parse(data);
  
      const userEvent = [] ;
      allEvents.forEach(event => {
        if(event.userId === userId){
          userEvent.push(event)
      }
      });;
  
    console.log('userEvent',userEvent)
      res.send({ status: 200, msg: "all event added", userEvent });
    } else {
      res.send({ status: 500, msg: "something went wrong" });
    }
  });



app.get('/getDoctors',async(req,res)=> {
  
  const data = await readFileSync("./jsonData/users.json");
  const AllUserData = JSON.parse(data);

  const allDoctors = [];

  AllUserData.forEach((user) => {
    if(user.type === 'doctor'){
      allDoctors.push(user);
    }
  });

  res.send({msg: 'all Doctor',doctors: allDoctors, status: 200});
});

app.post("/doctor/getevent", async(req, res) => {
  console.log(req.body);
  const {  userId } = req.body;
  if (userId != -1) {
    const data = await readFileSync("./jsonData/events.json");
    const allEvents = JSON.parse(data);

    const userEvent = [] ;
    allEvents.forEach(event => {
      if(event.userId === userId){
        userEvent.push(event)
    }
    });;

  console.log('userEvent',userEvent)
    res.send({ status: 200, msg: "all event added", userEvent });
  } else {
    res.send({ status: 500, msg: "something went wrong" });
  }
});

app.get("/allevents", async(req, res) => {
  const { userId } = req.query;
  const data = await readFileSync("./jsonData/events.json");
  const allEvents = JSON.parse(data);

  const canBeBookEvent = [];

  allEvents.forEach((event) => {
    if(event.bookId === undefined){
      canBeBookEvent.push(event);
    }
  })

  console.log('allEvents',allEvents)
    res.send({ status: 200, msg: "all events",events:  canBeBookEvent });

});

app.post('/bookAppointment', async(req,res) => {
  console.log('req.body',req.body);
const {userId, bookId } = req.body;

  const eventsData = await readFileSync("./jsonData/events.json");
  const allEvents = JSON.parse(eventsData);

  const eventId = allEvents.findIndex(event => event.userId == userId );
  allEvents[eventId].bookId = bookId;
  
  await writeFileSync('./jsonData/events.json', JSON.stringify(allEvents));
  res.send({ status: 200, msg: "appointment is booked is booked" });

})

app.post('/users/bookedAppointment', async(req,res)=> {
  const { userId} = req.body;
  const eventsData = await readFileSync("./jsonData/events.json");
  const allEvents = JSON.parse(eventsData);
  const usersData = await readFileSync("./jsonData/users.json");
  const allUsers = JSON.parse(usersData);

const   allAppointmetnEvent = [];

allEvents.forEach(event => {
  if(event.bookId == userId){
    allAppointmetnEvent.push(event);
  }
});


const newRes = allAppointmetnEvent.map((event) => {
  const dcId = allUsers.findIndex(u => u.id == event.userId);
  event.doctor = allUsers[dcId]
  return event;
});

res.send({status: 200 ,msg:'all user booked appointment',  events:newRes})

});


app.get('/admin/doctors', async (req,res) => {
 
  const usersData = await readFileSync("./jsonData/users.json");
const allUsers = JSON.parse(usersData);

const doctors = [];

allUsers.forEach((user) => {
  if(user.type === 'doctor'){
    doctors.push(user);
  }
});

res.send({status: 200 ,msg:'all doctors list',  doctors})

});

app.get('/admin/users', async (req,res) => {
 
  const usersData = await readFileSync("./jsonData/users.json");
const allUsers = JSON.parse(usersData);

const doctors = [];

allUsers.forEach((user) => {
  if(user.type === 'user'){
    doctors.push(user);
  }
});

res.send({status: 200 ,msg:'all doctors list',  doctors})

});

app.listen(port, () => {
  console.log("Server started on port " + port);
});

app.listen;
