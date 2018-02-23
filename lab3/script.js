function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}

function average(comments, number) {
    var total = 0;
    var num = 0;
    for (var key in comments) {
        if (comments.hasOwnProperty(key)) {
            if (key == number) {
                console.log(key + " -> " + comments[key]);
                var j = comments[key];
                for (var key1 =0; key1 < j.length;key1++) {
                    num++;
                    total += j[key1].rating;
                }
            }
        }
    }
   
    if (num === 0) {
        return 5;
    }
    total /= num;
    return total;
}

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
        addedRating: '5',
        ratingNum: '5',
        comments: {},
        ratings: {}
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
            this.ratingNum = average(this.ratings, this.number);
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
          var v = timeStamp();
          this.comments[this.number].push({author:this.addedName,text:this.addedComment, date:v});
          this.addedName = '';
          this.addedComment = '';
        },
        rate: function() {
            if (!(this.number in this.ratings))
                Vue.set(app.ratings, this.number, new Array);
            this.ratings[this.number].push({rating: this.addedRating});
            this.ratingNum = average(this.ratings, this.number);
        }
    }
});



