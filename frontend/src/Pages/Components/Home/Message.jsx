import React from "react";
import "./Styles/Message.css";

function formatMessageTime(isoString) {
  const messageDate = new Date(isoString);
  const now = new Date();

  const isToday =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  const timeString = messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return timeString;
  } else {
    const dateString = messageDate.toLocaleDateString('es-SV');
    return `${dateString} ${timeString}`;
  }
}

export const Message = React.memo(({ username, time, text }) => {
    return(
        <div className="messageContainer">
            <img className="userImage" src="/defaultPfp.png" alt="User profile" />

            <div className="messageContentContainer">
                <div className="messageNameTimeContainer">
                    <label className="messageName">{username}</label>
                    <label className="messageTime">{formatMessageTime(time)}</label>
                </div>

                <label className="messageContent">{text}</label>
            </div>
        </div>
    )
})