const searchMessage = async (response, keyword) => {
  const matchingMessages = [];

  // Loop through the response data
  for (const messageObj of response) {
    console.log(messageObj);
    if (messageObj.message.includes(keyword)) {
      // If the message contains the keyword, add it to the matchingMessages array
      matchingMessages.push(messageObj);
    }
  }

  // Return the array of matching messages
  return matchingMessages;
};

module.exports = {
  searchMessage,
};
