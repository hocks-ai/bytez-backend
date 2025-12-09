const Bytez = require("bytez.js");

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Handle GET request
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ready',
          message: 'Bytez AI Function is running'
        })
      };
    }

    // Handle POST request
    if (event.httpMethod === 'POST') {
      const { messages } = JSON.parse(event.body || '{}');
      
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Messages array is required');
      }

      const apiKey = process.env.BYTEZ_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Initialize Bytez SDK
      const sdk = new Bytez(apiKey);
      const model = sdk.model("openai/gpt-5.1");
      
      // Send input to model
      const { error, output } = await model.run(messages);
      
      if (error) {
        throw new Error(`Bytez API Error: ${error}`);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          response: output
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error:', error);
    
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
