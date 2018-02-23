var app = new Vue({
    el: '#app',
    data: {
        number: '',
        min: 1,
        max: '',
        current: {},
        loading: true,
        addedName: '',
        addedComment: '',
        addedRating: '',
        rating: '',
        ratingNum: '',
        comments: {}
    },
    created: function() {
        Vue.component('star-rating', VueStarRating.default);
        this.xkcd();
    },
    watch: {
        number: function(value,oldvalue) {
          if (oldvalue === '') {
            this.max = value;
          } else {
            this.xkcd();
          }
        }
    },
    computed: {
        month: function() {
          var month = new Array;
          if (this.current.month === undefined)
            return '';
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";
          return month[this.current.month - 1];
        }
    }, 
    methods: {
        xkcd: function() {
          this.loading = true;
          fetch('https://xkcd.now.sh/' + this.number).then(response => {
            return response.json();
          }).then(json => {
            this.current = json;
            this.loading = false;
            this.number = json.num;
            return true;
          }).catch(err => {
              this.number = this.max;
          });
        },
        previousComic: function() {
            this.number = this.current.num - 1;
        },
        nextComic: function() {
            this.number = this.current.num + 1;
        },
        firstComic: function() {
            this.number = this.min;
        },
        lastComic: function() {
            this.number = this.max;
        },
        getRandom: function(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive 
        },
        randomComic: function() {
            this.number = this.getRandom(this.min,this.max);
        },
        addComment: function() {
          if (!(this.number in this.comments))
            Vue.set(app.comments, this.number, new Array);
          this.comments[this.number].push({author:this.addedName,text:this.addedComment, rating:this.addedRating});
          this.addedName = '';
          this.addedComment = '';
          this.addedRating = '';
        }
    }
});



