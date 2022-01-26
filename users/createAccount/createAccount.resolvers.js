import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      //check if username or emil are already on DB.

      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username: username,
              },
              {
                email: email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }
        //hash password.
        const uglyPassword = await bcrypt.hash(password, 10);
        //save and return the user.
        const user = await client.user.create({
          data: {
            username,
            lastName,
            firstName,
            email,
            password: uglyPassword,
          },
        });
        return user;
      } catch (e) {
        return e;
      }
    },
  },
};
