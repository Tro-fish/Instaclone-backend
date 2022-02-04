import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    editphoto: protectResolver(async (_, { id, caption }, { loggedInUser }) => {
      const oldPhoto = await client.photo.findFirst({
        where: {
          id,
          userId: loggedInUser.id,
        },
        include: {
          hashtags: {
            select: {
              hashtag: true, //모든 hashtag 불러오기
            },
          },
        },
      });
      if (!oldPhoto) {
        return {
          oldPhoto: false,
          error: "Photo not found.",
        };
      }
      await client.photo.update({
        where: {
          id,
        },
        data: {
          caption,
          hashtags: {
            disconnect: oldPhoto.hashtags, // 기존 hashtag들을 모두 삭제하기
            connectOrCreate: processHashtags(caption),
          },
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
