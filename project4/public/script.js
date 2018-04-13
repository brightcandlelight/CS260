var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    drag: {},
    author: '',
    subject: '',
    url: 'http://159.89.43.108:3001',
  },
  created: function() {
    this.getItems();
  },

  computed: {
    filteredItems: function() {
      return this.items;
    }
  },
  methods: {
    addItem: function() {
        if (this.subject === '' || this.author === '') {
            alert("Please fill out the subject box and author");
        } else {
          axios.post(this.url+"/api/items", {
            text: this.text,
            author: this.author,
            subject: this.subject
              }).then(response => {
            this.text = "";
            this.author = "";
            this.subject = "";
            this.getItems();
            return true;
          }).catch(err => {
          });
        }
    },
    deleteItem: function(item) {
      axios.delete(this.url+"/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put(this.url+"/api/items/" + this.drag.id, {
        text: this.drag.text,
        orderChange: true,
        orderTarget: item.id,
        subject: this.drag.subject,
        author: this.drag.author,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get(this.url+"/api/items").then(response => {
	this.items = response.data;
	return true;
      }).catch(err => {
      });
    },
    openItem: function(item) {
      window.location.assign(this.url+"/note.html?id="+item.id);   
    }
  }
});


