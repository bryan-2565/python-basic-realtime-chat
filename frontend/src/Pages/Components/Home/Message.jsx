import React from "react";
import "./Styles/Message.css";

// ====================== UTILITIES ====================== //
// ██ Format message timestamp (today vs. other days)
function formatMessageTime(isoString) {
  const messageDate = new Date(isoString);
  const now = new Date();

  // ~~~~ Date Comparison ~~~~ //
  const isToday =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  // ~~~~ Time Formatting ~~~~ //
  const timeString = messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return isToday 
    ? timeString 
    : `${messageDate.toLocaleDateString('es-SV')} ${timeString}`;
}

// ====================== COMPONENTS ====================== //
// ******************** MESSAGE ******************** //
export const Message = React.memo(({ pfp, username, time, text }) => {
    return (
      <div className="messageContainer">
          {/* · User Avatar · */}
          <img src={pfp || "/defaultPfp.png"} alt="User profile"/>

          {/* · Message Content · */}
          <div className='messageContent'>
              {/* › Header ‹ */}
              <div className="messageHeader">
                  <span className='messageName'>{username}</span>
                  <span>{formatMessageTime(time)}</span>
              </div>
              
              {/* › Text ‹ */}
              <p className='messageText'>{text}</p>
          </div>
      </div>
    )
})

// ******************** MESSAGE PLACEHOLDER ******************** //
export const MessagePlaceholder = React.memo(() => {
    return (
        <div className="messageContainer">
            {/* · Skeleton Avatar · */}
            <div className="userImage skeleton" />

            {/* · Skeleton Content · */}
            <div className="messageContent">
                {/* › Skeleton Header ‹ */}
                <div className="messageHeaderPlaceholder skeleton"/>

                {/* › Skeleton Text ‹ */}
                <div className="messageTextPlaceholder skeleton"/>
            </div>
        </div>
    )
})