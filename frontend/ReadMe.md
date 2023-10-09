## 🚀 Get Started with ELAS Frontend

Download the following software and install them on your machine:

- Node.js (v18.12.1) from [the official website](https://nodejs.org/en/blog/release/v18.12.1)

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors.

- [Github Desktop](https://desktop.github.com/)

Using your file explorer, go inside the directory `frontend`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`

- Open a command prompt/terminal in the `frontend` directory

- Type the command in the command prompt/terminal to install node packages

  ```bash
  npm ci
  ```

  If you face issue with `npm ci` command, try `npm install` or `npm install --force` command. Caution: `npm install` and `npm install --force` will delete all the existing node packages, install the new ones and update the `package-lock.json` file. Please make sure you do not push your changes to the `package-lock.json` file.

- After the packages are installed, type the following command to run the server

  ```bash
  npm start
  ```

  The server will run at [http://localhost:8080](http://localhost:8080)

- Stop the server by pressing `Cntl + c` inside the command prompt