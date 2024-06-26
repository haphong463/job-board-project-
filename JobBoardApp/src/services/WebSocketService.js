import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "../store";
import { updateNotificationBySocket } from "../features/notificationSlice";
import { sendNotificationAsync } from "./NotificationService";

let stompClient = null;

export const connectWebSocket = (user) => {
  if (user) {
    const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_ENDPOINT);
    stompClient = new Client({
      webSocketFactory: () => socket,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        if (message.body) {
          const res = JSON.parse(message.body);
          if (user.id === res.recipient.id) {
            handleReciptMessage(res);
          }
        }
      });
    };

    stompClient.activate();
  }
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
};

const handleReciptMessage = async (reciptMessage) => {
  store.dispatch(updateNotificationBySocket(reciptMessage));
};
