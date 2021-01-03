# virti-app
webRTC React socket.io

https://hidden-sierra-24434.herokuapp.com/

## How to run the application
- Clone the `master` branch into a local repository
- Ensure you are running Node 12
- Run `npm install` in the root directory
- The command to run the server locally is `node index.js`
- `cd` into the `/client` directory and run `npm install`
- The command to run the client locally is `npm start`
- go to `localhost:3000` and you should see the homepage which allows you to choose a room
- Type any keyword and click join room
- you can now send the URL to another user/browser window to join the same room
- **OR** alternatively you can visit https://hidden-sierra-24434.herokuapp.com/ and follow the same instructions to create and join a room
- Once you have two browser windows pointing at the same URL you should see two video camera feeds, one from each device
- If you type a message into the textarea you should see your own message appear in your window, and the same message appear in the second browser

 
## Process
I started with a refresher on basic WebRCT with the Google Codelabs example. I really like the snapshot of video feature so I took that as a basis for what I wanted to achieve. Then I looked for examples where people were using React hooks and Create react app to provide the client components so I could smush them together and make a React version. You can see a list of the tutorials I followed below:

- https://medium.com/swlh/build-a-real-time-chat-app-with-react-hooks-and-socket-io-4859c9afecb0
- https://blog.logrocket.com/get-a-basic-chat-application-working-with-webrtc/
- https://codelabs.developers.google.com/codelabs/webrtc-web#9
- https://github.com/coding-with-chaim/native-webrtc

Once I had a basic chat example working I started looking into deploying this onto Heroku and I realised I had to switch out my NodeStatic server for Express to be able to specify the static build folders for a compiled React app in the client. I got bogged down a lot trying get the CORS to stop complaining in localhost. It's still not happy about the webpack proxy specified 

Deployment examples for React/RTC to heroku:
- https://github.com/mars/heroku-cra-node
- https://eugrdn.me/blog/react-socketio-heroku/
- https://www.youtube.com/watch?v=CrZ2JgLljAk

After the simple mesage app was deployed I went back to add in the video capability but I realised I couldn't view the video capture across two devices because I was running it in localhost and not through https so then I started looking at utilities for adding self cert locally and found https://www.npmjs.com/package/https-localhost which is built on top of mkcert but I chickened out in the end and just pushed it up onto heroku instead.

The last thing I wanted to implement (but failed to get working because I ran out of time) was sending a photo via the data channel. As far as I could tell my ondatachannel method wasn't firing. One peer has to create the datachannel before creating the offer and then the ondatachannel method should fire when the next peer connects but I couldn't get that to fire and I'm not sure I was instantiating the data channel from the correct peer. You can see my workings in `master-with-snapshot` branch. 

## Decisions
I've done a bit of RTC stuff in the past but the last time I tried to work with it I found out PeerJS is not really supported any more and I didn't have any STUN or TURN provision so this time I started looking for examples where that was explicitly mentioned. I wasn't sure how robust the application had to be. 

I opted for Heroku for deployment because I've always used it in the past and I really like their documentation but I've also heard good things about netlify which seems very popular with the React community. 

The first place I would start on improving the application is refactoring the logic into smaller hooks. It's got two separate calls to connect to socket.io (because I was using 2 different examples to make the chat messages and the video messages) so I would implement a single call and then pass that down to the children components using a context provider so they could share the connection or pass the connection in as an argument to a useEffect hook. I put all the logic into a single component to make it easier to write quickly but if I was putting this into production I would break it down and write unit tests around it. I've only started using Hooks recently and I decided I'd rather spend my time trying to get the interesting RTC stuff to work rather than refactoring React. I've got some dependency errors in React useEffect because I'm using it to initialise a bunch of stuff 

## Concerns
I was surprised when my phone was able to connect over our home wifi before I added any STUN config because last time I tried RTC I couldn't get a separate device to connect at home. Although we have changed our home network since I last tried which may account for that. I'd like to understand more about that and I'd like to be able to inspect the network traffic in a clearer way because I'm still hazy on exactly what's happening at the NAT layer. I found a couple of suggestions for plugins and extensions for debugging that but I didn't get round to installing anything to debug that better.

I got it working across 2 separate laptops and from a laptop to a mobile. The chat room page doesn't seem to load at all on our ancient ipad. I didn't bother debugging what was happening there. I made my brother test the remote connection from a separate location. The connection was a bit flaky I think because we were trying to share an old connection to previous rooms we'd made. Once we created a new room and shared that as a new connection our video streams started working. He could hear my audio but I couldn't hear his. The messaging worked well. We couldn't get the video to connect at first and I wondered if that was a cross network issue to be begin with and the lack of TURN server. I found the https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/ utility for checking if you've got correct STUN and TURN config

The last time I tried to implement this feature I had to create an SSL certificate for the STUN service and I was expecting that to be a requirement for hosting in HTTPS. I added the Heroku ACM which lets you add a free cert from https://letsencrypt.org/. Even though the heroku app is deployed on HTTPS and it says it has a certificate I'd like to understand more about how the stream and messaging are encrypted and how that works because I'm not hugely experienced in deployment and security architecture

##  Further work
If I was going to extend the app to handle multiple users then I would probably want to hold a collection of instantiated peer connections and the session state of users joined to each room in the server. In a production scenario you'd probably want to bolt some kind of authentication on to users so I'm assuming you'd have a DB of users already.

On the client side you'd probably want to expose the number of users connected to a room and their user details like name so I'd send that back to React to hold in client state, either in Redux or using a context provider.

This HTML5rocks article goes into some good detail on different architectures for multi-person use https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/. Would you want to implement the Multipoint Control Unit suggested here to hold the media streams and send to connected peers?

My primary concern would be video quality and bandwidth usage if you were to scale this application. You might want to create dynamic constraints on the video streaming. https://webrtc.org/getting-started/media-capture-and-constraints. I might also be concerned about device support. I've come across https://test.webrtc.org/ in the past which lets you inspect what your devices network capabilities are. I guess you'd want to make sure you've got a decent support list and that you can test those devices in those networking scenarios. Is it possible to mimic real world scenarios with throttling or network emulators? This seems like a challenge. 

If you were paying for a hosted TURN server then I guess you might come up against increased costs in streaming video through the service. I've come across a handful of streaming services in the past. Twilio.io and Liveswitch.io are the full hosting service and expose their servers with an API. https://xirsys.com/ are a hosted TURN server so you would build your own streaming servers and just use their servers as a proxy gateway for the NAT traversal. You could also build and deploy your own TURN server so I guess it is a question of development cost and effort over absorbing the cost of paying for someone else's service. 

I came across callstats.io whilst looking for competitors of Liveswitch which looks like it might be a useful tool for getting live performance metrics and I've also seen https://testrtc.com/ in the past too and it looks really useful if you're serious about making production RTC applications
