const Bytez = require("bytez.js");

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Parse request body
    const { messages } = JSON.parse(event.body);
    
    // Initialize Bytez SDK
    const sdk = new Bytez(process.env.BYTEZ_API_KEY);
    const model = sdk.model("openai/gpt-5.1");
    const { error, output } = await model.run(messages);
    
    if (error) throw new Error(error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: output
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
