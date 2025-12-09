const Bytez = require("bytez.js");

exports.handler = async (event, context) => {
  console.log('Bytez Function called:', {
    method: event.httpMethod,
    timestamp: new Date().toISOString()
  });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Handle GET request (for testing)
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Bytez AI Function is running!',
          status: 'Ready to process requests',
          timestamp: new Date().toISOString()
        })
      };
    }

    // Handle POST request (main AI functionality)
    if (event.httpMethod === 'POST') {
      // Parse request body
      let parsedBody = {};
      try {
        parsedBody = JSON.parse(event.body || '{}');
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid JSON in request body'
          })
        };
      }

      const { messages } = parsedBody;

      // Validate messages
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Messages array is required and should not be empty'
          })
        };
      }

      // Check API key
      const apiKey = process.env.BYTEZ_API_KEY;
      if (!apiKey) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'API key not configured on server'
          })
        };
      }

      console.log('Calling Bytez API with', messages.length, 'messages');

      try {
        // Initialize Bytez SDK
        const sdk = new Bytez(apiKey);
        const model = sdk.model("openai/gpt-5.1");
        
        // Call Bytez API
        const { error, output } = await model.run(messages);
        
        if (error) {
          throw new Error(`Bytez API Error: ${error}`);
        }

        console.log('Bytez API response received successfully');

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            response: output,
            model: 'gpt-5.1',
            timestamp: new Date().toISOString()
          })
        };

      } catch (apiError) {
        console.error('Bytez API Error:', apiError);
        
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: apiError.message,
            note: 'Bytez API call failed'
          })
        };
      }
    }

    // Handle other methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Method ${event.httpMethod} not allowed`
      })
    };

  } catch (error) {
    console.error('Handler error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
