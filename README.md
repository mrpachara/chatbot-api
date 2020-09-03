# Chatbot API (Proxy Server for Dailogflow)

Student training to create Chatbot API (Proxy Server for [Dialogflow](https://dialogflow.cloud.google.com)).

---
## Requirements

For development, you will only need Node.js and a node global package installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g
---

## Install

    $ git clone https://github.com/mrpachara/chatbot-api
    $ cd chatbot-api
    $ npm install

## Configurations

1. Create your google service account key from [here](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

2. Create directory `./key` and store your google service acount key into it.

3. Create entity `product` in [Dialogflow](https://dialogflow.cloud.google.com) with the following instants.

    - `book` - for book and add some thai language synonyms.
    - `eraser` - for eraser and add some thai language synonyms.

4. Create the following intents in [Dialogflow](https://dialogflow.cloud.google.com).

    - `input.ask.product.detail` - for products details.
    - `input.ask.product.price` - for products price.

5. Import `./product.sql` to MySQL.

6. Create your `./.env` file with the following environment variables:

    ```
    # Google services
    GOOGLE_APPLICATION_CREDENTIALS="./key/YOUR_KEY_FILE_NAME.json"
    GOOGLE_PROJECT_ID="YOUR_PROJECT_ID"

    # Database
    DB_HOST="YOUR_DATABASE_HOST"
    DB_USER="YOUR_DATABASE_USERNAME"
    DB_PASSWORD="YOUR_DATABASE_PASSWORD"
    DB_NAME="YOUR_DATABASE_NAME"
    ```

## Running the project

    $ node -r dotenv/config .

## Note

We use `.env` file to set environment variables instead of command line because we have too many variables to set. So we have to install `dotenv` package that already inclued in `package.json`, with dev dependencies, and pass `-r dotenv/config` to `node` arguments that tells `node` to load `.env` before run our program.
