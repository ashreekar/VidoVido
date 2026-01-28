import { IVideo } from "@/modals/video"

export type VideoFormData = Omit<IVideo, "_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClinet {
    private async fetch<T>(endpoint: string,
        options: FetchOptions = {}): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }

        const res = await fetch(`/api/${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined
        })

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res.json();
    }

    async getVideos() {
        return this.fetch("/vidoes");
    }

    async createVideo(videoData: VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData
        })
    }
}

export const apiclient = new ApiClinet();