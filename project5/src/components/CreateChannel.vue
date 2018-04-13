<template>
  <div class="column">
    <h1>Create a channel</h1>
    <button class="alternate" type="submit">Back</button>
    <form v-on:submit.prevent="register">
      <p>Enter a name</p>
      <input class="narrow" v-model="channel.groupname" placeholder="Group Name">
      <p>Enter a description</p>
      <input class="narrow" v-model="channel.description" placeholder="Description">
      <p>Invite People</p>
      
      <p>?</p>
      
      <button class="alternate" type="submit">Create</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
 export default {
   name: 'CreateChannel',
   props: ['gid'],
   /*data () {
     return {
       groupname: '',
       description: '',
       people: [], // need id and name
     }
   },*/
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
     channel: function() {
       return this.$store.getters.channel;
     },
   },
   created: function() {
     if (gid !== -1) {
        this.$store.dispatch('getChannel', gid);
     } else {
        this.$store.dispatch('clearChannel');
     }
   },
   methods: {
     register: function() {
       this.$store.dispatch('createChannel',{
         groupname: this.channel.groupname,
         description: this.channel.description,
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
