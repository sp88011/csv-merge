import React from "react";

interface LogProps {
  messages: string[];
}

const Log: React.FC<LogProps> = ({ messages }) => {
  console.log("MEssages", messages);
  return (
    <div>
      {messages.length > 0 && (
        <div>
          <h3>Logs:</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Log;
