
function getSearchParams(k){
 var p={};
 location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
 return k?p[k]:p;
}

var app1 = new Vue({
  el: '#app1',
  data: {
    item: {},
    id: 0
  },
  created: function() {
      this.id = getSearchParams("id");
      this.getItem();
  },
  methods: {
    getItem: function() {
      axios.get("http://localhost:3000/api/items/"+this.id).then(response => {
	this.item = response.data;
    if (this.item === "") { window.location.assign("http://localhost:3000/index.html");  }
	return true;
      }).catch(err => {
         window.location.assign("http://localhost:3000/index.html"); 
      });
    },
    returnList: function() {
        window.location.assign("http://localhost:3000/index.html"); 
    },
    editItem: function() {
      //item.completed = !item.completed;
      axios.put("http://localhost:3000/api/items/" + this.id, {
	text: this.item.text,
	subject: this.item.subject,
    author: this.item.author,
	orderChange: false,
      }).then(response => {
            var currentdate = new Date(); 
            let datetime1 = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
            this.item.modified = datetime1;
	return true;
      }).catch(err => {
      });

    }
  }
});