import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);

  const handleSendRequest = async () => {
    try {
      const config = {
        method,
        url,
        headers: headers.reduce((acc, { key, value }) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {}),
        data: body,
      };

      const res = await axios(config);
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response ? error.response.data : 'Error occurred');
    }
  };

  const handleHeadersChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Tester</h1>

      {/* Method and URL Input */}
      <div>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          placeholder="Enter API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '300px', marginLeft: '10px' }}
        />
      </div>

      
      <div>
        <h3>Headers</h3>
        {headers.map((header, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) =>
                handleHeadersChange(index, 'key', e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                handleHeadersChange(index, 'value', e.target.value)
              }
              style={{ marginLeft: '5px' }}
            />
          </div>
        ))}
        <button onClick={() => setHeaders([...headers, { key: '', value: '' }])}>
          Add Header
        </button>
      </div>

      {/* Body Input */}
      <div>
        <h3>Body</h3>
        <textarea
          placeholder="Enter JSON body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="5"
          cols="50"
        />
      </div>

      {/* Send Button */}
      <div>
        <button onClick={handleSendRequest}>Send</button>
      </div>

      {/* Response Viewer */}
      <div>
        <h3>Response</h3>
        <pre>{response ? JSON.stringify(response, null, 2) : 'No response yet'}</pre>
      </div>
    </div>
  );
};

export default App;
