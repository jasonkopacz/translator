// index.mjs
import { Translator } from "deepl-node";
import dotenv from "dotenv";

dotenv.config();

export const handler = async (event) => {
  const authKey = process.env.DEEPL_AUTH_KEY_2;
  const serverUrl = process.env.DEEPL_SERVER_URL;
  const translator = new Translator(authKey, { serverUrl: serverUrl });

  if (event.requestContext.http.method === "POST") {
    const body = JSON.parse(event.body);
    const text = body.text;
    const target_lang = body.target_lang;
    const source_lang = body.source_lang;
    const context = body.context;

    try {
      const result = await translator.translateText(
        text,
        source_lang,
        target_lang,
        context
      );

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
