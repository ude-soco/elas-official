const { Configuration, OpenAIApi } = require("openai");
//const backoff = require('backoff');
// const HttpError = require("../model/http-error");

const openAIConfig = new Configuration(
  (params = {
    organization: "org-65qL0uV70AbvbEVHEZcr9iD8",
    apiKey: "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",
  })
);

const openapi = new OpenAIApi(openAIConfig);

const chatCompletion = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openapi.createCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "bot", content: "Hello, I am a chatbot. I am very smart." },
          { role: "user", content: prompt },
        ],
      },
      {
        responseType: "stream",
      }
    );

    response.data.on("data", (data) => {
 
      const string = data
        .toString()
        .substring(6)
        .replace(/^\s+|\s+$/g, "");

      try {
        const json = JSON.parse(string);

        const content = json.choices[0].delta.content;
 
        res.write(`data: ${content}`);
      } catch (error) {
        console.log("erro",  error, string);
      }
    });

    response.data.on("close", close);

    res.on("close", close);

    // res.status(200).json({ bot: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// const chatCompletion = async (req, res) => {
//     try {
//       const { prompt } = req.body;

//       const answer = await makeAPIRequestWithRateLimit(prompt);

//       const text = answer.choices[0].text;

//       res.status(200).json({ text });
//     } catch (err) {
//       res.status(500).json({
//         message: err.message,
//       });
//     }
//   };

//   const makeAPIRequestWithRateLimit = async (prompt) => {
//     const maxRetries = 5;
//     let retryDelay = 1000;

//     for (let retry = 0; retry < maxRetries; retry++) {
//       try {
//         const answer = await openapi.createCompletion({
//           model: "text-davinci-003",
//           prompt: `${prompt}`,
//           temperature: 0,
//           max_tokens: 3000,
//           top_p: 1,
//           frequency_penalty: 0.5,
//           presence_penalty: 0,
//         });

//         return answer;
//       } catch (error) {
//         if (error.response && error.response.status === 429) {
//           await wait(retryDelay);
//           retryDelay *= 2;
//         } else {
//           throw error;
//         }
//       }
//     }
//     throw new Error("Rate limit exceeded, and maximum retries reached.");
//   };

//   const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.chatCompletion = chatCompletion;
