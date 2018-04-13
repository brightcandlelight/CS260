<template>
  <div class="feed">
    <h2>
      {{userView.name}} @{{userView.username}}
      <span v-if="user.id !== userView.id">
      </span>
    </h2>
    </div>
  </div>
</template>

<script>
 import FeedList from './FeedList';
 import UserList from './UserList';
 export default {
   name: 'UserPage',
   components: { FeedList, UserList },
   data() {
     return {
       showTweets: true,
     }
   },
   created: function() {
     this.$store.dispatch('getUser',{id:this.$route.params.userID});
   },
   computed: {
     user: function() {
       return this.$store.getters.user;
     },
     userView: function() {
       return this.$store.getters.userView;
     },
   },
   watch: {
     '$route.params.userID'() {
       this.$store.dispatch('getUser',{id:this.$route.params.userID});
     }
   },
   methods: {
     toggle: function() {
       this.showTweets = !this.showTweets;
     }
   }
 }
</script>
