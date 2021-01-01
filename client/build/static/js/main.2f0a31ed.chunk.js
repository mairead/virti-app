(this["webpackJsonpsocket.io-react-hooks-chat"]=this["webpackJsonpsocket.io-react-hooks-chat"]||[]).push([[0],{55:function(e,t,n){e.exports=n(98)},60:function(e,t,n){},61:function(e,t,n){},66:function(e,t,n){},97:function(e,t,n){},98:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),o=n(51),r=n.n(o),s=n(22),l=n(1),i=(n(60),n(13)),m=(n(61),function(){var e=c.a.useState(""),t=Object(i.a)(e,2),n=t[0],a=t[1];return c.a.createElement("div",{className:"home-container"},c.a.createElement("h1",null,"Welcome to virti chat"),c.a.createElement("p",null,"Please choose a room"),c.a.createElement("input",{type:"text",placeholder:"Enter room name",value:n,onChange:function(e){a(e.target.value)},className:"text-input-field"}),c.a.createElement(s.b,{to:"/".concat(n),className:"enter-room-button"},"Join room"))}),u=(n(66),n(54)),d=n(32),g=n(53),h=n.n(g),f=function(e){var t=Object(a.useState)([]),n=Object(i.a)(t,2),c=n[0],o=n[1],r=Object(a.useRef)();Object(a.useEffect)((function(){return r.current.connect("/"),r.current=h()("/"),r.current.on("message",(function(e){var t=Object(d.a)(Object(d.a)({},e),{},{ownedByCurrentUser:e.senderId===r.current.id});o((function(e){return[].concat(Object(u.a)(e),[t])}))})),function(){r.current.disconnect()}}),[e]);return{messages:c,sendMessage:function(e){r.current.emit("message",{body:e,senderId:r.current.id})}}},v=function(e){var t=e.match.params.roomId,n=f(t),a=n.messages,o=n.sendMessage,r=c.a.useState(""),s=Object(i.a)(r,2),l=s[0],m=s[1];return c.a.createElement("div",{className:"chat-room-container"},c.a.createElement("h1",{className:"room-name"},"You are currently in ",t),c.a.createElement("div",{className:"messages-container"},c.a.createElement("ol",{className:"messages-list"},a.map((function(e,t){return c.a.createElement("li",{key:t,className:"message-item ".concat(e.ownedByCurrentUser?"my-message":"received-message")},e.body)})))),c.a.createElement("textarea",{value:l,onChange:function(e){m(e.target.value)},placeholder:"Write message...",className:"new-message-input-field"}),c.a.createElement("button",{onClick:function(){o(l),m("")},className:"send-message-button"},"Send"))},E=(n(97),function(e){var t=e.children;return c.a.createElement("div",{className:"layout"},c.a.createElement("img",{src:"virti_logo.png",alt:"virti logo",className:"layout__logo"}),t)});var p=function(){return console.log("env???","production"),c.a.createElement(s.a,null,c.a.createElement(E,null,c.a.createElement(l.c,null,c.a.createElement(l.a,{exact:!0,path:"/",component:m}),c.a.createElement(l.a,{exact:!0,path:"/:roomId",component:v}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[55,1,2]]]);
//# sourceMappingURL=main.2f0a31ed.chunk.js.map