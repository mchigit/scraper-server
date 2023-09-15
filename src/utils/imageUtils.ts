import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { CHROME_ENDPOINT_HTTPS } from "../constants";

export type WorkspaceUploadResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export const uploadImageBlobs = async (
  images: Array<{
    blob: File;
    filename: string;
  }>
) => {
  const uploadEndpoint = `${CHROME_ENDPOINT_HTTPS}/workspace`;

  const newFormData = new FormData();
  images.forEach((image) => {
    newFormData.append("file", image.blob, image.filename);
  });

  const res = await axios.post(uploadEndpoint, newFormData, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to upload images");
  }

  return res.data as WorkspaceUploadResponse[];
};
