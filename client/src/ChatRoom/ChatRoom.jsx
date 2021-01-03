import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

import "./ChatRoom.scss";
import useChat from "../useChat";

const ChatRoom = (props) => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const photoSnapshot = useRef();

  const { roomID } = props.match.params;
  const { messages, sendMessage } = useChat(roomID);
  const [newMessage, setNewMessage] = React.useState("");

  const photoContext = useRef();
  const photoContextW = 160;
  const photoContextH = 120;

  let dataChannel;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      photoContext.current = photoSnapshot.current.getContext('2d');

      socketRef.current = io.connect("/");
      socketRef.current.emit("join room", roomID);

      socketRef.current.on('other user', userID => {
        callUser(userID);
        otherUser.current = userID;
      });

      socketRef.current.on("user joined", userID => {
        otherUser.current = userID;
      });

      socketRef.current.on("offer", handleReceiveCall);

      socketRef.current.on("answer", handleAnswer);

      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
    });
  }, []);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleSendPhoto = () => {}

  // const handleSendPhoto = () => {
  //   //need photoContext from canvas, and also width and height
  //   // need datachannel ref

  //   // Split data channel message in chunks of this byte length.
  //   var CHUNK_LEN = 64000;
  //   console.log('width and height ', photoContextW, photoContextH);
  //   const img = photoContext.current.getImageData(0, 0, photoContextW, photoContextH),
  //   len = img.data.byteLength,
  //   n = len / CHUNK_LEN | 0;

  //   console.log('Sending a total of ' + len + ' byte(s)');

  //   if (!dataChannel) {
  //     logError('Connection has not been initiated. ' +
  //       'Get two peers in the same room first');
  //     return;
  //   } else if (dataChannel.readyState === 'closed') {
  //     logError('Connection was lost. Peer closed the connection.');
  //     return;
  //   }

  //   // this hasn't been set to open
  //   console.log('whats in dataChannel', dataChannel);

  //   dataChannel.send(len);

  //   // split the photo and send in chunks of about 64KB
  //   for (var i = 0; i < n; i++) {
  //     var start = i * CHUNK_LEN,
  //     end = (i + 1) * CHUNK_LEN;
  //     console.log(start + ' - ' + (end - 1));
  //     dataChannel.send(img.data.subarray(start, end));
  //   }

  //   // send the reminder, if any
  //   if (len % CHUNK_LEN) {
  //     console.log('last ' + len % CHUNK_LEN + ' byte(s)');
  //     dataChannel.send(img.data.subarray(n * CHUNK_LEN));
  //   }
  // }

  // function receiveDataChromeFactory() {
  //   var buf, count;

  //   return function onmessage(event) {
  //     if (typeof event.data === 'string') {
  //       buf = window.buf = new Uint8ClampedArray(parseInt(event.data));
  //       count = 0;
  //       console.log('Expecting a total of ' + buf.byteLength + ' bytes');
  //       return;
  //     }

  //     var data = new Uint8ClampedArray(event.data);
  //     buf.set(data, count);

  //     count += data.byteLength;
  //     console.log('count: ' + count);

  //     if (count === buf.byteLength) {
  //       // we're done: all data chunks have been received
  //       console.log('Done. Rendering photo.');
  //       renderPhoto(buf);
  //     }
  //   }
  // }

  // function logError(err) {
  //   if (!err) return;
  //   if (typeof err === 'string') {
  //     console.warn(err);
  //   } else {
  //     console.warn(err.toString(), err);
  //   }
  // }

  // function renderPhoto(data) {
  //   // append canvas tag to a JSX component - create element?
  //   var canvas = document.createElement('canvas');

  //   canvas.width = photoContextW;
  //   canvas.height = photoContextH;
  //   canvas.classList.add('incomingPhoto');

  //   // TODO - adding photos into stream of messages here instead of appending to div
  //   // trail is the element holding the incoming images
  //   // trail.insertBefore(canvas, trail.firstChild);

  //   var context = canvas.getContext('2d');
  //   var img = context.createImageData(photoContextW, photoContextH);
  //   img.data.set(data);
  //   context.putImageData(img, 0, 0);
  // }

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));

    dataChannel = peerRef.current.createDataChannel('photos');
    console.log('dataChannel after creation?', dataChannel);
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [{
        'urls': 'stun:stun.l.google.com:19302',
      }]
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleOnDataChannel(e) {
    const channel = e.channel;
    console.log('onDataChannelCreated when peer is created:', channel);

    channel.onopen = function() {
      console.log('Channel open');
    };

    channel.onclose = function () {
      console.log('Channel closed.');
    }

    // channel.onmessage = receiveDataChromeFactory();
    // onDataChannelCreated(dataChannel);
  };

  function handleNegotiationNeededEvent(userID) {
    peerRef.current.createOffer().then(offer => {
      return peerRef.current.setLocalDescription(offer);
    }).then(() => {
      const payload = {
        target: userID,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription
      };
      socketRef.current.emit("offer", payload);
    }).catch(e => console.log(e));
  }

  function handleReceiveCall(incoming) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current.setRemoteDescription(desc).then(() => {
      userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }).then(() => {
      return peerRef.current.createAnswer();
    }).then(answer => {
      return peerRef.current.setLocalDescription(answer);
    }).then(() => {
      const payload = {
        target: incoming.caller,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription
      }
      socketRef.current.emit("answer", payload);
    })

    peerRef.current.ondatachannel = handleOnDataChannel;
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      }
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate)
    .catch(e => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  };

  return (
    <div className="chat-room-container">
      <h1>You are currently in {roomID}</h1>
      <div className="videos">
        <video autoPlay ref={userVideo} className="video-container" />
        <video autoPlay ref={partnerVideo} className="video-container" />
      </div>
      <button onClick={handleSendPhoto} className="send-message-button send-photo-button">
        Send photo
      </button>
      <div className="photo-container">
        <canvas ref={photoSnapshot} className="snapshot"/>
      </div>
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))}
        </ol>
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
