var app = new Vue({
    el: '#app',
    data: {
        items:"",
        comments: [],
        number: ''
    },
    created: function() {

    },
    watch: {
    },
    methods: {
        calc: function() {
            var self = this;
            var me = $("#text").val();
            $.ajax({
                url: 'http://api.mathjs.org/v4/?expr='+encodeURIComponent(me)+'&precision=3',
                method: 'GET',
                success: function (data) {
                    //if (!(this.number in this.comments))
                    // Vue.set(app.comments, this.number, new Array);
                    self.comments.unshift({text: me+" = "+data});
                },
                error: function (error) {
                    console.log(error);
                }
            });
            //if (!(this.number in this.comments))
             // Vue.set(app.comments, this.number, new Array);
            //this.comments[this.number].push({text: "hi"});
            //$("#results").val = "HI"+this.items;
            //console.log("HI2");
        },
        deleteAll: function() {
            this.comments= [];
        }
    }
});