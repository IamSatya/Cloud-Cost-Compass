# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the App on a Linux Ubuntu VM

To run this application on your own Linux Ubuntu virtual machine, follow these steps:

1.  **Prerequisites:** Ensure you have Node.js (v20 or later) and npm installed. You can install them using your package manager:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```

2.  **Install Dependencies:** Navigate to your project directory and install the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Run the Development Server:** Start the Next.js development server. The app is configured to run on port 9002.
    ```bash
    npm run dev
    ```
    You should be able to access the application at `http://<your-vm-ip>:9002`.

4.  **Build for Production:** To build a production-ready version of the app, run:
    ```bash
    npm run build
    ```
    Then, to start the production server, run:
    ```bash
    npm start
    ```

## Database Configuration (Firebase Firestore)

This application is configured to use **Firebase Firestore**, a NoSQL document database. Here's how it's set up:

*   **Firebase Connection:** The configuration for connecting to your Firebase project is managed by Firebase App Hosting. The file `src/firebase/config.ts` contains your project's specific connection details.

*   **Data Structure Definition:** The file `docs/backend.json` defines the data models (entities) and the structure of the Firestore database. This file serves as a blueprint for how data is organized. You can edit this file to add new data types or change how your collections are structured.

*   **Security Rules:** The security of your database is managed by the rules in the `firestore.rules` file. These rules define who can read, write, update, or delete data in your Firestore database. It's crucial to define these rules properly to keep your data secure.

When using Firebase Studio, changes to your Firebase backend configuration and security rules are handled for you. If you are running the project locally, you would need to set up a Firebase project and deploy the security rules manually using the Firebase CLI.