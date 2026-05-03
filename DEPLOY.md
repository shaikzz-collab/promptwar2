# Deploying VoteSphere to Google Cloud Run

We have prepared everything needed to deploy VoteSphere to Google Cloud Run. This uses a Docker container to package the frontend and backend together.

## Prerequisites

1.  Make sure you have the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed.
2.  Login to your Google Cloud account:
    ```bash
    gcloud auth login
    ```
3.  Set your project to `votesphere-495214`:
    ```bash
    gcloud config set project votesphere-495214
    ```
4.  Enable the required APIs (if not already enabled):
    ```bash
    gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
    ```

## Method 1: Deploy from Source (Easiest)

You can let Google Cloud Build the container and deploy it automatically from your local source code.

Run this command in the root of the project:

```bash
gcloud run deploy votesphere --source . --region us-central1 --allow-unauthenticated --set-env-vars JWT_SECRET=production_super_secret_key
```

It will ask you to confirm some prompts. Once finished, it will output a `Service URL`.

## Method 2: Deploy using Cloud Build and Docker (More Control)

We have created a `cloudbuild.yaml` and a `Dockerfile`.

1.  Submit the build to Cloud Build:
    ```bash
    gcloud builds submit --config cloudbuild.yaml .
    ```
    This will build the Docker image, push it to GCR, and deploy it to Cloud Run.

---

**Note about Data Persistence:**
Currently, the database is a simple JSON file (`server/database.json`). In Google Cloud Run, instances are stateless. This means that if the instance shuts down or scales, the database will revert to its initial state.
For a true production environment, you should replace the JSON file database logic in `server/db.js` with a managed database service like **Google Cloud Firestore** or **Cloud SQL**.
