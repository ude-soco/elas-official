<p align="center">
<a href="https://www.uni-due.de/soco/research/projects/elas.php" target="_blank" rel="noopener noreferrer">
<img style="width:50%;" src="assets/elas-logo.png" alt="re-frame logo">
</a>
</p>
<br/>
<p>
The goal of the project "Exploratory Learning Analytics toolkit for Students" is to develop a platform for students of the University of Duisburg-Essen to support learners in learning activities. The platform provides a collection of Learning Analytics applications developed by students for students. The first version of ELAS includes the best projects from the previous iterations of the Learning Analytic (LA), Advanced Web Technologies (AWT), and Learning Analytics and Visual Analytics (LAVA) courses offered at the Social Computing Group, where different Learning Analytics applications were developed as part of student projects.
</p>

## 🚀 Get Started

- TODO

#### Live Instances

- TODO

#### Build and Run

- TODO

## Application Stack

- TODO

## 🔨 Development Setup Guide

#### Step 1: Pre-requisites

Download the following software and install them on your machine:

- Node.js (v18.12.1) from [the official website](https://nodejs.org/en/blog/release/v18.12.1)

- Python (v3.10) from [the official website](https://www.python.org/downloads/release/python-31010/)

- Neo4j Community Edition from [the official website](https://neo4j.com/download-center/#community), install it, start the server, and login to the server.

- Redis for Windows from [the official website](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi)

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors.

- [Github Desktop](https://desktop.github.com/)

- [Postman](https://www.postman.com/downloads/)

#### Step 1: Install Guide for ELAS-Backend (Django)

- Using your file explorer, go inside the directory `elas-backend`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`. Change the username (typically "neo4j") and password of Neo4j in the environment variable `.env` file with your own values.

- Open a command prompt/terminal in the `elas-backend` directory with **administration rights**

- Install and activate python virtual environment for Windows

  - Type the following commands to install and activate the virtual environment:

    - Install python virtual environment

      ```bash
      pip install pipenv
      ```

    - Install python package

      ```bash
      pipenv install
      ```

    - Activate the virtual environment

      ```bash
      pipenv shell
      ```

      **(Optional)** To check the location of your Python virtual environment, type the following command in your command prompt

      ```bash
      pipenv --venv
      ```

- Run the `migrations`. Delete the db.sqlite3 file if it exists - it will be created again after the migrations are run successfully. You will only need to run the migrations when you made changes to the relational database models.

  ```bash
  python manage.py makemigrations
  ```

  ```bash
  python manage.py migrate
  ```

- Define the constraints of the graph database. You will only need to run the install labels command when you made changes to the Neo4j models.

  ```bash
  python manage.py install_labels
  ```

- Run the `django` server

  ```bash
  python manage.py runserver
  ```

- Run the `celery` worker command in a separate terminal if you are using Linux or Windows with at least **more than 4 cores**

  ```bash
  celery -A server worker --concurrency=4 -l info -P eventlet
  ```

  Use the following command to run the celery worker if you are using Windows with less than 4 cores:

  ```bash
  celery -A server worker --pool=solo -l info
  ```

- **(Optional)** Run `flower` to monitor the celery worker

  ```bash
  celery -A server flower
  ```

  Open [http://localhost:5555](http://localhost:5555/) in your browser to monitor the celery worker

- Get the full set of API requests in the Postman collection located under `docs\postman\ELAS.postman_collection.json`

#### Step 3: Install Guide for ELAS-Frontend (React)

- Using your file explorer, go inside the directory `elas-frontend`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`

- Open a command prompt/terminal in the `elas-frontend` directory

- Type the command in the command prompt/terminal to install node packages

  ```bash
  npm ci
  ```

  If you face issue with `npm ci` command, try `npm install` or `npm install --force` command. Caution: `npm install` and `npm install --force` will delete all the existing node packages, install the new ones and update the `package-lock.json` file. Please make sure you do not push your changes to the `package-lock.json` file.

- After the packages are installed, type the following command to run the server

  ```bash
  npm start
  ```

  The server will run at [http://localhost:5173](http://localhost:5173)

- Stop the server by pressing `Cntl + c` inside the command prompt

#### Step 4: Scrape courses 🕸️

- Login with the following credentials.

  ```bash
  Username: admin
  Password: 1q2w3e4R!
  ```

- After successful login, click the circle button at the top right corner, open the menu, and click `Settings`, and then `Scrape data` from the left sidebar.

- Insert the LSF link in the `LSF URL` field and click the `Scrape LSF` button.

  ```bash
  https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120231=339240%7C338170%7C339532&P.vx=kurz
  ```

  This will scrape the SS2023 Engineering courses and save them in the database.

- Insert the E3 link in the `E3 URL` field and click the `Scrape E3` button.
  ```bash
  https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120231=339240%7C340216%7C337161&P.vx=kurz
  ```
  This will scrape the SS2023 E3 Module courses and save them in the database.
