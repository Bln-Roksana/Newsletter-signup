const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const https=require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;

  const data={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData=JSON.stringify(data);

  // const url="https://us10.api.mailchimp.com/3.0/lists/dad6cdaaaf";

  const options={
    hostname:'us10.api.mailchimp.com',
    port: 443,
    path: '/3.0/lists/XXX',
    method: "POST",
    auth: "roks:XXXXXXXXXXXXXXXXXXXXXXX-us10"
  }
  const request= https.request(options, function(response){

    if (response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

  // console.log(firstName, lastName, email);
})

app.post("/failure", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running..")
})


