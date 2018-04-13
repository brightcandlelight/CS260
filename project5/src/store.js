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
    channelError: '',
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
    channelError: state => state.channelError,
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
    setChannelError(state,msg) {
      state.channelError = msg;
    }
  },
  actions: {
    // Registration, Login //
    register(context,user) {
      return axios.post("/api/users",user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setLogin',true);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
        //context.dispatch('getFollowing');
        //context.dispatch('getFollowers');
        context.dispatch('getDirectChannels');
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
        //context.dispatch('getFollowing');
        //context.dispatch('getFollowers');
        context.dispatch('getDirectChannels');
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
        console.log("GetChannel: "+response.data.tweets+" "+gid);
        context.commit('setChannel',response.data.tweets);
        context.commit('setChannelId', gid);
      }).catch(err => {
        console.log("getChannel failed:",err.response.data);
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
      console.log(keywords);
      return axios.post("/api/channels/searchText/" + context.state.user.id, {'keywords': keywords}).then(response => {
        context.commit('setChannel',response.data.tweets);
      }).catch(err => {
        console.log("doSearch failed:",err.response);
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
        context.commit('setChannelError', '');
        return axios.post("/api/channels/", channel).then(response => {
            // channel.people need not include yourself.
            for (person in channel.people) {
                // dispatch is synchronous. Person must have "id"
                context.dispatch('follow', person);
            }
            console.log("here1 "+context.state.user.id);
            context.dispatch('follow', {'id': response.data.group[0]}); //follow this group
            
            console.log(response.data.group[0]);
            //
            if (channel.direct === 1) {
		console.log("making direct channel");
                axios.put("/api/channels/"+response.data.group[0]).catch(err => {
                  console.log("make direct failed:", err.response.data);
                  context.commit('setChannelError', err.response.data);
                });
            }
      }).catch(err => {
        console.log("createChannel failed:",err);
        console.log("failed: ",err.response.data);
        context.commit('setChannelError', err.response.data);
      });
    },
    // Get my not direct channels
    /*getPublicChannels(context) {
      return axios.get("/api/channels/user/0/"+ context.state.user.id).then(response => {
        context.commit('setMyPublicChannels',response.data.groups);
      }).catch(err => {
        console.log("getPublicChannels failed:",err);
      });
    },*/
    // Get my direct channels
    getDirectChannels(context) {
      if (context.state.user.id && context.state.user.id != -1) {
        return axios.get("/api/channels/user/1/"+ context.state.user.id).then(response => {
          console.log(response.data+" "+context.state.user.id);
          context.commit('setMyDirectChannels',response.data.groups);
        }).catch(err => {
          console.log("getDirectChannels failed:",err);
        });
      } else {
        context.commit('setMyDirectChannels', []);
      }
    },
    
    // Followers //

    // follow a group, must supply {id: id} of group you want to follow
    follow(context,group) {
      return axios.post("/api/users/" + context.state.user.id + "/follow",group).then(response => {
        //context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
      }).catch(err => {
        console.log("follow failed:",err);
      });
    },
    // unfollow a group, must supply {id: id} of group you want to unfollow
    unfollow(context,group) {
      return axios.delete("/api/users/" + context.state.user.id + "/follow/" + group.id).then(response => {
        //context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
      }).catch(err => {
        console.log("unfollow failed:",err);
      });
    },
  }
});
