class ChatEngine{constructor(e,s){console.log("Inside chat constructor"),this.chatBox=$("#"+e),this.userEmail=s,console.log(s),this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("connection established using sockets...!"),e.socket.emit("join_room",{user_email:e.userEmail,chatroom:"codeial"}),e.socket.on("user_joined",(function(e){console.log("a user joined",e)}))})),$("#send-message").click((function(){let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,chatroom:"codeial"})})),e.socket.on("receive_message",(function(s){console.log("message received",s.message);let o=$("<li>"),n="other-message";console.log(s.user_email),console.log(e.userEmail),s.user_email==e.userEmail&&(n="self-message"),o.append($("<span>",{html:s.message})),o.append($("<sub>",{html:s.user_email})),o.addClass(n),console.log("****",o),$("#chat-message-list").append(o)}))}}