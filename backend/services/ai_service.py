import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class AIWaiterService:
    def __init__(self):
        api_key = os.environ.get("GROQ_API_KEY")
        self.client = Groq(api_key=api_key) if api_key else None
        self.model = "llama-3.3-70b-versatile"
        
    def get_suggestion(self, user_message: str, current_menu: str) -> str:
        system_prompt = f"""
You are an expert waiter at our restaurant. Use the provided menu to recommend dishes. 
Be polite, engaging, and specifically ask about allergies if not mentioned by the customer.

Here is the current menu:
{current_menu}
"""
        
        if not self.client:
            return "AI service is not configured (missing API key). A human waiter will be right with you!"

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_message,
                    }
                ],
                model=self.model,
                temperature=0.7,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return "I apologize, but I'm having trouble thinking right now. A human waiter will be right with you!"
