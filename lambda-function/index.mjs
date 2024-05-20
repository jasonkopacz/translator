// index.mjs
import { Translator } from "deepl-node";
import dotenv from "dotenv";

dotenv.config();

export const handler = async (event) => {
  const authKey = process.env.DEEPL_AUTH_KEY;
  const serverUrl = process.env.DEEPL_SERVER_URL;
  const translator = new Translator(authKey, { serverUrl: serverUrl });

  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received event:", event);

  if (event.requestContext.http.method === "POST") {
    const {
      queryStringParameters: { target_lang, text }
    } = event;
    console.log("Text to translate:", text.trim());
    console.log("lang:", target_lang.trim());

    try {
      const result = await translator.translateText(text, null, target_lang);
      console.log("Translation result:", result);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          "Access-Control-Allow-Headers": "X-Requested-With,content-type"
        },
        body: JSON.stringify(result)
      };
    } catch (error) {
      console.error("Error during translation:", error);

      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          "Access-Control-Allow-Headers": "X-Requested-With,content-type"
        },
        body: JSON.stringify({ error: "Internal Server Error" })
      };
    }
  } else {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "X-Requested-With,content-type"
      },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }
};
