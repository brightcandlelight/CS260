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

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {id:id, text:req.body.text, completed: req.body.completed, picked: req.body.picked};
  items.push(item);
  res.send(item);
});

function compare(a,b) { 
    if (a.picked < b.picked) {
      return !sortDes ? 1 : -1;
    }

    if (a.picked > b.picked) {
      return !sortDes ? -1 : 1;
    }

    return 0;
};


app.post('/api/sort', (req, res) => {
  //id = id + 1;
  sortDes = req.body.sortBool;
  //console.log("START");
  //console.log(typeof items);
  //console.log("END");
  //var items = $.map(items, function(value, index) { return [value]; });
  items.sort(compare);
  res.send(items);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.completed = req.body.completed;
  item.text = req.body.text;
  item.picked = req.body.picked;
  //console.log("HERE "+req.body.orderChange);
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
        let indexTarget = itemsMap.indexOf(req.body.orderTarget);
        //console.log("HERE "+index+ " "+indexTarget);
        items.splice(index,1);
        items.splice(indexTarget,0,item);
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
