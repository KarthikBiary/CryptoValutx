import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-placeholder" 
});

export async function getAIResponse(message: string): Promise<string> {
  try {
    const systemPrompt = `You are a helpful AI assistant for SolWallet, a Solana-based cryptocurrency wallet application. 

Your role is to help users with:
- Understanding Solana blockchain and transactions
- Wallet security best practices
- Troubleshooting common issues
- General cryptocurrency questions
- Explaining transaction fees and processing times
- Providing guidance on sending and receiving crypto

Guidelines:
- Be helpful, informative, and security-conscious
- Always emphasize the importance of keeping private keys secure
- Provide clear, step-by-step instructions when appropriate
- If a question is outside your expertise, be honest about limitations
- Keep responses concise but comprehensive
- Use friendly, professional language

Current context: User is using SolWallet, a Solana wallet interface.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback responses for common queries
    const fallbackResponses: Record<string, string> = {
      "security": "For security, always keep your private key secure and never share it with anyone. Verify recipient addresses before sending transactions.",
      "fees": "Solana transactions typically have very low fees, usually under $0.001. Transaction times are typically 1-2 seconds.",
      "default": "I'm currently unable to connect to the AI service. For immediate help, please check our documentation or contact support."
    };

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("security") || lowerMessage.includes("private key")) {
      return fallbackResponses.security;
    } else if (lowerMessage.includes("fee") || lowerMessage.includes("cost")) {
      return fallbackResponses.fees;
    }
    
    return fallbackResponses.default;
  }
}
