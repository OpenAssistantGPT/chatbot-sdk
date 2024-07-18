import { OpenAI } from "openai";
import { z } from "zod";


const routeContextSchema = z.object({
    params: z.object({
        fileId: z.string(),
    }),
})

export async function GET(
    request: Request,
    context: z.infer<typeof routeContextSchema>
) {

    const { params } = routeContextSchema.parse(context)

    const openai = new OpenAI({
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        apiKey: process.env.OPENAI_API_KEY,
    });

    const [file, fileContent] = await Promise.all([
        openai.files.retrieve(params.fileId),
        openai.files.content(params.fileId),
    ]);

    return new Response(fileContent.body, {
        headers: {
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        },
    });
}