<template>
  <div class="column" v-if="loggedIn">
    <h1>Create a conversation</h1>
    <form v-on:submit.prevent="register">
      <p>Connect with</p>
      <input v-model="channel.people" placeholder="Person Username"></input>     
      
      <button class="alternate" type="submit">Go</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
 export default {
   name: 'CreateChannel',
   props: ['gid'],
   data () {
     return {
       //groupname: '',
       //description: '',
       //people: [], // need id and name
     }
   },
   watch: {
   },
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     registerError: function() {
       return this.$store.getters.channelError;
     },
     channel: function() {
       return this.$store.getters.channel;
     },
   },
   created: function() {
     if (this.gid && this.gid !== -1) {
        console.log("HERE "+this.gid);
        this.$store.dispatch('getChannel', this.gid);
     } else {
        this.$store.dispatch('clearChannel');
     }
   },
   methods: {
     register: function() {
       this.$store.dispatch('createChannel',{
         groupname: this.channel.people,
         description: '',
         direct: 1,
         public: 0,
         people: this.channel.people,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
     width: 100px;
 }

 h1 {
     margin-bottom: 0px;
 }
 h2 {
     margin-top: 0px;
     font-size: 1.2em;
     font-weight: normal;
     margin-bottom: 50px;
 }
 .narrow {
     width: 170px;
 }
 .wide {
     width: 370px;
 }
</style>
