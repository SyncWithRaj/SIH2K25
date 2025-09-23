import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  }

  // Convert the file to a buffer to be sent to Cloudinary
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'margdarshak-resources', // Optional: organize uploads in a specific folder
    });

    // Return the secure URL of the uploaded image
    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ success: false, message: "Upload failed.", error: error.message }, { status: 500 });
  }
}

