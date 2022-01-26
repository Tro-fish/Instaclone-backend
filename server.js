require('dotenv').config();
import { ApolloServer, gql } from "apollo-server";
import schema from "./schema.js";
import { getUser,protectResolver } from "./users/users.utils.js";


const server = new ApolloServer({
 schema,
 context : async({req}) =>{  
   return{
   loggedInUser : await getUser(req.headers.token),
   protectResolver,
   };
 },
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));
