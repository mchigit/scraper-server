import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDescription = async (jsonData: Record<string, any>) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content:
          "You are a copywriter for a real estate company. You are tasked with writing rental ad descriptions based on JSON data, which the user will give you. Ignore the contact info data from the JSON but keep the rest.",
      },
      {
        role: "system",
        content:
          "You will keep the description short and on point. Don't need to over exaggerate. Generate a version for English and a version for Chinese-simplified.",
      },
      {
        role: "system",
        content:
          "You will keep the description visually clean by adding line breaks (\n) between each point.",
      },
      {
        role: "system",
        content:
          "Return only the generated description in JSON formats. The json should have 2 keys, descriptionEn and descriptionZh, with description as values. The value should maintain the \n characters so it can be rendered in a wysiwyg editor, combine both versions into a single json. ",
      },
      {
        role: "user",
        content: JSON.stringify(jsonData),
      },
    ],
  });

  console.log(response);
  return response["choices"][0]["message"]["content"];
};
