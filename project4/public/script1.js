
function getTime() {
  let currentdate = new Date();
  let datetime1 = (currentdate.getMonth()+1) + "/"
                + (currentdate.getDate())  + "/"
                + currentdate.getFullYear() + " ";
  let time = ("0" + currentdate.getHours()).slice(-2)   + ":" +
    ("0" + currentdate.getMinutes()).slice(-2) + ":" +
    ("0" + currentdate.getSeconds()).slice(-2);
  return datetime1 + time;
}


function getSearchParams(k){
 var p={};
 location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
 return k?p[k]:p;
}

var app1 = new Vue({
  el: '#app1',
  data: {
    item: {},
    id: 0,
    url: 'http://159.89.43.108:3001',
  },
  created: function() {
      this.id = getSearchParams("id");
      this.getItem();
  },
  methods: {
    getItem: function() {
      axios.get(this.url+"/api/items/"+this.id).then(response => {
	this.item = response.data;
    if (this.item === "") { window.location.assign(this.url+"/index.html");  }
	return true;
      }).catch(err => {
         window.location.assign(this.url+"/index.html"); 
      });
    },
    returnList: function() {
        window.location.assign(this.url+"/index.html"); 
    },
    editItem: function() {
      //item.completed = !item.completed;
      axios.put(this.url+"/api/items/" + this.id, {
	text: this.item.text,
	subject: this.item.subject,
    author: this.item.author,
	orderChange: false,
      }).then(response => {
            this.item.modified = getTime();
	return true;
      }).catch(err => {
      });

    }
  }
});
