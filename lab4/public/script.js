var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    picked: '',
    sortDes: true
  },
  created: function() {
    this.getItems();
  },

  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
        return this.items.filter(function(item) {
        return !item.completed;
      });
      if (this.show === 'completed')
        return this.items.filter(function(item) {
        return item.completed;
	  });
      return this.items;
    },
  },
  methods: {
    sortFunc: function() { // sort by priority
        this.sortDes = !this.sortDes;
    
        axios.post("http://localhost:3000/api/sort", {
        sortBool: this.sortDes,
          }).then(response => {
              this.getItems();
        return true;
          }).catch(err => {
              
        });
        //this.items.sort()
    },
    addItem: function() {
        //console.log(this.items);
        //console.log(this.picked);
        if (this.text === '' || this.picked < 1 || this.picked > 3) {
            alert("Please fill out the text box and select a priority");
        } else {
          //this.items.push({text: this.text,completed:false});
          //this.text = '';
          axios.post("http://localhost:3000/api/items", {
            text: this.text,
            completed: false,
            picked: this.picked,
              }).then(response => {
            this.text = "";
            this.picked = "";
            this.getItems();
            return true;
          }).catch(err => {
          });
        }
    },
    completeItem: function(item) {
      //item.completed = !item.completed;
      axios.put("http://localhost:3000/api/items/" + item.id, {
	text: item.text,
	completed: !item.completed,
	orderChange: false,
    picked: item.picked
      }).then(response => {
	return true;
      }).catch(err => {
      });

    },
    deleteItem: function(item) {
      //var index = this.items.indexOf(item);
      //if (index > -1)
	//this.items.splice(index,1);
      axios.delete("http://localhost:3000/api/items/" + item.id).then(response => {
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      //this.items = this.items.filter(function(item) {
	//return !item.completed;
      //});
      this.items.forEach(item => {
	if (item.completed)
	  this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
        //console.log("HERE "+this.drag.id);
      //var indexItem = this.items.indexOf(this.drag);
      //var indexTarget = this.items.indexOf(item);
      //this.items.splice(indexItem,1);
      //this.items.splice(indexTarget,0,this.drag);
      axios.put("http://localhost:3000/api/items/" + this.drag.id, {
        text: this.drag.text,
        completed: this.drag.completed,
        orderChange: true,
        orderTarget: item.id,
        picked: this.drag.picked
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get("http://localhost:3000/api/items").then(response => {
	this.items = response.data;
	return true;
      }).catch(err => {
      });
    },

  }
});
