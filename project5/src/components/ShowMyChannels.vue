<template>
  <div v-if="loggedIn"  style="border: 1px solid black;">
    <p>My Conversations</p>
    <button class="alternate" type="submit" v-on:click="create">Create</button>
    <div v-for="channel in directChannels">
      <p><router-link :to="{ name: 'Channel', params: {userID: channel.group_id, gid: channel.group_id }}"><span class="handle">{{channel.name}}</span></router-link> <button class="alternate right1" type="submit" v-on:click="unfollow(channel.group_id)">X</button></p>
    </div>
  </div>
</template>

<script>
 export default {
   name: 'ShowMyChannels',
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     directChannels: function() {
       return this.$store.getters.myDirectChannels;
     },
   },
   created: function() {
     this.$store.dispatch('getDirectChannels');
   },
   methods: {
     create: function() {
       this.$router.push({ name: 'CreateChannel', params: {gid: -1 }});
     },
     unfollow: function(id) {
       console.log(id);
       this.$store.dispatch('unfollow', id);
     }
   }
 }

</script>

<style scoped>
 .item {
     border-bottom: 1px solid #ddd;
     padding: 0px;
 }
 .user {
     font-weight: bold;
     margin-right: 0px;
 }
 .handle {
     margin-right: 0px;
     color: #666;
 }
 .right1 {
     float: right;
     margin-right: 20px;
 }
</style>
