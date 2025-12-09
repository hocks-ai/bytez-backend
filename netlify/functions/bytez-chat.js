const Bytez = require("bytez.js");

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { messages } = JSON.parse(event.body);
    const key = process.env.BYTEZ_API_KEY;
    const sdk = new Bytez(key);
    const model = sdk.model("openai/gpt-5.1");
    const { error, output } = await model.run(messages);
    
    if (error) throw new Error(error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: output
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
