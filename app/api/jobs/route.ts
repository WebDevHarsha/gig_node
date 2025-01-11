"use strict";
import connect from "../../../lib/db";
import JobPost from "../../../lib/models/job";
import { NextResponse } from "next/server";

interface JobPostRequestBody {
    title: string;
    description: string;
    projectType: 'Full-time' | 'Part-time' | 'Contract' | 'One-time';
    skills: string[];
    budget: number;
    paymentMethod: 'Crypto' | 'Fiat' | 'Hybrid';
}

export const GET = async (): Promise<NextResponse> => {
    try {
        await connect();
        const jobs = await JobPost.find();
        return new NextResponse(JSON.stringify(jobs), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in fetching jobs: ${errorMessage}`, { status: 500 });
    }
};

export const POST = async (request: Request): Promise<NextResponse> => {
    try {
        const body = (await request.json()) as JobPostRequestBody;
        
        await connect();
        const jobPost = new JobPost(body);
        await jobPost.save();
        
        return new NextResponse(JSON.stringify(jobPost), { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in creating job post: ${errorMessage}`, { status: 500 });
    }
};