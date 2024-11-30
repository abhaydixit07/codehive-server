# Backend for Codehive 🚀  

## Introduction 🌟  
The backend of Codehive is built using **Node.js** and **Express**, designed to provide a real-time collaborative coding environment. It enables seamless communication (video calling and chat), dynamic room management and code synchronization using **Socket.IO**. Additionally, the backend ensures robust functionality with periodic health checks and task scheduling.


## Features ✨  

1. **Real-Time Collaboration**  
   - Synchronize code changes across all users in a room in real time.  
   - Broadcast cursor positions to enhance teamwork and visibility.  

2. **Room Management**  
   - Create unique rooms using **UUID** for collaborative sessions.  
   - Manage participants, including handling joins, leaves and disconnections.  

3. **Integrated Communication**  
   - Supports video and audio toggling, ensuring a smooth virtual coding experience.  

4. **Health Monitoring**  
   - Periodic server health checks via a dummy route using **Node-Cron**.  

5. **Scalable Architecture**  
   - Seamless integration with frontend through environment variables for flexible deployments.  


## Backend Specifics 🔧  

### Tech Stack  

- **Core Frameworks and Libraries**:  
  - [Express](https://expressjs.com/): Lightweight web framework for server-side operations.  
  - [Socket.IO](https://socket.io/): Enables real-time, bidirectional communication.  
  - [Node-Cron](https://www.npmjs.com/package/node-cron): Schedules periodic tasks like health checks.  
  - [Axios](https://axios-http.com/): Simplifies HTTP requests for external APIs.  
  - [UUID](https://www.npmjs.com/package/uuid): Generates unique identifiers for rooms.  

- **Utilities**:  
  - **CORS**: Ensures secure communication between the frontend and backend.  
  - **dotenv**: Manages environment variables for flexible configuration.  

### Key Functionalities  

1. **Socket.IO Events**  
   - `chat_message`: Facilitates real-time messaging among users.  
   - `create_room`: Dynamically creates rooms with a unique ID.  
   - `join_room`: Allows users to join existing rooms and synchronizes room data.  
   - `code_change`: Updates code across participants in real time.  
   - `toggle_video` and `toggle_audio`: Handles user media preferences.  
   - `disconnect`: Cleans up rooms and user data upon disconnection.  

2. **API Endpoints**  
   - `GET /`: Verifies server availability with a basic response.  
   - `GET /keep-alive`: Keeps the server active by simulating requests.  

3. **Cron Jobs**  
   - Executes a scheduled health check every 8 minutes to ensure server reliability.  


## Installation and Getting Started 🛠️  

Follow the steps below to set up and run the backend server for Codehive:  

### Prerequisites  

- Node.js (v16+ recommended)  
- npm or yarn  
- A `.env` file with the following environment variables:

  ```env  
  FRONTEND_URL=<Frontend_URL>  
  BACKEND_URL=<Backend_URL>
  ```  

### Steps  

1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/codehiveofficial/codehive-server.git
   cd codehive-server
   ```  

2. **Install Dependencies**  
   ```bash  
   # Using npm  
   npm install  

   # Or using yarn  
   yarn install  
   ```  

3. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and add the required environment variables as shown above.  

4. **Run the Development Server**  
   ```bash  
   node server.js
   ```  
   The server will run at the specified `PORT` (default: 5000). You can check its status by visiting `http://localhost:5000`.  

5. **Verify the Setup**  
   Access the `/` endpoint in your browser or via Postman to confirm the server is up and running.  

## Server is ready 🤟
By completing these steps, your backend will be fully operational and ready to support the Codehive platform. 🚀
