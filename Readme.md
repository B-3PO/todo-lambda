# todo-lambda
Tasks
  -
  -
  -


## getting started
**install**

```bash
# install
npm install
```

**run**

```bash
# local invoke
serverless invoke local -f <function name> --data '{}' --stage=<NODE_ENV>

# local endpoints
# navigate to http://localhost:4001
# port can be changed in serverless.yml
serverless offline start --stage=<NODE_ENV>

# invoke
export AWS_PROFILE=<profile name>
serverless invoke -f <function name> --data '{}' --stage=<NODE_ENV>

# deploy
export AWS_PROFILE=<profile name>
serverless deploy --stage=<NODE_ENV>

# test
npm run test
```
