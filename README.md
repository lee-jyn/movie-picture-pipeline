# Movie Picture Pipeline

GitHub Actions CI/CD for a movie catalog app: a React frontend (`starter/frontend`) and a Flask backend (`starter/backend`).
Images are built, pushed to Amazon ECR and deployed to Amazon EKS.

## Live URLs

- Frontend: http://a64b74f1c796146f6b4452c800f822fc-1647012235.us-east-1.elb.amazonaws.com
- Backend: http://a24e0731199bd44d0aeb84d68ddbe5ae-1676510580.us-east-1.elb.amazonaws.com/movies

The frontend shows the movie list from the backend, which confirms `REACT_APP_MOVIE_API_URL` was passed at build time.
These URLs stay up during the review and are deleted afterwards.

## Workflows

| File | Trigger |
|---|---|
| `frontend-ci.yaml`, `backend-ci.yaml` | `pull_request` to `main` (app changes), `workflow_dispatch` |
| `frontend-cd.yaml`, `backend-cd.yaml` | `push` to `main` (app changes), `workflow_dispatch` |

- **CI:** `lint` and `test` run in parallel; `build` (Docker) runs only after both pass (`needs`).
- **CD:** same `lint` and `test`, then `build` pushes an image tagged with the git SHA to ECR, and `deploy` applies the manifests with
  `kustomize edit set image` and `kustomize build | kubectl apply -f -`.
- A failed lint or test stops the build, and a failed build stops the deployment.

## Pipeline runs

Successful runs for each workflow (all jobs green):

| Workflow | Run | Trigger |
|---|---|---|
| Frontend Continuous Integration | [Run 37867395818](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37867395818) | `workflow_dispatch` on `main` |
| Frontend Continuous Integration | [Run 37783252590](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37783252590) | `pull_request` |
| Backend Continuous Integration | [Run 37867358893](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37867358893) | `workflow_dispatch` on `main` |
| Backend Continuous Integration | [Run 37783252550](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37783252550) | `pull_request` |
| Frontend Continuous Deployment | [Run 37822478699](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37822478699) | `push` to `main` |
| Backend Continuous Deployment | [Run 37819895756](https://github.com/lee-jyn/movie-picture-pipeline/actions/runs/37819895756) | `push` to `main` |

All runs are listed on the [Actions tab](https://github.com/lee-jyn/movie-picture-pipeline/actions).

## Configuration

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`. Nothing is hard-coded, and the account ID is masked in logs.
- Variable: `REACT_APP_MOVIE_API_URL`, the deployed backend URL used when building the frontend image.
- ECR repositories, the EKS cluster and the GitHub Actions IAM user come from `setup/terraform`.

## Local development

```bash
# Frontend
cd starter/frontend && npm ci && npm run lint && CI=true npm test
REACT_APP_MOVIE_API_URL=http://localhost:5000 npm start

# Backend
cd starter/backend && pipenv install --dev && pipenv run lint && pipenv run test
pipenv run serve
```
