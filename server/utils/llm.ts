import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config({ quiet: true });

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function askLLM(guawithYao: string) {
  const prompt = `请帮助我生成此卦和爻辞: ${guawithYao} 的详细信息, 包括: 卦辞, 爻名, 爻辞, 象辞, 彖传解释, 象转解释等.`;

  const aiResponse = await googleAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const result = aiResponse.text;

  if (!result) throw new Error('抱歉, 模型暂时无法返回内容, 请稍后在尝试, 非常感谢.');

  return result;
}
