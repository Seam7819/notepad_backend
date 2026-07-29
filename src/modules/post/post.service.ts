import { Posts } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Posts, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.posts.create({
        data
    })
    return result;
}

const getAllPosts = async (payload:{search : string | undefined})=>{
    const result = await prisma.posts.findMany({
        where : {
            OR:[
                {title :{
                contains : payload.search as string,
                mode : "insensitive"
            }},
            {content :{
                contains : payload.search as string,
                mode : "insensitive"
            }},{
                tags:{
                    has : payload.search as string
                }
            }
            ]
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPosts
}