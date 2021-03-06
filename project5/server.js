// Express Setup //
const express = require('express');
const bodyParser = require("body-parser");
const when = require('when');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

// Knex Setup //
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log("TOKEN: "+token+ " "+req.headers);
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  knex('users').where('id',req.userID).first().select('username','name','id').then(user => {
    console.log(user+ " "+user.id);
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

// Login //

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
       let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
       });
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
    } else {
       res.status(403).send("Invalid credentials");
    }
    //if (result)
    //  res.status(200).json({user:{username:user.username,name:user.name,id:user.id}});
    //else
    //  res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Channels //

// Get all the entries for one of your channels
app.get('/api/channels/:gid/:id', verifyToken, (req, res) => {
  console.log("here7");
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);

  let gid = parseInt(req.params.gid);
  let id = parseInt(req.params.id);

  console.log("gid:"+gid);
  console.log("id:"+id);

  knex('followers').where('user_id', id).where('follows_id', gid).first().then(user => {
      console.log("HERE10"+user);
      if (typeof user === 'undefined') {
           res.status(500).json( "Not authorized" );
           sent = 1;
           return;
      } else {


  // get user record
  knex('users').join('tweets', 'users.id', 'tweets.user_id')
    .where('group_id',gid)
    .orderBy('created', 'desc')
    .select('tweets.id','tweet','username','name', 'created', 'user_id as userID', 'group_id').then(tweets => {
    res.status(200).json({tweets:tweets});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });

  }});
});

app.delete('/api/channels/:gid/:id/:msg_id', verifyToken, (req,res) => {
  let gid = parseInt(req.params.gid);
  let id = parseInt(req.params.id);
  let msg_id = parseInt(req.params.msg_id);
  console.log("gid "+gid+ " id "+id+ " msgid "+msg_id);  

  let sent = 0;
  knex('followers').where('user_id', id).where('follows_id', gid).first().then(user => {
      console.log("HERE10"+user);
      if (typeof user === 'undefined') {
           res.status(500).json( "Not authorized" );
           sent = 1;
           return;
      } else {

  if (sent == 1) { return; }
  console.log("here10");

  knex('users').where('id',id).first().then(user => {
    return knex('tweets').where('id', msg_id).first().del()
        .catch(error => { res.status(500).json({error}); sent = 1; } );
  }).then(tweet => {
    if (sent != 1) {
       res.status(200).json({tweet:tweet});
       return;
    }
  }).catch(error => {
    if (sent != 1) {
      console.log(error);
      res.status(500).json({ error });
    }
  });

  }});
});

// search for text in my subscribed channels
/*app.post('/api/channels/searchText/:id', (req, res) => {
  // person id
  console.log("here9 "+req.params.id+ " "+req.body.keywords);
  let id = parseInt(req.params.id);
  if (typeof id === 'undefined') { res.status(404).send(); }

  if (!req.body.keywords)
    return res.status(400).send();
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  knex('users').join('tweets','users.id','tweets.user_id')
    .join('followers', 'followers.follows_id', 'tweets.group_id')
    .join('groups', 'groups.group_id', 'tweets.group_id')
    .whereRaw("MATCH (tweet) AGAINST('" + req.body.keywords + "')")
    .where('followers.user_id', id)
    .orderBy('created','desc')
    .limit(limit)
    .offset(offset)
    .select('tweet','username','users.name','tweets.created','users.id as userID', 'groups.name as groupName').then(tweets => {
      res.status(200).json({tweets:tweets});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});*/

// Get all the public channels
/*app.get('/api/channels', (req, res) => {
  // let id = parseInt(req.params.id);
  // get user record
  knex('groups').where('public',1).where('direct',0).select('group_id','name','description','public', 'direct').then(groups => {
    res.status(200).json({groups:groups});
  }).catch(error => {
    res.status(500).json({ error });
  });
});*/

// Make that channel direct
app.put('/api/channels/:gid', verifyToken, (req, res) => {
  let gid = parseInt(req.params.gid);
  console.log(gid);
  if (typeof gid === 'undefined') { return res.status(400).send(); }

  knex('groups').where('group_id', gid).update({ 'direct': 1 }).then(() => {
      console.log("updated");
      res.status(200).json({groups: 'none'});
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Create a channel
app.post('/api/channels', verifyToken, (req, res) => {
  console.log("CREATE: "+req.body.groupname+ " "+req.body.description);
  if (!req.body.groupname || typeof req.body.description === 'undefined'
        || typeof req.body.public === 'undefined' || typeof req.body.direct === 'undefined') {
    console.log("HERE");
    return res.status(400).send(); 
  }
  knex('groups').where('name', req.body.groupname).first().then(user => {
    if (user !== undefined) {
      console.log("Reopen group "+user);
      res.status(200).send({group:user.group_id});
      throw new Error('abort');
    }
  }).then(() => {
    return knex('groups').insert({name: req.body.groupname, description:req.body.description,
                                 public:req.body.public, direct: 0}); // make the call to direct on your own
  }).then(group => {
    console.log("Creating group");
    console.log(group);
    res.status(200).json({group:group});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Users //

app.get('/api/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  // get user record
  knex('users').where('id',id).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});


app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
				 name:req.body.name, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    //res.status(200).json({user:user});
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user,token:token});

    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

/*
app.delete('/api/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().del().then(user => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
*/

// User Tweets //

// Get the channels a user is subscribed to
/*app.get('/api/channels/user/1/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('followers').join('groups','followers.follows','groups.group_id')
    .where('followers.user_id',id)
    .where('groups.channel', 1)
    .orderBy('name','asc') //asc is default anyway but yeah
    .select('group_id', 'name','description', 'public', 'channel').then(tweets => {
      res.status(200).json({groups:tweets});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});*/

// Get the direct message groups a user is subscribed to
app.get('/api/channels/user/1/:id', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  console.log("here6 "+req.params.id);
  knex('followers').join('groups','followers.follows_id','groups.group_id')
    .where('followers.user_id',id)
    .where('groups.direct', 1)
    .orderBy('name','asc') //asc is default anyway but yeah
    .select('group_id', 'name','description', 'public', 'direct').then(tweets => {
      res.status(200).json({groups:tweets});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Post to a group channel
app.post('/api/channels/:id/:gid', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  let gid = parseInt(req.params.gid);
  let sent =0;
  knex('followers').where('user_id', id).where('follows_id', gid).first().then(user => {
      console.log("HERE10"+user);
      if (typeof user === 'undefined') { 
           res.status(500).json( "Not authorized" ); 
           sent = 1;
           return; 
      } else {

  if (sent == 1) { return; }
  console.log("here10");

  knex('users').where('id',id).first().then(user => {
   return knex('tweets').insert({user_id: id, tweet:req.body.tweet, created: new Date(),group_id: gid});
   // }); //.catch(error => { res.status(500).json({error}); } );
  }).then(ids => {
    return knex('tweets').where('id',ids[0]).first();
  }).then(tweet => {
    res.status(200).json({tweet:tweet});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });

  }});
});

/*
app.delete('/api/users/:id/tweets/:tweetId', (req, res) => {
  let id = parseInt(req.params.id);
  let tweetId = parseInt(req.params.tweetId);
  knex('users').where('id',id).first().then(user => {
    return knex('tweets').where({'user_id':id,id:tweetId}).first().del();
  }).then(tweets => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
*/

// All Tweets //

/*app.get('/api/tweets/search', (req, res) => {
  if (!req.query.keywords)
    return res.status(400).send();
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  knex('users').join('tweets','users.id','tweets.user_id')
    .whereRaw("MATCH (tweet) AGAINST('" + req.query.keywords + "')")
    .orderBy('created','desc')
    .limit(limit)
    .offset(offset)
    .select('tweet','username','name','created','users.id as userID').then(tweets => {
      res.status(200).json({tweets:tweets});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

app.get('/api/tweets/hash/:hashtag', (req, res) => {
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  knex('users').join('tweets','users.id','tweets.user_id')
    .whereRaw("tweet REGEXP '^#" + req.params.hashtag + "' OR tweet REGEXP ' #" + req.params.hashtag + "'")
    .orderBy('created','desc')
    .limit(limit)
    .offset(offset)
    .select('tweet','username','name','created','users.id as userID').then(tweets => {
      res.status(200).json({tweets:tweets});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});*/

// Followers //

app.get('/api/users/name/:id', verifyToken, (req,res) => {
  let id = req.params.id;
  console.log("GetUser:"+id);
  knex('users').where('username', id).first().then(user => {
        if (!user) { throw new Error("Username does not exist") };
        return user.id;
     }).then( id => {res.status(200).json(id);} ).catch(error => { console.log(error); res.status(500).json("Username does not exist."); });
});

// follow a group. Pass in object with id.
app.post('/api/users/:id/follow', verifyToken, (req,res) => {
  // id of the person who is following
  let id = parseInt(req.params.id);
  // id of the group who is being followed
  let follows;
  if (req.body.id) { follows = req.body.id; }
  /*else {
     console.log(req.body.username);
     follows = when(knex('users').where('username', req.body.username).first().then(user => {
        if (!user) { throw new Error("Username does not exist") };
        return user.id;
     }).catch(error => { console.log(error); res.status(500).json("Username does not exist."); }));
  }*/

  console.log("FOLLOWS: "+follows);
  // make sure both of these users exist
  knex('users').where('id',id).first().then(user => {
    return knex('groups').where('group_id',follows).first();
  }).then(group => {
    if (!group) {
         throw new Error("Channel does not exist");
    }

    // Make sure the group is a channel (open to join)
    if (group.channel === 0) {
         throw new Error("Channel not open to join.");
    }

    // make sure entry doesn't already exist
    return knex('followers').where({user_id:id,follows_id:follows}).first();
  }).then(entry => {
    if (entry === undefined)
      // insert the entry in the followers table
      return knex('followers').insert({user_id: id, follows_id:follows});
    else
      return true;
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

// unfollow a group
app.delete('/api/users/:id/follow/:follower', verifyToken, (req,res) => {
  // id of the person who is following
  let id = parseInt(req.params.id);
  // id of the person who is being followed
  let follows = parseInt(req.params.follower);
  // make sure both of these users exist
  knex('users').where('id',id).first().then(user => {
    return knex('groups').where('group_id',follows).first();
  }).then(user => {
    // delete the entry in the followers table
    return knex('followers').where({'user_id':id,follows_id:follows}).first().del();
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

// get list of people you are following
/*app.get('/api/users/:id/follow', (req,res) => {
  // id of the person we are interested in
  let id = parseInt(req.params.id);
  // get people this person is following
  knex('users').join('followers','users.id','followers.follows_id')
    .where('followers.user_id',id)
    .select('username','name','users.id').then(users => {
      res.status(200).json({users:users});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});*/

// get list of people who are following you
/*app.get('/api/users/:id/followers', (req,res) => {
  // id of the person we are interested in
  let id = parseInt(req.params.id);
  // get people who are following of this person
  knex('users').join('followers','users.id','followers.user_id')
    .where('followers.follows_id',id)
    .select('username','name','users.id').then(users => {
      res.status(200).json({users:users});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});*/

// get the tweets of those you are following
// use limit to limit the results to a certain number
// use offset to provide an offset into the results (e.g., starting at results number 10)
/*app.get('/api/users/:id/feed', (req,res) => {
  // id of the person we are interested in
  let id = parseInt(req.params.id);
  // offset into the results
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  // number of results we should return
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  // get people this person is following
  knex('followers').where('followers.user_id',id).then(followed => {
    // get tweets from this users plus people this user follows
    let following = followed.map(entry=>entry.follows_id);
    following.push(id);
    return knex('tweets').join('users','tweets.user_id','users.id')
      .whereIn('tweets.user_id',following)
      .orderBy('created','desc')
      .limit(limit)
      .offset(offset)
      .select('tweet','username','name','created','users.id as userID');
  }).then(tweets => {
    res.status(200).json({tweets:tweets});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});*/


app.listen(3000, () => console.log('Server listening on port 3000!'));
