import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type GenerateContentRequest,
} from "@google/generative-ai";
import { GEMENI_SECRET_KEY } from "$env/static/private";

export async function POST({ request }: { request: Request }) {
  const { imageBase64 } = await request.json();
  const genAI = new GoogleGenerativeAI(GEMENI_SECRET_KEY);

  let detailsToProvide = [
    "make",
    "model",
    "type",
    "color",
    "transmission",
    "mileage",
    "fuelType",
    "engineSize",
  ];
  let types = [
    { type: ["Sedan", "Sedan", "SUV", "Hatchback", "Truck", "Convertible"] },
    { tranmission: ["Manual", "Automatic"] },
    { fuelType: ["Petrol", "Diesel", "Electric", "Hybrid"] },
    { mileage: "in KM" },
    { engineSize: "in cc (string)" },
    { price: "in USD (number)" },
  ];
  let contents = [
    {
      role: "user",
      parts: [
        { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
        {
          text:
            `Analyze this car image and provide the following details: ${detailsToProvide}` +
            `Follow these types for the fields ${types}` +
            "Also include the cars estimated price in USD" +
            "Do not include any other details or text. Give it in pure JSON format. Do not include text like '```json' as well",
        },
      ],
    },
  ];
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const result = await model.generateContentStream({
    contents,
  } as GenerateContentRequest);

  let response = "";
  for await (let r of result.stream) {
    response += r.text();
  }
  const parsed = response.slice(7, response.length - 3);

  return new Response(JSON.stringify(parsed), {
    headers: {
      "content-type": "application/json",
    },
  });
}
