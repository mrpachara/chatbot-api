'user strict';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dialogflow from '@google-cloud/dialogflow';
import mysql from 'mysql';

const app = express();
const port = 3000;
const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionClient = new dialogflow.SessionsClient();
const dbConnection = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    //debug: true,
};

const debugFn = (error) => {
    if(error) console.error(error)
};

app.use(cors());
app.use(bodyParser.json({extended: true}));

app.post('/api/detect-intent/:sessionId', async (req, res) => {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, req.params.sessionId);
    const request = {
        session: sessionPath,
        ...req.body,
    };
    const dfResponses = await sessionClient.detectIntent(request);
    const dfResponse = dfResponses[0];

    let prefix = null;
    if(dfResponse.queryResult.action.startsWith(prefix = 'input.ask.product.')) {
        const conn = mysql.createConnection(dbConnection);
        conn.connect(debugFn);

        const params = dfResponse.queryResult.parameters.fields.product.listValue.values.map((value) => value.stringValue);

        conn.query(
            "SELECT * FROM product WHERE product.code IN (?)",
            [params],
            (error, result) => {
                if(error) throw error;

                if(result.length > 0) {
                    const product = result[0];
                    switch(dfResponse.queryResult.action) {
                        case `${prefix}detail`:
                            dfResponse.queryResult.fulfillmentText = product.detail;
                            break;
                        case `${prefix}price`:
                            dfResponse.queryResult.fulfillmentText = product.price;
                            break;
                    }
                } else {
                    dfResponse.queryResult.fulfillmentText = 'Product not found!!!';
                }

                res.send(dfResponse);
            },
        );

        conn.end(debugFn);
    } else {
        res.send(dfResponse);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
