const ThreatElem = (roomElem, threatType) => {
  const mainDiv = document.createElement("img");
  const img = mainDiv;

  // Set the image source based on the threat type
  switch (threatType) {
    case "Breach":
      img.src = "../images/Breach.png";
      break;
    case "Invader":
      img.src = "../images/Invader.png";
      break;
    case "Fire":
      img.src = "../images/Fire.png";
      break;
    default:
      console.error("Invalid threat type provided to ThreatElem.");
      return;
  }

  mainDiv.id = "threat";
  setToRoom(roomElem);

  function setToRoom(roomElem) {
    roomElem.appendChild(mainDiv);
  }

  return {
    roomElem: mainDiv,
  };
};
