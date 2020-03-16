const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id : ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

   type User {
        _id: ID!
        name: String!
        email : String!
        password: String
        status: String!
        posts: [Post!]!
    }


    input UserInputData { 
        email: String!
        password: String!
        name: String!
    }

    input signinInputData {
        email: String!
        password: String!
    }

input postInputData {
    title : String!
    content: String!
    imageUrl: String!
}

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: postInputData): Post!
    }
    type rootQuery { 
        login(loginInput: signinInputData): User!
        getPosts: [Post!]!
    }

    schema {
       query: rootQuery
       mutation: RootMutation
    }
`);