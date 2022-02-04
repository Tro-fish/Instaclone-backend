import client from "../../client";

export default {
  Query: {
    seeHashtag: (_, { hashtag }) =>
      client.hashtag.findUniqe({
        where: {
          hashtag,
        },
      }),
  },
};
