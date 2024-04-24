import { google } from 'googleapis';
import * as cron from  'node-cron';
import * as fs from 'fs';

// MAIN --------------------------------------------------------------------------------------------
// Run the getwhitelist function on startup
getWhiteList();

// Run the getwhitelist function every minute
cron.schedule('* * * * *', async () => {
    try {
        console.log('Update whitelist cron job started');
        await getWhiteList();
    } catch (error) {
        writeToErrorLog(error);
    }
}, {
    name: 'pheno-plus-wl-update',
});

// Run the clearErrorLog function every week
cron.schedule('0 0 * * 0', () => {
    try {
        console.log('Clear error log cron job started');
        clearErrorLog();
    } catch (error) {
        writeToErrorLog(error);
    }
}, {
    name: 'pheno-plus-error-log-clear',
});

//HELPER FUNCTIONS --------------------------------------------------------------------------------------------
async function getWhiteList() {
    /**
     * Gets the white list from the google sheet
     * Writes the white list to a JSON file in the ./secrets folder
     */
    const auth = new google.auth.GoogleAuth({
        // Secrets is kept out of version control and will need to be added to the application folder manually
        keyFile: './secrets/pheno-plus-cred.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({
        version: 'v4',
        auth
    });

    try {
        const fileId = '1SBFAE9DbE5eBjKeehx5ArbaLm4arsi6S2j5sJ7pnCZ0';
        const range = 'Sheet1!A:B';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: fileId,
            range: range,
        });

        writeToJsonFile(response.data.values);

        return response.data.values;
    } catch (error) {
        console.error('The API returned an error: ' + error);
        writeToErrorLog(error);
        throw error;
    }
}

function writeToJsonFile(data) {
    // remove the first row as it contains the header
    data.shift();

    // Make the data into an object rather than an array
    const obj = {};
    data.forEach((row) => {
        obj[row[0]] = row[1];
    });

    // Write the object to a JSON file
    fs.writeFile('./secrets/whiteList.json', JSON.stringify(obj), (err) => {
        if (err) {
            console.error(err);
            writeToErrorLog(err);
            return;
        }
        console.log('whitelist file has been updated');
    });
}

function writeToErrorLog(error) {
    fs.appendFile('./secrets/error.log', error, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('error has been logged');
    });
}

function clearErrorLog() {
    fs.writeFile('./secrets/error.log', '', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('error log has been cleared');
    });
}