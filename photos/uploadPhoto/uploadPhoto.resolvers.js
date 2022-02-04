import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";
import {uploadToS3} from "../../shared/shared.utils";
export default {
  Mutation: {
    uploadPhoto: protectResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          /// parse caption
         hashtagObj = processHashtags(caption);
          // get or create Hashtags
        }
        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads")
        return client.photo.create({
          data: {
            file : fileUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
        // save the photo WITH the parsed hashtags
        // add the photo to the hashtags
      }
    ),
  },
};
