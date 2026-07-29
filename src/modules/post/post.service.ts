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
            title :{
                contains : payload.search as string,
                mode : "insensitive"
            }
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPosts
}