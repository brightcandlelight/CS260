<template>
  <div>
    <div v-for="item in feed" class="item">
      <p class="idline"><span class="user">{{item.name}}</span><router-link :to="{ name: 'UserPage', params: {userID: item.userID}}"><span class="handle">@{{item.username}}</span></router-link><span class="time">{{item.created | since}}</span></p>
      <p v-html="item.tweet" class="tweet"> </p><p><button class="alternate time margin" type="submit" v-on:click="deleteTweet(item)" v-if="mine(item)">X</button></p> 
    </div>
  </div>
</template>

<script>
 import moment from 'moment';
 import linkify from './linkify.js';
 export default {
   name: 'FeedList',
   props: ['feed'],
   filters: {
     since: function(datetime) {
       moment.locale('en', {
	 relativeTime: {
	   future: 'in %s',
	   past: '%s',
	   s:  'seconds',
	   ss: '%ss',
	   m:  '1m',
	   mm: '%dm',
	   h:  'h',
	   hh: '%dh',
	   d:  'd',
	   dd: '%dd',
	   M:  ' month',
	   MM: '%dM',
	   y:  'a year',
	   yy: '%dY'
	 }
       });
       return moment(datetime).fromNow();
     },
   },
   computed: {
 //    mine: function() {
   //    return item.userId === this.$store.getters.user.id;
     //},
   },
   methods: {
     formatTweet: function(text) {
       return linkify(text, {
         defaultProtocol: 'https'
       });
     },
     deleteTweet: function(text) {
       console.log("DT "+text.id);
       this.$store.dispatch('deleteMsg',{
          id: text.id,
       });
     },
     mine: function(item) {
       console.log("M "+item.userID +" "+this.$store.getters.user.id);
       return item.userID === this.$store.getters.user.id;
     },
   }
 }

</script>

<style scoped>
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
 }
 .tweet {
     margin-top: 0px;
 }
 .idline {
     margin-bottom: 0px;
 }
 .user {
     font-weight: bold;
     margin-right: 10px;
 }
 .handle {
     margin-right: 10px;
     color: #666;
 }
 .time {
     float: right;
     color: #666;
 }
 .margin {
     padding-top: 0px !important;
     margin-top: -10px !important;
 }
</style>
