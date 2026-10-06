const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// In-memory data store
let tasks = [
  { id: '1', title: 'Learn GraphQL', description: 'Study queries and mutations', completed: false },
  { id: '2', title: 'Deploy with Ansible', description: 'Write Deploy.yml playbook', completed: false },
];
let nextId = 3;

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => tasks,
    },
    task: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }) => tasks.find((t) => t.id === id) || null,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve: (_, { title, description }) => {
        const task = { id: String(nextId++), title, description: description || '', completed: false };
        tasks.push(task);
        return task;
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
      },
      resolve: (_, { id, ...changes }) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) throw new Error('Task not found');
        Object.keys(changes).forEach((k) => {
          if (changes[k] !== undefined && changes[k] !== null) task[k] = changes[k];
        });
        return task;
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }) => {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Task not found');
        return tasks.splice(index, 1)[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
