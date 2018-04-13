<template>
  <div class="column">
    <h1>Create a channel</h1>
    <button class="alternate" type="submit">Back</button>
    <form v-on:submit.prevent="register">
      <p>Is this public? Can anyone join?</p>
      
      <form action="">
        <input type="radio" v-model="channel.public" name="public" value="1"> Public<br>
        <input type="radio" v-model="channel.public" name="public" value="0"> Private<br>
      </form>
      
      <p>Is this a channel or a direct conversation? Direct conversation does NOT allow changing member list</p>
      
      <form action="">
        <input type="radio" v-model="channel.direct" name="channel.direct" value="0"> Channel<br>
        <input type="radio" v-model="channel.direct" name="channel.direct" value="1"> Direct Conversation<br>
      </form>
      
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
       direct: '', //int
       public: '', //int
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
         direct: this.channel.direct,
         public: this.channel.public,
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
