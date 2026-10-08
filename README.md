# Ex.5 - Ansible-Deployed GraphQL API for Task Management with Node.js

**Aim:** Create a GraphQL API for a Task Management application and deploy it using Ansible.

Folders
- `graphql-task-api/` : Node.js + Express GraphQL API (startup file `src/app.js`, endpoint `/graphql`, default port **5000**)
- `graphql-ansible/`  : `Deploy.yml` (clone from Git) and `Deploy-local.yml` (copy local folder)

## 1. Prerequisites (Ubuntu / WSL)
    sudo apt update
    sudo apt install -y ansible git nodejs npm
    ansible --version && node -v && npm -v

## 2. Test the API locally (optional)
    cd graphql-task-api
    npm install
    npm start
    # Web UI : http://localhost:5000/index.html
    # GraphiQL: http://localhost:5000/graphql

## 3. Deploy with Ansible
Option A - from GitHub (`Deploy.yml`): push the project, set the repo URL in `Deploy.yml`, then

    cd graphql-ansible
    ansible-playbook Deploy.yml --syntax-check
    ansible-playbook Deploy.yml

Option B - no GitHub (`Deploy-local.yml`):

    cd graphql-ansible
    ansible-playbook Deploy-local.yml

## 4. Verify
    pm2 list
    pm2 status
    pm2 logs task-manager

In the browser open `http://localhost:5000/graphql` (GraphiQL) and run:

    query { msglist { id jobtodo toggle } }

Expected: the tasks `assignment` and `record`, each with an `id` and `toggle` value.
Or from the terminal:

    curl -X POST http://localhost:5000/graphql -H "Content-Type: application/json" \
      -d '{"query":"{ msglist { id jobtodo toggle } }"}'

## Sample GraphQL operations
    query    { msglist { id jobtodo toggle } }
    query    { msg(id: 1) { id jobtodo toggle } }
    mutation { addTask(jobtodo: "Write record") { id jobtodo toggle } }
    mutation { updateTask(id: 1, toggle: 1) { id jobtodo toggle } }
    mutation { deleteTask(id: 2) { id jobtodo } }

## Troubleshooting
- Clone fails: check the Git URL, branch (`main`) and network.
- npm task fails: Node.js/npm must be installed (see section 1).
- PM2 can't start `src/app.js`: confirm the file exists in the deployed folder and dependencies were installed.
- Page doesn't load: `pm2 logs task-manager`, and check port 5000 and the `/graphql` route.
