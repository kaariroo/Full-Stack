const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = message.type;

  console.log(message.type);
  console.log(notificationStyle);

  return <div className={notificationStyle}>{message.text}</div>;
};

export default Notification;
