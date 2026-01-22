import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null; //mongodb connection instance
        promise: Promise<Connection> | null;
    }
}

export { };