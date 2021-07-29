const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const frontendDirPath = path.join(__dirname, "../UI");
app.use(express.static(frontendDirPath));

// A unique identifier for the given session
const sessionId = uuid.v4();

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

io.on("connection", (socket) => {
    socket.emit('chat', "Welcome! I am a robot, How may I help you?", "SchoolBot");

    socket.on('chat', (message, username) => {
        socket.emit('chat', message, username);
        
        runSample(message).then((data) => {
            socket.emit('chat', data, "SchoolBot");
        });
        
        async function runSample(message, projectId = 'schoolbot-cnfd') {

        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({
            keyFilename: "D:/Node Course/VScode JS files/Dialogflow-SchoolBot/schoolbot-cnfd-a6856521e0d3.json"
        });
        const sessionPath = sessionClient.projectAgentSessionPath(
          projectId,
          sessionId
        );
      
        // The text query request.
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              // The query to send to the dialogflow agent
              text: message,
              // The language used by the client (en-US)
              languageCode: 'en-US',
            },
          },
        };
      
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
        } else {
          console.log('  No intent matched.');
        }
        return result.fulfillmentText;
      }
    })
})

server.listen(port, () => {
    console.log(`Server is ready on ${port}...`);
})