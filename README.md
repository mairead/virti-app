# virti-app
webRTC React socket.io

https://hidden-sierra-24434.herokuapp.com/

## How to run the application
- Clone the master branch into a local repository
- Ensure you are running Node 12. (I use nvm) 
- Run `npm install` in the root directory
- The command to run the server locally is `node index.js`
- `cd` into the `/client` directory and run `npm install`
- The command to run the client locally is `npm start`
- go to `localhost:3000` and you should see the homepage which allows you to choose a room
- Type any keyword and click join room
- you can now send the URL to another user/browser window to join the same room
- multiple users can join the same room because the messages are using broadcast to emit to all connected users

**OR**
- alternatively you can visit https://hidden-sierra-24434.herokuapp.com/ and follow the same instructions to create and join a room

 
## Process

I started with a refresher on basic WebRCT with the Google Codelabs example. I really like the snapshot of video feature so I took that as a basis for what I wanted to achieve. Then I looked for examples where people were using React hooks and Create react app to provide the client components so I could smush them together and make a React version. You can see a list of the tutorials I followed below:

- https://medium.com/swlh/build-a-real-time-chat-app-with-react-hooks-and-socket-io-4859c9afecb0
- https://blog.logrocket.com/get-a-basic-chat-application-working-with-webrtc/
- https://codelabs.developers.google.com/codelabs/webrtc-web#9
- https://github.com/coding-with-chaim/native-webrtc

Once I had a basic chat example working I started looking into deploying this onto Heroku and I realised I had to switch out my NodeStatic server for Express to be able to specify the static build folders for a compiled React app in the client. I got bogged down a lot trying get the CORS to stop complaining in localhost

Deployment examples for React/RTC to heroku:
- https://github.com/mars/heroku-cra-node
- https://eugrdn.me/blog/react-socketio-heroku/
- https://www.youtube.com/watch?v=CrZ2JgLljAk

Once I had a basic mesage app running I went back to add in the video capability but I realised I couldn't view the video capture across two devices because I was running it in localhost and not through https so then I started looking at utilities for adding self cert locally and found https://www.npmjs.com/package/https-localhost which is built on top of mkcert but I chickened out in the end and just pushed it up onto heroku

## Decisions
I've done a bit of RTC stuff in the past but the last time I tried to work with it I found out PeerJS is not really supported any more and I didn't have any STUN or TURN provision so this time I started looking for examples where that was explicitly mentioned. I wasn't sure how robust the application had to be. 

I opted for Heroku for deployment because I've always used it in the past and I really like their documentation but I've also heard good things about netlify which seems very popular with the React community. 

## Concerns
I was surprised when my phone was able to connect over our home wifi before I added any STUN config. Although we have changed our home network since I last tried and failed to get something like this working which may account for that. I'd like to understand more about that and I'd like to be able to inspect the network traffic in a clearer way because I'm still hazy on exactly what's happening at the NAT layer. I found a couple of suggestions for plugins and extensions for debugging that.

Also the last time I tried to implement this feature I had to create an SSL certificate for the STUN service and I was expecting that to be a requirement for hosting in HTTPS. Even though the heroku app is deployed on HTTPS I'd like to understand whether the messaging is actually encrypted and how that works because I'm not hugely experienced in deployment and security architecture

I got it working across 2 separate laptops. The chat room page doesn't seem to load at all on our ancient ipad. I didn't bother debugging what was happening there. I made my brother test the remote connection from his flat in London. The text messaging worked but not the camera feed. I am guessing that's because it needs a TURN server to pipe the media stream in the data channel across the network but the text messaging could be passed more easily through STUN?

##  Further work
The first place I would start on improving the application is refactoring the logic into smaller hooks. It's got two separate calls to connect to socket.io (because I was using 2 different examples to make the chat messages and the video messages) so I would implement a single call and then pass that down to the children components using a context provider so they could share the connection. I put all the logic into a single component to make it easier to write quickly but if I was putting this into production I would break it down into smaller chunks and write unit tests around my chunks. I decided I'd rather spend my time trying to get the interesting RTC stuff to work rather than refactoring React

If I was going to extend the app to handle multiple users then I would probably want to hold a collection of instantiated peer connections and the session state of users joined to each room in the server. In a production scenario you'd probably want to bolt some kind of authentication on to users so I'm assuming you'd have a DB of users already.

On the client side you'd probably want to expose the number of users connected to a room and their user details like name so I'd send that back to React to hold in client state, either in Redux or using a context provider.

This HTML5rocks article goes into some good detail on different artchitectures for multi-person use https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/. Would you want to implement the Multipoint Control Unit suggested here to hold the media streams and send to connected peers?

My primary concern would be video quality and bandwidth usage if you were to scale this application. You might want to create dynamic constraints on the video streaming. https://webrtc.org/getting-started/media-capture-and-constraints. I might also be concerned about device support. I've come across https://test.webrtc.org/ in the past which lets you inspect what your devices network capabilities are. I guess you'd want to make sure you've got a decent support list and that you can test those devices in those networking scenarios. Is it possible to mimic real world scenarios with throttling or controls? This seems like a challenge. 

If you were paying for a hosted TURN server then I guess you might come up against increased costs in streaming video through the service. I've come across a handful of streaming services in the past. Twilio.io and Liveswitch.io are the full hosting service and expose their servers with an API. https://xirsys.com/ are a hosted TURN server so you would build your own streaming servers and just use their servers as a proxy gateway for the NAT traversal. You could also build and deploy your own TURN server so I guess it is a question of development cost and effort over absorbing the cost of paying for someone else's service. 

I also came across callstats.io whilst looking for competitors of Liveswitch which looks like it might be a useful tool for getting live performance metrics. I've also come across https://testrtc.com/ in the past too and it looks really useful if you're serious about making production RTC applications
