## 🚀 Get Started with StudyCompass Service

#### Pre-requisites

Download the following software and install them on your machine:

- Python (v3.10) from [the official website](https://www.python.org/downloads/release/python-31010/)

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors.

- [Postman](https://www.postman.com/downloads/)

- [Redis](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi)

- [Neo4j](https://neo4j.com/download-center/#community)

#### Installation Guide for StudyCompass Service (Django)

- Using your file explorer, go inside the directory `backend\3-auth`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`.

- Open a command prompt/terminal in the `backend\3-auth` directory with **administration rights**

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

- Run the `django` server

  ```bash
  python manage.py runserver
  ```

- Run the `celery` worker command in a separate terminal if you are using Linux or Windows with at least more than 4 cores

  ```bash
  celery -A server worker --concurrency=4 -l info -P eventlet
  ```

  Use the following command to run the celery worker if you are using Windows with less than 4 cores:

  ```bash
  celery -A server worker --pool=solo -l info
  ```

- (Optional) Run `flower` to monitor the celery worker

  ```bash
  celery -A server flower
  ```

#### Scrape LSF Engineering Courses

- Login with the following credentials.

  ```bash
  Username: admin
  Password: 1q2w3e4R!
  ```

- After successful login, click the circle button at the top right corner, open the menu, and click `Settings`, and then `Scrape data` from the left sidebar.

- Insert the LSF link in the `LSF URL` field and click the `Scrape LSF` button.
  ```bash
  https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120232=356121%7C355019&P.vx=kurz
  ```
  This will scrape the WS23/24 LSF Engineering courses and save them in the database.

- (TODO) Get the full set of API requests in the Postman collection located under `backend\3-auth\docs\postman\studycompass.json`