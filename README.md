# Ex.5 - Ansible-Deployed GraphQL API for Task Management

Folders
- graphql-task-api/  : Node.js + Express GraphQL CRUD API (startup file src/app.js, port 4000)
- graphql-ansible/   : Deploy.yml (clone from Git) and Deploy-local.yml (copy local folder)

## 1. Prerequisites (Ubuntu / WSL)
    sudo apt update
    sudo apt install -y ansible git nodejs npm
    ansible --version && node -v && npm -v

## 2. Test the API locally (optional)
    cd graphql-task-api
    npm install
    npm start
    # open http://localhost:4000/graphql

## 3. Deploy with Ansible
Option A - from GitHub (Deploy.yml): push graphql-task-api to your repo, put its URL in Deploy.yml, then
    cd graphql-ansible
    ansible-playbook Deploy.yml

Option B - no GitHub (Deploy-local.yml):
    cd graphql-ansible
    ansible-playbook Deploy-local.yml

## 4. Verify
    pm2 list
    curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" \
      -d '{"query":"{ tasks { id title completed } }"}'

## Sample GraphQL operations
    query { tasks { id title description completed } }
    mutation { addTask(title:"Write record", description:"FOSS Ex.5") { id title } }
    mutation { updateTask(id:"1", completed:true) { id completed } }
    mutation { deleteTask(id:"2") { id title } }
