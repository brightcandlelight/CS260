import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import when from 'when';
//const when = require('when');


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loggedIn: false,
    loginError: '',
    registerError: '',
    feed: [],
    userView: [],
    channel: [],
    channelId: '',
    //myPublicChannels: [],
    myDirectChannels: [],
    personList: [],
    allPeopleList: [],
  },
  getters: {
    user: state => state.user,
    loggedIn: state => state.loggedIn,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    feed: state => state.feed,
    channel: state => state.channel,
    feedView: state => state.feedView,
    userView: state => state.userView,
    //myPublicChannels: state => state.myPublicChannels,
    myDirectChannels: state => state.myDirectChannels,
    personList: state => state.personList,
    allPeopleList: state => state.allPeopleList,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setLogin (state, status) {
      state.loggedIn = status;
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setFeed (state, feed) {
      state.feed = feed;
    },
    setChannel (state, feed) {
      state.channel = feed;
    },
    setChannelId (state, feed) {
      state.channelId = feed;
    },
    setUserView (state, user) {
      state.userView = user;
    },
    setPersonList (state, feed) {
      state.personList = feed;
    },
   // setMyPublicChannels (state, feed) {
   //   state.myPublicChannels = feed;
   // },
    setMyDirectChannels (state, feed) {
      state.myDirectChannels = feed;
    },
    setAllPeopleList(state, feed) {
      state.allPeopleList = feed;
    },
  },
  actions: {
    // Registration, Login //
    register(context,user) {
      return axios.post("/api/users",user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setLogin',true);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
        context.dispatch('getFollowing');
        context.dispatch('getFollowers');
      }).catch(error => {
        context.commit('setLogin',false);
        context.commit('setLoginError',"");
        if (error.response) {
          if (error.response.status === 403)
            context.commit('setRegisterError',"That email address already has an account.");
          else if (error.response.status === 409)
            context.commit('setRegisterError',"That user name is already taken.");
          return;
        }
        context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    login(context,user) {
      return axios.post("/api/login",user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setLogin',true);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
        context.dispatch('getFollowing');
        context.dispatch('getFollowers');
      }).catch(error => {
        context.commit('setLogin',false);
        context.commit('setRegisterError',"");
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 400)
            context.commit('setLoginError',"Invalid login.");
          context.commit('setRegisterError',"");
          return;
        }
        console.log(error);
        context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout(context,user) {
      context.commit('setUser', {});
      context.commit('setLogin',false);
    },
    // Users //
    // get a user, must supply {username: username} of user you want to get
    getUser(context,user) {
      return axios.get("/api/users/" + user.id).then(response => {
        context.commit('setUserView',response.data.user);
      }).catch(err => {
        console.log("getUser failed:",err);
      });
    },
    // Get channel messages 
    getChannel(context,gid) {
      return axios.get("/api/channels/" + gid + "/").then(response => {
        context.commit('setChannel',response.data.tweets);
        context.commit('setChannelId', gid);
      }).catch(err => {
        console.log("getChannel failed:",err);
      });
    },
    // Get channel info
    getChannelInfo(context,gid) {
      return axios.get("/api/channels/info/" + gid + "/").then(response => {
        context.commit('setChannel',response.data.tweets);
        context.commit('setChannelId', gid);
      }).catch(err => {
        console.log("getChannelInfo failed:",err);
      });
    },
    clearChannel(context) {
      context.commit('setChannel',{'groupname':'', 'description':'', people:[], direct:'', public:''});
    },
    
    // Add to channel //
    addChannelMsg(context,tweet) {
      axios.post("/api/channels/" + context.state.user.id + "/"+context.state.channelId,tweet).then(response => {
        return context.dispatch('getChannel', context.state.channelId);
      }).catch(err => {
        console.log("addChannel failed:",err);
      });
    },
    // Search text in my channels //
    doSearch(context,keywords) {
      return axios.get("/api/channels/searchText/" + keywords).then(response => {
        context.commit('setChannel',response.data.tweets);
      }).catch(err => {
        console.log("doSearch failed:",err);
      });
    },
    allPeopleSearch(context,keywords) {
      return axios.get("/api/users/search/"+keywords).then(response => {
        context.commit('setAllPeopleList',response.data.tweets);
      }).catch(err => {
        console.log("allPeopleSearch failed:",err);
      });
    },
    // See the people in a channel
    personSearch(context,gid) {
      return axios.get("/api/channels/"+gid+"/members/").then(response => {
        context.commit('setPersonList',response.data.tweets);
      }).catch(err => {
        console.log("personSearch failed:",err);
      });
    },
    // Get public channels
    /*searchPublicChannelName(context,keywords) {
      return axios.get("/api/channels/search/"+keywords).then(response => {
        context.commit('setChannel',response.data.tweets);
      }).catch(err => {
        console.log("searchPublicChannelName failed:",err);
      });
    },*/
    // Create channel //
    createChannel(context,channel) {
        return axios.post("/api/channels/", channel).then(response => {
            // channel.people need not include yourself.
            for (person in channel.people) {
                // dispatch is synchronous. Person must have "id"
                context.dispatch('follow', {'id': person});
            }
            context.dispatch('follow', context.state.user);
            
            //
            if (channel.direct === 0) {
                axios.put("/api/channels/"+response.group_id).catch(err => {
                  console.log("make direct failed:", err);
                });
            }
      }).catch(err => {
        console.log("createChannel failed:",err);
      });
    },
    // Get my not direct channels
    /*getPublicChannels(context) {
      return axios.get("/api/channels/user/1/"+ context.state.user.id).then(response => {
        context.commit('setMyPublicChannels',response.data.groups);
      }).catch(err => {
        console.log("getPublicChannels failed:",err);
      });
    },*/
    // Get my direct channels
    getDirectChannels(context) {
      return axios.get("/api/channels/user/2/"+ context.state.user.id).then(response => {
        context.commit('setMyDirectChannels',response.data.groups);
      }).catch(err => {
        console.log("getDirectChannels failed:",err);
      });
    },
    
    // Followers //

    // follow a group, must supply {id: id} of group you want to follow
    follow(context,group) {
      return axios.post("/api/users/" + context.state.user.id + "/follow",group).then(response => {
        context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
      }).catch(err => {
        console.log("follow failed:",err);
      });
    },
    // unfollow a group, must supply {id: id} of group you want to unfollow
    unfollow(context,group) {
      return axios.delete("/api/users/" + context.state.user.id + "/follow/" + group.id).then(response => {
        context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
      }).catch(err => {
        console.log("unfollow failed:",err);
      });
    },
  }
});
