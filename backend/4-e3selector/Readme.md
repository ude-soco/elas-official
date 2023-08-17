## 🚀 Get Started with E3Selector Service

#### Pre-requisites

Download the following software and install them on your machine:

- Python (v3.10) from [the official website](https://www.python.org/downloads/release/python-31010/)

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors.

- [Postman](https://www.postman.com/downloads/)

#### Installation Guide for E3Selector Service (Django)

- Using your file explorer, go inside the directory `backend\4-e3selector`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`.

- Open a command prompt/terminal in the `backend\4-e3selector` directory with **administration rights**

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

- (TODO) Get the full set of API requests in the Postman collection located under `backend\4-e3selector\docs\postman\e3selector-api.json`