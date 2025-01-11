"use strict";
import connect from "../../../../lib/db";
import User from "../../../../lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


const { ObjectId } = Types;

interface UserRequestBody {
    username: string;
    email: string;
    password: string;
}

export const GET = async (): Promise<NextResponse> => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in fetching user: ${errorMessage}`, { status: 500 });
    }
};

export const POST = async (request: Request): Promise<NextResponse> => {
    try {
        const body = (await request.json()) as UserRequestBody;
        await connect();
        const userUser = new User(body);
        await userUser.save();
        return new NextResponse(JSON.stringify(userUser), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in creating user: ${errorMessage}`, { status: 500 });
    }
};

export const PATCH = async (request: Request): Promise<NextResponse> => {
    try {
        const body = (await request.json()) as { userId: string; newUsername: string };
        await connect();

        const { userId, newUsername } = body;
        if (!userId || !newUsername) {
            return new NextResponse("User ID or new username not provided", { status: 400 });
        }

        if (!ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({ message: "User updated successfully", user: updatedUser }),
            { status: 200 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in updating user: ${errorMessage}`, { status: 500 });
    }
};

export const DELETE = async (request: Request): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse("User ID not provided", { status: 400 });
        }

        if (!ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully", user: deletedUser }),
            { status: 200 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in deleting user: ${errorMessage}`, { status: 500 });
    }
};
