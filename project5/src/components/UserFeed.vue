<template>
  <div class="feed" v-if="loggedIn">
    <p class="error"></p>
    <div v-if="noError">
      <form v-on:submit.prevent="tweet" class="tweetForm">
	<textarea v-model="text" placeholder=""/><br/>
	<div class="buttonWrap">
	  <button class="primary" type="submit">Send</button>
	</div>
      </form>
    </div>
    <feed-list v-bind:feed="feed" v-if="noError" />
  </div>
</template>

<script>
 import FeedList from './FeedList';
 export default {
   name: 'UserFeed',
   data () {
     return {
       text: '',
     }
   },
   watch: {
     '$route.params.gid': function(gid) {
        this.$store.dispatch('getChannel', this.$route.params.gid);
     },
   },
   components: { FeedList },
   computed: {
     feed: function() {
       return this.$store.getters.channel;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     registerError: function() {
       return this.$store.getters.channelError;
     },
     noError: function() {
       if (this.$store.getters.channelError !== "" || this.$store.getters.channel === [] || this.$store.getters.channel == "" ) { return false; }
       return true;
     }
   },
   created: function() {
     this.$store.dispatch('getChannel', this.$route.params.gid);
     console.log("here11."+this.$store.getters.channel+".");
     //console.log(
   },
   methods: {
     tweet: function() {
       this.$store.dispatch('addChannelMsg',{
         tweet: this.text,
       }).then(tweet => {
	 this.text = "";
       });
     },
   }
 }
</script>

<style scoped>
 .feed {
     width: 600px;
 }
 .tweetForm {
     background: #eee;
     padding: 10px;
     margin-bottom: 10px;
 }
 .buttonWrap {
     width: 100%;
     display: flex;
 }
 button {
     margin-left: auto;
     height: 2em;
     font-size: 0.9em;
 }
 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }
</style>
