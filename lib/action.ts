"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from 'slugify'
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (state: any, form: FormData, pitch: string) => {
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: "Not Signed In",
        status: "ERROR",
    });

    const {title, description, category, link} = Object.fromEntries(
        Array.from(form).filter(([key]) => key != 'pitch' ),
    )

    const slug = slugify(title as string, { lower: true, strict: true});

    try{
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: "slug",
                current: slug,
            },
            author: {
                _type: 'reference',
                _ref: session?.id,
            },
            pitch,
        };

        const result = await writeClient.create({_type: "startup", ...startup})

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS',
        })

    } catch(error){
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        })
    }

}

// SkillForge is an AI-powered platform that creates personalized learning paths tailored to each user's goals, skill level, and pace. By intelligently curating content and adapting in real-time, it helps individuals reskill, prepare for certifications, or explore new interests more efficiently and meaningfully.