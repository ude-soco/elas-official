## 🚀 Get Started with Notebot Service

#### Pre-requisites

Download the following software and install them on your machine:

- Node.js (v18.12.1) from [the official website](https://nodejs.org/en/blog/release/v18.12.1)

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors.

- MongoDB Community Server (v5.0.5) from [the official website](https://www.mongodb.com/try/download/community) and [MongoDB Compass](https://www.mongodb.com/try/download/compass) and install them

- Git from [the official website](https://git-scm.com/downloads)

- Github Desktop from [the official website](https://desktop.github.com/)

- Postman from [the official website](https://www.postman.com/downloads/)

#### Installation Guide for Notebot Service (Node/Express)

- Using your file explorer, go inside the directory `backend/7-notebot`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`

- Open a command prompt/terminal in the `7-notebot` directory

- Type the command in the command prompt/terminal to install node packages

  ```bash
  npm ci
  ```

  If you face issue with `npm ci` command, try `npm install` or `npm install --force` command. Caution: `npm install` and `npm install --force` will delete all the existing node packages, install the new ones and update the `package-lock.json` file. Please make sure you do not push your changes to the `package-lock.json` file.

- After the packages are installed, type the following command to run the server

  ```bash
  npm run watch:dev
  ```

  The server will run at [http://localhost:8007](http://localhost:8007)

- Stop the server by pressing `Cntl + c` inside the command prompt
