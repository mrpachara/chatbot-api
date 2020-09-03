'use strict';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dialogflow from '@google-cloud/dialogflow';
import mysql from 'mysql';

const app = express();
const port = 3000;
const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionsClient = new dialogflow.SessionsClient();
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
    const sessionPath = sessionsClient.projectAgentSessionPath(projectId, req.params.sessionId);
    const dfReq = {
        session: sessionPath,
        ...req.body,
    };
    const dfReses = await sessionsClient.detectIntent(dfReq);
    const dfRes = dfReses[0];
    const { queryResult } = dfRes;
    const { action } = queryResult;

    let prefix = null;
    if(action === 'input.ask.time') {
        queryResult.fulfillmentText = (new Date()).toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });
        res.send(dfRes);
    } else if(action.startsWith(prefix = 'input.ask.product.')) {
        const conn = mysql.createConnection(dbConnection);
        conn.connect(debugFn);

        const params = queryResult.parameters.fields.product.listValue.values.map((value) => value.stringValue);

        conn.query(
            "SELECT * FROM product WHERE product.code IN (?)",
            [params],
            (error, result) => {
                if(error) throw error;

                if(result.length > 0) {
                    const product = result[0];
                    switch(action) {
                        case `${prefix}detail`:
                            queryResult.fulfillmentText = product.detail;
                            break;
                        case `${prefix}price`:
                            queryResult.fulfillmentText = product.price;
                            break;
                    }
                } else {
                    queryResult.fulfillmentText = 'Product not found!!!';
                }

                res.send(dfRes);
            },
        );

        conn.end(debugFn);
    } else {
        res.send(dfRes);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
