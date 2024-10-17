import { z } from 'zod';
import { put } from "@vercel/blob";
import { randomUUID } from 'crypto';

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf", "text/plain", "application/xml", "text/csv"].includes(file.type),
      {
        message: "File type should be JPEG, PNG, or PDF",
      },
    ),
});

export async function handleFileUpload(request: Request) {
  
  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response( "No file uploaded", { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return new Response( errorMessage , { status: 400 });
    }

    const filename = file.name;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(`${randomUUID()}-${filename}`, fileBuffer, {
        access: "public",
      });

      return new Response(JSON.stringify({ url: data.url, pathname: filename, contentType: file.type }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      return new Response("Upload failed", { status: 500 });
    }
  } catch (error) {
    return new Response(
      "Failed to process request",
      { status: 500 },
    );
  }
}
