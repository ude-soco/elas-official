<p align="center">
  <a href="https://www.uni-due.de/soco/research/projects/elas.php" target="_blank" rel="noopener noreferrer">
    <img style="max-width: 50px; width: 40%;" src="assets/elas-logo.png" alt="re-frame logo">
  </a>
</p><br/>

The goal of the project "Exploratory Learning Analytics toolkit for Students" is to develop a platform for students of the University of Duisburg-Essen to support learners in learning activities. The platform provides a collection of Learning Analytics applications developed by students for students. The first version of ELAS includes the best projects from the previous iterations of the Learning Analytic (LA), Advanced Web Technologies (AWT), and Learning Analytics and Visual Analytics (LAVA) courses offered at the Social Computing Group, where different Learning Analytics applications were developed as part of student projects.

## 🚀 Get Started

- TODO

#### Live Instances

- Production: [elas-official.soco.inko.cloud](https://elas-official.soco.inko.cloud/) (latest [release](https://github.com/ude-soco/elas-official/releases)) ![status](https://argocd.cluster.soco.inko.cloud/api/badge?name=elas-official-prod)
- Preview: [edge.elas-official.soco.inko.cloud](https://edge.elas-official.soco.inko.cloud/) ([branch `main`](https://github.com/ude-soco/elas-official/tree/main)) ![status](https://argocd.cluster.soco.inko.cloud/api/badge?name=elas-official-edge)

#### Build and Run

- `docker compose up`

## 🏗️ Technical Architecture

<p align="center"><img style="max-width: 600px; width:100%;" src="assets/elas_technical_architecture.svg" alt="re-frame logo"></p><br/>

## 🔨 Development Setup Guide

Download and install the following software

- OpenJDK 21 on [Ubuntu](https://www.linuxcapable.com/how-to-install-openjdk-21-on-ubuntu-linux/) or [Windows](https://www.codejava.net/java-se/download-and-install-openjdk-17#:~:text=How%20to%20Download%20and%20Install%20OpenJDK%2017%201,...%202%202.%20Install%20OpenJDK%2017%20on%20Windows)
- Maven (latest) on [Ubuntu](https://www.golinuxcloud.com/install-maven-ubuntu/) or [Windows](https://phoenixnap.com/kb/install-maven-windows)
- Python (v3.10.10) on [Ubuntu](https://davidvn.com/2022/09/28/installing-and-managing-multiple-python-versions-on-ubuntu-22-04/) using [source](https://www.python.org/ftp/python/3.10.10/Python-3.10.10.tgz) or on [Windows](https://www.python.org/downloads/release/python-31010/)
- Node.js (v18.12.1) on [Ubuntu](https://tecadmin.net/how-to-install-nvm-on-ubuntu-22-04/) or [Windows](https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi)
- MongoDB Community Server (latest) on [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition) or [Windows](https://www.mongodb.com/try/download/community). Additionally, install MongoDB Compass on [Ubuntu](https://www.mongodb.com/try/download/shell) or [Windows](https://www.mongodb.com/try/download/compass)
- Neo4j Desktop (Neo4j v5.12.0) on [Ubuntu](https://neo4j.com/developer/kb/convert-an-appimage-file-into-executable-on-linux-ubuntu-debian/) or on [Windows](https://neo4j.com/download-center/#desktop)
- Git on [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-22-04#installing-git-with-default-packages) or [Windows](https://git-scm.com/downloads)
- Github Desktop on [Ubuntu](https://www.linuxcapable.com/how-to-install-github-desktop-on-ubuntu-linux/) or [Windows](https://desktop.github.com/)
- Code Editor
  - IntelliJ Ultimate on [Ubuntu](https://theubuntulinux.com/faq/how-to-install-intellij-idea-on-ubuntu-22-04-linux-desktop/#:~:text=Add%20the%20PPA%20repository%20and%20update%20the%20system,type%20the%20intellij%20idea%20community%20edition%20download%20intellij-idea-community) or [Windows](https://www.jetbrains.com/de-de/idea/download/#section=windows)
  - Visual Studio Code on [Ubuntu](https://www.golinuxcloud.com/install-visual-studio-code-ubuntu-22/) or [Windows](https://code.visualstudio.com/download)
- Postman on [Ubuntu](https://itslinuxfoss.com/how-to-install-postman-on-ubuntu-22-04/) or [Windows](https://www.postman.com/downloads/)
- Redis (latest) on [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-22-04) or [Windows](https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.msi)

### Installation Guide for Backend Services

#### Step 1: Run Service Register (Spring Boot)

- Using your file explorer, go inside the directory `backend/1-service-registry`.

- Open a command prompt/terminal in the `service-registry` directory with **administration rights**

- Run the following command to package the application into a jar file.

  ```bash
  mvn clean package
  ```

- Run the following command to start the application (every time when you want to start the server).

  ```cmd
  set HOST=localhost
  ```

  ```bash
  java -jar target/ServiceRegistry.jar
  ```

#### Step 2: Run API Gateway (Spring Boot)

- Navigate to the `backend/2-api-gateway` directory using your file explorer.

- Open a command prompt/terminal in the `service-registry` directory (with **administration rights** for Windows users)

- Run the following command to package the application into a jar file (only once).

  ```bash
  mvn clean package
  ```

- Run the following command to start the application (every time when you want to start the server).

  ```cmd
  set SERVICE_REGISTRY_URL=http://localhost:8761/eureka/
  ```

  ```cmd
  set HOST=localhost
  ```

  ```bash
  java -jar target/ApiGateway.jar
  ```

#### Step 3: Run Auth Service (Django)

- Navigate to the `backend/3-auth` directory using your file explorer.

  - Create a new file named `.env` within this directory.
  - Locate the `example.env` file in the same `backend/3-auth` directory and open it.
  - Copy the entire content of the `example.env` file.
  - Now, open the newly created `.env` file and paste the copied content inside.
  - (Optional) Feel free to modify the values of the variables in the `.env` file according to your requirements.

- Open a command prompt/terminal in the `backend/3-auth` directory (with **administration rights** for Windows users)

- Set up a Python virtual environment on Windows, follow these steps:

  1. Install `pipenv` (only once)

     ```bash
     pip install pipenv
     ```

  2. Install required packages (only once)

     ```bash
     pipenv install
     ```

  3. Activate the virtual environment (every time when you want to start the server)

     ```bash
     pipenv shell
     ```

  **(Optional)** To check the location of your Python virtual environment, type the following command in your command prompt

  ```bash
  pipenv --venv
  ```

- Before running the Django server, ensure that your database is up to date. Run the following commands to perform migrations

  1. Create migrations (only once)

     ```bash
     python manage.py makemigrations
     ```

  2. Apply migrations

     ```bash
     python manage.py migrate
     ```

  Note: Delete the db.sqlite3 file if it exists; it will be recreated after successful migrations. Run migrations only when you've made changes to the relational database models.

- Run the Django server

  ```bash
    python manage.py runserver
  ```

  By following these steps, your Python virtual environment will be set up, the database will be migrated, and the Django server will be running and ready for development.

#### Step 4: Run E3Selector Service (Django)

- Navigate to the `backend/4-e3selector` directory using your file explorer.

  - Create a new file named `.env` within this directory.
  - Locate the `example.env` file in the same `backend/4-e3selector` directory and open it.
  - Copy the entire content of the `example.env` file.
  - Now, open the newly created `.env` file and paste the copied content inside.
  - (Optional) Feel free to modify the values of the variables in the `.env` file according to your requirements.

- Open a command prompt/terminal in the `backend/4-e3selector` directory (with **administration rights** for Windows users)

- Set up a Python virtual environment on Windows, follow these steps:

  1. Install `pipenv` (only once)

     ```bash
     pip install pipenv
     ```

  2. Install required packages (only once)

     ```bash
     pipenv install
     ```

  3. Activate the virtual environment (every time when you want to start the server)

     ```bash
     pipenv shell
     ```

  **(Optional)** To check the location of your Python virtual environment, type the following command in your command prompt

  ```bash
  pipenv --venv
  ```

- Before running the Django server, ensure that your database is up to date. Run the following commands to perform migrations

  1. Create migrations (only once)

     ```bash
     python manage.py makemigrations
     ```

  2. Apply migrations

     ```bash
     python manage.py migrate
     ```

  Note: Delete the db.sqlite3 file if it exists; it will be recreated after successful migrations. Run migrations only when you've made changes to the relational database models.

- Run the Django server

  ```bash
    python manage.py runserver
  ```

  By following these steps, your Python virtual environment will be set up, the database will be migrated, and the Django server will be running and ready for development.

- Run the `celery` worker command in a separate terminal if you are using Linux or Windows with at least more than 4 cores

  ```bash
  celery -A server worker --concurrency=4 -l info -P eventlet
  ```

  Use the following command to run the celery worker if you are using Windows with less than 4 cores:

  ```bash
  celery -A server worker -l info -P eventlet
  ```

- (Optional) Run `flower` to monitor the celery worker

  ```bash
    flower -A server --port=5555
  ```

#### Step 5: Run StudyCompass & CourseRecommender Service (Django)

- Navigate to the `backend/5-studycompass` directory using your file explorer.

  - Create a new file named `.env` within this directory.
  - Locate the `example.env` file in the same `backend/5-studycompass` directory and open it.
  - Copy the entire content of the `example.env` file.
  - Now, open the newly created `.env` file and paste the copied content inside.
  - (Optional) Feel free to modify the values of the variables in the `.env` file according to your requirements.

- Open a command prompt/terminal in the `backend/5-studycompass` directory (with **administration rights** for Windows users)

- Set up a Python virtual environment on Windows, follow these steps:

  1. Install `pipenv` (only once)

     ```bash
     pip install pipenv
     ```

  2. Install required packages (only once)

     ```bash
     pipenv install
     ```

  3. Activate the virtual environment (every time when you want to start the server)

     ```bash
     pipenv shell
     ```

  **(Optional)** To check the location of your Python virtual environment, type the following command in your command prompt

  ```bash
  pipenv --venv
  ```

- Before running the Django server, ensure that your database is up to date. Run the following commands to perform migrations

  1. Create migrations (only once)

     ```bash
     python manage.py makemigrations
     ```

  2. Apply migrations

     ```bash
     python manage.py migrate
     ```

  Note: Delete the db.sqlite3 file if it exists; it will be recreated after successful migrations. Run migrations only when you've made changes to the relational database models.

- Run the Django server

  ```bash
    python manage.py runserver
  ```

  By following these steps, your Python virtual environment will be set up, the database will be migrated, and the Django server will be running and ready for development.

- Run the `celery` worker command in a separate command prompt/terminal if you are using Linux with at least more than 4 cores

  ```bash
  celery -A server worker --concurrency=4 -l info -P eventlet
  ```

  Use the following command to run the celery worker if you are using Windows:

  ```bash
  celery -A server worker -l info -P eventlet
  ```

- (Optional) Run `flower` to monitor the celery worker

  ```bash
  flower -A server --port=5555
  ```

#### Step 6: Run ProjectFinder (TBA)

- TODO

#### Step 7: Run NoteBot (Node.JS)

- Navigate to the `backend/7-notebot` directory using your file explorer.

  - Create a new file named `.env` within this directory.
  - Locate the `example.env` file in the same `backend/7-notebot` directory and open it.
  - Copy the entire content of the `example.env` file.
  - Now, open the newly created `.env` file and paste the copied content inside.
  - (Optional) Feel free to modify the values of the variables in the `.env` file according to your requirements.

- Open a command prompt/terminal in the `backend/7-notebot` directory (with **administration rights** for Windows users)

- To install Node packages, enter the following command in your command prompt or terminal:

  ```bash
  npm ci
  ```

  In case you encounter issues with the npm ci command, you can try either of the following commands:

  ```bash
  npm install
  ```

  OR

  ```bash
  npm install --force
  ```

  Please exercise caution with `npm install` and `npm install --force` as they will delete existing node packages, install new ones, and update the `package-lock.json` file. Be careful not to push changes to the `package-lock.json` file.

- After successfully installing the packages, use the following command to start the server:

  ```bash
  npm run watch:dev
  ```

- To stop the server, simply press `Ctrl + C` inside the command prompt/terminal.

### Installation Guide for Frontend Service

- Navigate to the `frontend` directory using your file explorer.

  - Create a new file named `.env` within this directory.
  - Locate the `example.env` file in the same `frontend` directory and open it.
  - Copy the entire content of the `example.env` file.
  - Now, open the newly created `.env` file and paste the copied content inside.
  - (Optional) Feel free to modify the values of the variables in the `.env` file according to your requirements.

- Open a command prompt/terminal in the `frontend` directory (with **administration rights** for Windows users)

- To install Node packages, enter the following command in your command prompt or terminal:

  ```bash
  npm ci
  ```

  In case you encounter issues with the npm ci command, you can try either of the following commands:

  ```bash
  npm install
  ```

  OR

  ```bash
  npm install --force
  ```

  Please exercise caution with `npm install` and `npm install --force` as they will delete existing node packages, install new ones, and update the `package-lock.json` file. Be careful not to push changes to the `package-lock.json` file.

- After successfully installing the packages, use the following command to start the server:

  ```bash
  npm start
  ```

- The server will run at [http://localhost:8080](http://localhost:8080)

- To stop the server, simply press `Ctrl + C` inside the command prompt/terminal.
