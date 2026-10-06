const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// In-memory data store (same two sample tasks as the lab manual output)
let msglist = [
  { id: 1, jobtodo: 'assignment', toggle: 0 },
  { id: 2, jobtodo: 'record', toggle: 0 },
];
let nextId = 3;

const MsgType = new GraphQLObjectType({
  name: 'Msg',
  fields: {
    id: { type: GraphQLInt },
    jobtodo: { type: GraphQLString },
    toggle: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    msglist: {
      type: new GraphQLList(MsgType),
      resolve: () => msglist,
    },
    msg: {
      type: MsgType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, { id }) => msglist.find((m) => m.id === id) || null,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: MsgType,
      args: { jobtodo: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_, { jobtodo }) => {
        const task = { id: nextId++, jobtodo, toggle: 0 };
        msglist.push(task);
        return task;
      },
    },
    updateTask: {
      type: MsgType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        jobtodo: { type: GraphQLString },
        toggle: { type: GraphQLInt },
      },
      resolve: (_, { id, jobtodo, toggle }) => {
        const task = msglist.find((m) => m.id === id);
        if (!task) throw new Error('Task not found');
        if (jobtodo !== undefined && jobtodo !== null) task.jobtodo = jobtodo;
        if (toggle !== undefined && toggle !== null) task.toggle = toggle;
        return task;
      },
    },
    deleteTask: {
      type: MsgType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, { id }) => {
        const index = msglist.findIndex((m) => m.id === id);
        if (index === -1) throw new Error('Task not found');
        return msglist.splice(index, 1)[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });