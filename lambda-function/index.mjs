// index.mjs
import { Translator } from "deepl-node";
import dotenv from "dotenv";

dotenv.config();

export const handler = async (event) => {
  const authKey = process.env.DEEPL_AUTH_KEY_2;
  const serverUrl = process.env.DEEPL_SERVER_URL;
  const translator = new Translator(authKey, { serverUrl: serverUrl });

  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.requestContext.http.method === "POST") {
    const body = JSON.parse(event.body);
    console.log("body", body);
    const text = body.text;
    const target_lang = body.target_lang;
    const source_lang = body.source_lang;
    const context = body.context;
    console.log("context", context);
    console.log("Text to translate:", body.text);
    console.log("to:", body.target_lang.trim());
    console.log("from:", body.source_lang.trim());

    try {
      const result = await translator.translateText(
        text,
        source_lang,
        target_lang,
        context
      );
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
        body: JSON.stringify({ error: error })
      };
    }
  } else {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "X-Requested-With,content-type"
      },
      body: JSON.stringify({ error: "Unable to process request" })
    };
  }
};
