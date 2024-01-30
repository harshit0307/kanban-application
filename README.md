<!DOCTYPE html>
<html lang="en">

<body>

  <h1>Kanban Application</h1>

  <p>This is a Kanban application used to manage tasks built with React, Redux, Express, and MongoDB.</p>

  <h2>Table of Contents</h2>

  <ul>
      <li><a href="#features">Features</a></li>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#getting-started">Getting Started</a></li>
      <li><a href="#folder-structure">Folder Structure</a></li>
      <li><a href="#dependencies">Dependencies</a></li>
  </ul>

  <h2 id="features">Features</h2>

  <ul>
      <li>Create, edit, and delete tasks on a Kanban board.</li>
      <li>Organize tasks into different stages (e.g., To Do, In Progress, Done).</li>
      <li>User authentication and authorization.</li>
      <li>Persistent data storage using MongoDB.</li>
  </ul>

  <h2 id="prerequisites">Prerequisites</h2>

  <p>Make sure you have the following installed:</p>

  <ul>
      <li>Node.js and npm</li>
      <li>MongoDB</li>
  </ul>

  <h2 id="getting-started">Getting Started</h2>

  <ol>
      <li>Clone the repository:</li>
  </ol>

  <pre><code>git clone https://github.com/harshit0307/kanban-application.git</code></pre>

  <ol start="2">
      <li>Install dependencies:</li>
  </ol>

  <pre><code>cd kanban-app
npm install</code></pre>

  <ol start="3">
      <li>Set up MongoDB:
          <ul>
              <li>Install MongoDB if you haven't already.</li>
              <li>Start the MongoDB server.</li>
          </ul>
      </li>
  </ol>

  <ol start="4">
      <li>Configure environment variables:
          <ul>
              <li>Create a <code>.env</code> file in the root of the project.</li>
              <li>Add the following variables:
                  <pre><code>PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-app
PASSWORD_SECRET_KEY="Your Secret key"
TOKEN_SECRET_KEY="Your Secret Key"</code></pre>
              </li>
              <li>Modify the values as needed.</li>
          </ul>
      </li>
  </ol>

  <ol start="5">
      <li>Start the development server:
          <pre><code>npm run</code></pre>
      </li>
  </ol>

  <h2>Folder Structure</h2>

  <pre><code>kanban-app/
├── client/           # React front-end
├── server/           # Express back-end
├── .env              # Environment variables
├── .gitignore        # Git ignore file
└── README.md         # Project documentation</code></pre>

  <h2>Dependencies</h2>

  <ul>
      <li>React</li>
      <li>Redux</li>
      <li>Express</li>
      <li>MongoDB</li>
      <li>Mongoose</li>
      <li>etc. (Check <code>package.json</code> for a complete list)</li>
  </ul>

</body>
</html>
