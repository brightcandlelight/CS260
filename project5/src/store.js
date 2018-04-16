import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import when from 'when';
//const when = require('when');


Vue.use(Vuex);

const getAuthHeader = () => {
  return { headers: {'authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    user: {},
    //loggedIn: false,
    token: '',
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
    //loggedIn: state => state.loggedIn,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '' || state.user.id === 0)
       return false;
      return true;
    },
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
    channelId: state => state.channelId,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    //setLogin (state, status) {
    //  state.loggedIn = status;
    setToken (state, token) {
      state.token = token;
      if (token === '')
	localStorage.removeItem('token');
      else
	localStorage.setItem('token', token)
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
        //context.commit('setLogin',true);
        context.commit('setToken',response.data.token);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
        //context.dispatch('getFollowing');
        //context.dispatch('getFollowers');
        context.dispatch('getDirectChannels');
      }).catch(error => {
        //context.commit('setLogin',false);
        context.commit('setUser',{});   
        context.commit('setToken','');
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
        //context.commit('setLogin',true);
        context.commit('setToken',response.data.token);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
        //context.dispatch('getFollowing');
        //context.dispatch('getFollowers');
        context.dispatch('getDirectChannels');
      }).catch(error => {
        //context.commit('setLogin',false);
        context.commit('setUser',{});
        context.commit('setToken','');
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
      //context.commit('setLogin',false);
      context.commit('setToken','');
    },
    // Users //
    // get a user, must supply {username: username} of user you want to get
    getUser(context,user) {
      return axios.get("/api/users/" + user.id,getAuthHeader()).then(response => {
        context.commit('setUserView',response.data.user);
      }).catch(err => {
        console.log("getUser failed:",err);
      });
    },
    // Get channel messages 
    getChannel(context,gid) {
      context.commit('setChannelError','');
      console.log("A "+context.state.user);
      console.log("B "+context.state.user.id);
      let id = context.state.user.id ? context.state.user.id : 0;
      context.commit('setChannelId', gid);
      return axios.get("/api/channels/" + gid + "/"+id,getAuthHeader()).then(response => {
        console.log("GetChannel: "+response.data.tweets+" "+gid);
        context.commit('setChannel',response.data.tweets);
        //context.commit('setChannelId', gid)
        context.commit('setChannelError', '');
      }).catch(err => {
        console.log("getChannel failed:",err.response.data);
        context.commit('setChannelError', err.response.data);
        //context.commit('setChannelId', gid);
      });
    },
    // Get channel info
    getChannelInfo(context,gid) {
      return axios.get("/api/channels/info/" + gid + "/",getAuthHeader()).then(response => {
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
      axios.post("/api/channels/" + context.state.user.id + "/"+context.state.channelId,tweet,getAuthHeader()).then(response => {
        return context.dispatch('getChannel', context.state.channelId);
      }).catch(err => {
        console.log("addChannel failed:",err);
      });
    },
    // Search text in my channels //
    /*doSearch(context,keywords) {
      console.log(keywords);
      return axios.post("/api/channels/searchText/" + context.state.user.id, {'keywords': keywords}).then(response => {
        context.commit('setChannel',response.data.tweets);
      }).catch(err => {
        console.log("doSearch failed:",err.response);
      });
    },*/
    allPeopleSearch(context,keywords) {
      return axios.get("/api/users/search/"+keywords,getAuthHeader()).then(response => {
        context.commit('setAllPeopleList',response.data.tweets);
      }).catch(err => {
        console.log("allPeopleSearch failed:",err);
      });
    },
    // See the people in a channel
    personSearch(context,gid) {
      return axios.get("/api/channels/"+gid+"/members/",getAuthHeader()).then(response => {
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
        console.log(getAuthHeader());
        var names = [channel.groupname, context.state.user.username];
        names.sort();
        channel.groupname = names[0]+ " & "+names[1];
        if (context.state.username === channel.groupname) {
           //context.commit('setChannelError', "Can not create a conversation with yourself");
           //return;
        }

        return axios.get("/api/users/name/"+channel.people,getAuthHeader()).then(response => {
          let pid = response.data;
          console.log("create0"+pid);
          axios.post("/api/channels/", channel, getAuthHeader()).then(response => {
            // channel.people need not include yourself.
            console.log("follow1:"+pid+ " "+response.data+" "+response.data.group+" "+response.data.group[0]);
            //for (person in channel.people) {
                // dispatch is synchronous. Person must have "id"
            console.log("Follow: "+pid);
            context.dispatch('follow', {'id': response.data.group, 'pid':pid});
            //}
            console.log("here1 "+context.state.user.id);
            if (pid !== context.state.user.id) {
                context.dispatch('follow', {'id': response.data.group, 'pid': context.state.user.id}); //follow this group
            }            

            console.log(response.data.group[0]);
            //
            if (channel.direct === 1) {
		console.log("making direct channel");
                axios.put("/api/channels/"+response.data.group, {}, getAuthHeader()).catch(err => {
                  console.log("make direct failed:", err.response.data);
                  context.commit('setChannelError', err.response.data);
                });
            }
         }).catch(err=> {
            context.commit('setChannelError', err.response.data);
         });
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
      console.log("Get Direct: "+context.state.user.id);
      if (context.state.user.id && context.state.user.id != -1) {
        return axios.get("/api/channels/user/1/"+ context.state.user.id,getAuthHeader()).then(response => {
          console.log(response.data+" "+context.state.user.id);
          context.commit('setMyDirectChannels',response.data.groups);
        }).catch(err => {
          console.log("getDirectChannels failed:",err);
        });
      } else {
        context.commit('setMyDirectChannels', []);
      }
    },

    deleteMsg(context,group) {
      console.log("DM "+group.id);
      return axios.delete("/api/channels/" + context.state.channelId +"/"+context.state.user.id + "/" + group.id,getAuthHeader()).then(response => {
        //context.dispatch('getPublicChannels');
        //context.dispatch('getDirectChannels');
        return context.dispatch('getChannel', context.state.channelId);
      }).catch(err => {
        console.log("delete msg failed:",err);
      });
    },

    //app.delete('/api/channels/:gid/:id/:msg_id'
    
    // Followers //

    // follow a group, must supply {id: id} of group you want to follow
    follow(context,group) {
      return axios.post("/api/users/" + group.pid + "/follow",group,getAuthHeader()).then(response => {
        //context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
      }).catch(err => {
        console.log("follow failed:",err);
      });
    },
    // unfollow a group, must supply {id: id} of group you want to unfollow
    unfollow(context,group) {
      return axios.delete("/api/users/" + context.state.user.id + "/follow/" + group,getAuthHeader()).then(response => {
        //context.dispatch('getPublicChannels');
        context.dispatch('getDirectChannels');
        context.dispatch('getChannel', -1);
      }).catch(err => {
        console.log("unfollow failed:",err);
      });
    },
    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
       console.log("initialize");
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('setToken',token);
         console.log("init "+response.data.user.id+ " "+context.state.channelId);
         context.commit('setUser',response.data.user);
         context.dispatch('getDirectChannels');
         //this.$router.push({ path: '/' });
         context.commit('setChannelError','');
         if ( context.state.channelId) {
            context.dispatch('getChannel', context.state.channelId);
         }
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('setUser',{}); 
         context.commit('setToken','');
       });
      }
    },
  }
});
