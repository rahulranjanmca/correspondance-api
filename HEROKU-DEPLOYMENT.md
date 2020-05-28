1. Install Git and the Heroku CLI
   - [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
   - [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. Initialize a local Git repository and commit the code to it.

```
$ git init
$ git add .
$ git commit -m "init project"
```

3. Configuration and Config Vars

   > Because of the application deployed on heroku, you should not use the localhost db and mock server.

   > You should config these vars and others you may need to adapt heroku environment though [heroku configuration](https://devcenter.heroku.com/articles/config-vars)

   > You may need [ngrok](https://ngrok.com/) to expose your local services to be accessed for the application on heroku.

4. Create a Heroku remote

```
$ heroku create
```

5. Deploy code

```
$ git push heroku master
```
