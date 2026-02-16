
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsight = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "暂无交易数据，无法生成分析。";

  const prompt = `
    以下是最近的货币兑换交易记录：
    ${JSON.stringify(transactions.slice(-10))}

    请作为一名资深金融分析师，简要分析：
    1. 利润情况是否健康？
    2. 两位合伙人的垫付比例是否平衡？
    3. 哪种兑换类型贡献了更多利润？
    
    请用简短的中文回答，字数在200字以内。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "你是一个专业的货币兑换业务财务顾问，专门协助合伙人分析每日营收情况。",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "暂时无法获取AI分析。";
  }
};
