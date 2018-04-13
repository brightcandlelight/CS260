<template>
  <div>
    <button class="alternate" type="submit" :to="{ name: 'CreateChannel', params: {gid: -1}}">Create</button>
    <div v-for="channel in channels">
      <p><router-link :to="{ name: 'UserList', params: {userID: channel.group_id}}"><span class="handle">{{channel.name}}</span></router-link> X</p>
    </div>
    <div v-for="channel in directChannels">
      <p><router-link :to="{ name: 'UserList', params: {userID: channel.group_id}}"><span class="handle">{{channel.name}}</span></router-link> X</p>
    </div>
  </div>
</template>

<script>
 export default {
   name: 'ShowMyChannels',
   computed: {
     channels: function() {
       return this.$store.getters.myPublicChannels;
     },
     directChannels: function() {
       return this.$store.getters.myDirectChannels;
     },
   },
   created: function() {
     this.$store.dispatch('getPublicChannels');
     this.$store.dispatch('getDirectChannels');
   },
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
