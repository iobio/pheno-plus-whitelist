### Pheno+ access list updater (test)
This is a basic background application that reads from a google doc and updates a json access list. This is for sociotechnical testing only and will not be used for the final production application.

**Note**
Not committed to version control is the `/secrets` folder which will need to be present in the root of the application and contain the following:
- `pheno-plus-cred.json`: A json file that should contain valid and appropriately authorized api credentials to be used by the `googleapis` SDK.
- `error.log`: File to be written to with any errors.
- `whiteList.json`: Json file to be updated by the application, if it isn't present it will be created on app startup.

#### To check or restart the process
to check the process - a user can call `ps aux | grep 'node whitelistcron.js'`
to restart - check process, kill the process id, and restart the app