import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "../store";
import {
  addBlogBySocket,
  deleteBlogBySocket,
  updateBlogBySocket,
} from "../features/blogSlice";

let stompClient = null;

export const connectWebSocket = () => {
  const socket = new SockJS(`http://localhost:8080/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("Connect to WebSocket");
    stompClient.subscribe("/topic/new-blog", (message) => {
      if (message.body) {
        const res = JSON.parse(message.body);
        handleNewBlog(res); // Handle new blog logic
      }
    });
    stompClient.subscribe("/topic/edit-blog", (message) => {
      if (message.body) {
        const res = JSON.parse(message.body);
        handleEditBlog(res); // Handle new blog logic
      }
    });
    stompClient.subscribe("/topic/delete-blog", (message) => {
      if (message.body) {
        const res = JSON.parse(message.body);
        handleDeleteBlog(res); // Handle new blog logic
      }
    });
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
  console.log("Disconnected from WebSocket");
};

const handleNewBlog = (newBlog) => {
  store.dispatch(addBlogBySocket(newBlog));
  // Handle UI update or other actions when a new blog is received
};

const handleEditBlog = (editBlog) => {
  store.dispatch(updateBlogBySocket(editBlog));
};

const handleDeleteBlog = (id) => {
  store.dispatch(deleteBlogBySocket(id));
};
