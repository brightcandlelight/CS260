const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let items = [];
let id = 0;
let sortDes = true;

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.get('/api/items/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let itemsMap = items.map(item => { return item.id; });
    let index = itemsMap.indexOf(id);
    let item = items[index];
    res.send(item);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  var currentdate = new Date(); 
  let datetime1 = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  let item = {id:id, subject: req.body.subject, text:req.body.text, author: req.body.author, created: datetime1, modified: datetime1};
  items.push(item);
  res.send(item);
});

app.put('/api/items/:id', (req, res) => {
  var currentdate = new Date(); 
  let datetime1 = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  
  item.author = req.body.author;
  item.text = req.body.text;
  
  item.subject = req.body.subject
  //console.log("HERE "+req.body.orderChange);
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
        let indexTarget = itemsMap.indexOf(req.body.orderTarget);
        //console.log("HERE "+index+ " "+indexTarget);
        items.splice(index,1);
        items.splice(indexTarget,0,item);
  } else {
      item.modified = datetime1;
  }
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
