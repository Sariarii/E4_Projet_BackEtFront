import { Schema } from "mongoose";

export = mongooseErrors;

declare function mongooseErrors(schema: Schema, options?: any): void;

declare namespace mongooseErrors {
}