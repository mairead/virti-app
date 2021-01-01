# virti-app
webRTC React socket.io

https://hidden-sierra-24434.herokuapp.com/

## How to run the application
- Clone the master branch into a local repository
- Ensure you are running Node 12 
- Run npm install in the root directory
- The command to run the server locally is node index.js
- cd into the /client directory and run npm install
- The command to run the client locally is npm start
- go to localhost:3000 and you should see the homepage which allows you to choose a room
- Type any keyword and click join room
- you can now send the URL to another user/browser window to join the same room
- multiple users can join the same room

**OR**
- alternatively you can visit https://hidden-sierra-24434.herokuapp.com/ and follow the same instructions to create and join a room

 
## Process

I started with a refresher on basic WebRCT with the Google Codelabs example. I really like the snapshot of video feature so I took that as a basis for what I wanted to achieve. Then I looked for examples where people were using React hooks and Create react app to provide the client components so I could smush them together and make a React version. You can see a list of the tutorials I followed below:

- https://medium.com/swlh/build-a-real-time-chat-app-with-react-hooks-and-socket-io-4859c9afecb0
- https://blog.logrocket.com/get-a-basic-chat-application-working-with-webrtc/
- https://codelabs.developers.google.com/codelabs/webrtc-web#9
- https://github.com/coding-with-chaim/native-webrtc

Once I had a basic chat example working I started looking into deploying this onto Heroku and I realised I had to switch out my NodeStatic server for express to be able to specify the static build folders for a compiled React app in the client. I got bogged down a lot trying get the CORS to stop complaining in localhost

Deployment examples for React/RTC to heroku:
https://github.com/mars/heroku-cra-node
https://eugrdn.me/blog/react-socketio-heroku/
https://www.youtube.com/watch?v=CrZ2JgLljAk

## Decisions
I've done a lot of RTC stuff in the past but the last time I tried to work with it I found out PeerJS is not really supported and I didn't have any STUN or TURN provision so this time I specifically started looking for examples where that was explicitly mentioned. I wasn't sure how robust the application had to be

## Concerns
There isn't any STUN server configured in the app as it stands so I was actually surprised when my phone was able to connect over our home wifi. Although we have changed our home network since I last tried and failed to get something like this working which may account for that. I'd like to understand more about that and I'd like to be able to inspect the network traffic in a clearer way

## Research
- expand to more than two users
- add streaming for observation
- frameworks and solutions
- obstacles and pitfalls
