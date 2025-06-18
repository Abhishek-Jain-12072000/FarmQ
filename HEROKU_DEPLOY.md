# Deploying to Heroku

Follow these steps to deploy your FarmQ application to Heroku:

## Prerequisites

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku:
   ```
   heroku login
   ```

## Deployment Steps

### Option 1: Deploy with Git

1. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

2. Add a git remote for Heroku:
   ```
   heroku git:remote -a your-app-name
   ```

3. Push your code to Heroku:
   ```
   git push heroku main
   ```

### Option 2: Deploy with Docker

1. Login to Heroku Container Registry:
   ```
   heroku container:login
   ```

2. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

3. Set the stack to container:
   ```
   heroku stack:set container -a your-app-name
   ```

4. Push your Docker container:
   ```
   heroku container:push web -a your-app-name
   ```

5. Release the container:
   ```
   heroku container:release web -a your-app-name
   ```

## Verify Deployment

Open your app in the browser:
```
heroku open -a your-app-name
```

## Troubleshooting

- View logs:
  ```
  heroku logs --tail -a your-app-name
  ```

- Restart the app:
  ```
  heroku restart -a your-app-name
  ```