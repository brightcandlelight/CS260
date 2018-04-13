<template>
  <div v-if="loggedIn">
    <button class="alternate" type="submit" v-on:click="create">Create</button>
    <p>My Conversations</p>
    <div v-for="channel in directChannels">
      <p><router-link :to="{ name: 'Channel', params: {userID: channel.group_id, gid: channel.group_id }}"><span class="handle">{{channel.name}}</span></router-link> X</p>
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
   }
 }

</script>

<style scoped>
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
 }
 .user {
     font-weight: bold;
     margin-right: 10px;
 }
 .handle {
     margin-right: 10px;
     color: #666;
 }
</style>
