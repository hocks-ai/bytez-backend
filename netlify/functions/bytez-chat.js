exports.handler = async (event, context) => {
  console.log('Function called:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body,
    headers: event.headers
  });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
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
    // Parse request body for POST requests
    let parsedBody = {};
    if (event.body) {
      try {
        parsedBody = JSON.parse(event.body);
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
        parsedBody = {};
      }
    }

    const { messages } = parsedBody;

    // Handle GET request
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Function is working! Use POST for AI chat.',
          timestamp: new Date().toISOString(),
          method: 'GET'
        })
      };
    }

    // Handle POST request
    if (event.httpMethod === 'POST') {
      // Check if messages exist
      if (!messages || !Array.isArray(messages)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Missing or invalid messages array',
            received: messages
          })
        };
      }

      // Simple response for testing
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'POST request received successfully!',
          receivedMessages: messages,
          messageCount: messages.length,
          timestamp: new Date().toISOString(),
          method: 'POST',
          nextStep: 'Ready to integrate Bytez API'
        })
      };
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
        stack: error.stack
      })
    };
  }
};
