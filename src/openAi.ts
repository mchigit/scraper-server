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
          "Return only the generated description in JSON formats. The json should have 2 keys, descriptionEn and descriptionZh, with description as values. Combine both versions into a single json. ",
      },
      {
        role: "user",
        content: JSON.stringify(jsonData),
      },
    ],
  });

  console.log(response);
  if (response["choices"][0]["message"]["content"]) {
    const formattedResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "You will be given a string that is a JSON object with descriptions. You need to format the descriptions with HTML tags",
        },
        {
          role: "system",
          content:
            "The description will be multiple sentences. Separate each setence with <p> tags and add <br> tags to the end of each sentence.",
        },
        {
          role: "system",
          content:
            "Return the data in the same JSON format you received it in. But replace the values with formatted descriptions.",
        },
        {
          role: "user",
          content: response["choices"][0]["message"]["content"],
        },
      ],
    });

    console.log(formattedResponse);

    if (formattedResponse["choices"][0]["message"]["content"]) {
      return formattedResponse["choices"][0]["message"]["content"];
    }
  }

  return null;
};
