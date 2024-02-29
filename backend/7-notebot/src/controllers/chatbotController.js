require("dotenv").config();
const userRouter = require("express").Router();

// This function sets up a route handler for POST requests to the root endpoint ("/")
userRouter.post("/", async (req, res, next) => {
  try {
    const { message } = req.body;
    // Make a request to the ChatGPT API

    // Create an array to hold both user and ChatGPT messages
    const messages = [
      { role: "user", content: message }, // User message
      { role: "assistant", content: "" }, // ChatGPT message (initially empty)
    ];

    try {
      // Import necessary modules from the 'openai' package
      const { Configuration, OpenAIApi } = require("openai");

      // Create a new Configuration instance with the OpenAI API key from environment variables
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      // Log a message indicating that a message is being sent to ChatGPT
      console.log("Sending message to ChatGPT");

      // Define a function to end the response
      const close = () => {
        res.end();
      };

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Encoding": "none",
      });

      // Send a message to ChatGPT and listen for responses
      const completion = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: messages, // Pass the messages array
          temperature: 0.2,
          stream: true,
        },
        {
          responseType: "stream",
        }
      );

      // Handle incoming data from the response stream
      completion.data.on("data", (data) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          const message = line.replace(/^data: /, "");
          if (message === "[DONE]") {
            res.end();
          }

          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0].delta.content;

            if (!content) {
              continue;
            }
            res.write(`data: ${content}`);
          } catch (error) {
            // console.error('Could not JSON parse stream message', message, error)
          }
        }
      });

      completion.data.on("close", close);

      res.on("close", close);
    } catch (error) {
      console.error("Error in ChatGPT route:", error);
      //res.status(500).json({ 'Something went wrong' })
      return next(error);
    }
  } catch (error) {
    console.error("Error in request:", error);
    //res.status(500).json({ 'Something went wrong' });
    return next(error);
  }
});

module.exports = userRouter;
