import React, { useState } from "react";
import axios from "axios";
import "./App.css"; 

const App = () => {

  
    const handleOpenNewTab = () => {
      const currentUrl = window.location.href; // Get the current page URL
      window.open(currentUrl, "_blank"); // Open it in a new tab
    };
  const [activeTab, setActiveTab] = useState("Parameters");
  const [parameters, setParameters] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [preRequestScript, setPreRequestScript] = useState("");
  const [authType, setAuthType] = useState("None");
  const [authDetails, setAuthDetails] = useState({ token: "", username: "", password: "" });
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleRowChange = (type, index, field, value) => {
    const updatedRows = type === "parameters" ? [...parameters] : [...headers];
    updatedRows[index][field] = value;
    type === "parameters" ? setParameters(updatedRows) : setHeaders(updatedRows);
  };

  const addRow = (type) => {
    const updatedRows = type === "parameters" ? [...parameters] : [...headers];
    updatedRows.push({ key: "", value: "" });
    type === "parameters" ? setParameters(updatedRows) : setHeaders(updatedRows);
  };

  const removeRow = (type, index) => {
    const updatedRows = type === "parameters" ? [...parameters] : [...headers];
    updatedRows.splice(index, 1);
    type === "parameters" ? setParameters(updatedRows) : setHeaders(updatedRows);
  };

  const sendRequest = async () => {
    setResponse(null);
    setError(null);

    const config = {
      method,
      url,
      headers: headers.reduce((acc, header) => {
        if (header.key) acc[header.key] = header.value;
        return acc;
      }, {}),
      params: parameters.reduce((acc, param) => {
        if (param.key) acc[param.key] = param.value;
        return acc;
      }, {}),
      data: body ? JSON.parse(body) : undefined,
    };

    if (authType === "Bearer Token") {
      config.headers["Authorization"] = `Bearer ${authDetails.token}`;
    } else if (authType === "Basic Auth") {
      config.auth = {
        username: authDetails.username,
        password: authDetails.password,
      };
    }

    try {
      const res = await axios(config);
      setResponse(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>API Tester</h1>
      </header>

      <main>
        
        <div className="request-config">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div className="api_input_section">
          <input
            type="text"
            placeholder="https://example.com/api"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          </div>
          <div className="send_butt_section">
          <button className="send-button" onClick={sendRequest}>Send</button>
          </div>

          <div className="new_tab_section">
             <button className=" new_tab_butt" onClick={handleOpenNewTab}> New Tab</button>
                      
                  
           </div>
    
        </div>


        <div className="tabs">
          {["Parameters", "Body", "Headers", "Authorization", "Pre-request Script"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "Parameters" && (
            <div>
              <h3>Query Parameters</h3>
              {parameters.map((param, index) => (
                <div key={index} className="row">
                  <input
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) =>
                      handleRowChange("parameters", index, "key", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) =>
                      handleRowChange("parameters", index, "value", e.target.value)
                    }
                  />
                  <button onClick={() => removeRow("parameters", index)}>-</button>
                </div>
              ))}
              <button onClick={() => addRow("parameters")}>Add Parameter</button>
            </div>
          )}

          {activeTab === "Headers" && (
            <div>
              <h3>Headers</h3>
              {headers.map((header, index) => (
                <div key={index} className="row">
                  <input
                    type="text"
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) =>
                      handleRowChange("headers", index, "key", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) =>
                      handleRowChange("headers", index, "value", e.target.value)
                    }
                  />
                  <button onClick={() => removeRow("headers", index)}>-</button>
                </div>
              ))}
              <button onClick={() => addRow("headers")}>Add Header</button>
            </div>
          )}

          {activeTab === "Body" && (
            <div>
              <h3>Request Body</h3>
              <textarea
                placeholder="Enter JSON body here"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          )}

          {activeTab === "Authorization" && (
            <div>
              <h3>Authorization</h3>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
              >
                <option value="None">None</option>
                <option value="Bearer Token">Bearer Token</option>
                <option value="Basic Auth">Basic Auth</option>
              </select>
              {authType === "Bearer Token" && (
                <div>
                  <input
                    type="text"
                    placeholder="Token"
                    value={authDetails.token}
                    onChange={(e) =>
                      setAuthDetails({ ...authDetails, token: e.target.value })
                    }
                  />
                </div>
              )}
              {authType === "Basic Auth" && (
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={authDetails.username}
                    onChange={(e) =>
                      setAuthDetails({ ...authDetails, username: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={authDetails.password}
                    onChange={(e) =>
                      setAuthDetails({ ...authDetails, password: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "Pre-request Script" && (
            <div>
              <h3>Pre-request Script</h3>
              <textarea
                placeholder="Enter pre-request JavaScript here"
                value={preRequestScript}
                onChange={(e) => setPreRequestScript(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="response-section">
          <h3>Response</h3>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
          {error && <pre className="error">{JSON.stringify(error, null, 2)}</pre>}
        </div>
      </main>
    </div>
  );
};

export default App;
