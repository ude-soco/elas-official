require("dotenv").config();
const userRouter = require("express").Router();

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
      const { Configuration, OpenAIApi } = require("openai");

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      console.log("Sending message to ChatGPT");

      const close = () => {
        res.end();
      };

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Encoding": "none",
      });

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
