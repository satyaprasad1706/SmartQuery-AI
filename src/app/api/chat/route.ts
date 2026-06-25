import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const { optimizedPrompt } = await request.json()

    if (!optimizedPrompt || typeof optimizedPrompt !== 'string' || optimizedPrompt.trim() === '') {
      return NextResponse.json({ error: 'Optimized prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    // If Gemini API Key is not set, run the high-fidelity mock chat generator
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured. Using mock AI response.')
      return NextResponse.json(getMockResponse(optimizedPrompt))
    }

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: optimizedPrompt,
    })

    const aiResponse = response.text ? response.text.trim() : 'No response generated.'

    return NextResponse.json({
      response: aiResponse,
      isMock: false
    })

  } catch (error: any) {
    console.error('Error in /api/chat:', error)
    return NextResponse.json({ 
      error: 'Failed to generate AI response', 
      details: error.message 
    }, { status: 500 })
  }
}

// Fallback high-fidelity mock response generator for demo purposes
function getMockResponse(optimizedPrompt: string): { response: string; isMock: boolean } {
  let response = ''
  
  if (/Software Engineer/i.test(optimizedPrompt)) {
    response = `### Tech Stack Recommendation & Guide

Here is a structured implementation guide based on your query:

1. **Architecture Overview**
   We will build this using a serverless-first microservices model, leveraging Next.js API Routes (Vercel) for server-side logic and Supabase for real-time relational state management.

2. **Core Implementation Steps**
   - Initialize PostgreSQL tables using the migration script.
   - Configure Row Level Security (RLS) policies for user isolation.
   - Write standard React Hooks utilizing custom fetching rules to avoid over-fetching.

\`\`\`typescript
// Example: Safe database query client-side
import { createClient } from '@/utils/supabase/client'

export const useUserChats = (userId: string) => {
  const supabase = createClient()
  
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      
    if (error) throw new Error(error.message)
    return data
  }
  
  return { fetchChats }
}
\`\`\`

3. **Performance Metrics**
   - **DB Query Latency:** < 50ms
   - **Authentication check:** < 10ms (cached session via cookie)
   - **Render cycles:** Optimized using React state management with zero double-mount flashes.`
  } else if (/copywriter/i.test(optimizedPrompt)) {
    response = `### Optimized Copywriting Copy

Here is the copywriting output engineered for conversion, clarity, and keyword optimization:

# Say Goodbye to Token Waste. Start Prompting Smarter.

*Are your LLM API bills climbing? Do your users write endless, conversational prompts that eat up your context windows?*

**SmartQuery AI** is the first intelligent prompt optimizer that fits seamlessly between your users and your model APIs. 

* **Reduce Costs by 30%+:** Automatically prunes unnecessary polite phrasing, filler context, and redundant specifications before they hit the API.
* **Elevate Response Quality:** Automatically injects domain-expert personas and structures clear constraints.
* **Full Transparency:** Detailed logs showing exact tokens saved, rules applied, and estimated dollar savings in real-time.

*Join 10,000+ developers making their LLM pipelines cleaner and more cost-effective today.*

[Get Started for Free →] [Book a Demo] `
  } else {
    response = `### Structured Analysis & Response

Based on your optimized prompt constraints, here is a detailed breakdown of the requested topics:

1. **Key Concepts**
   - **Efficiency:** Streamlining input data to reduce network latency and LLM compute time.
   - **Explainability:** Providing user-facing logs showing what was altered in their prompt and why (rules applied, token differentials).
   - **Scalability:** Architecting the pipeline to support high concurrency with sub-second processing overhead.

2. **Strategic Recommendations**
   - **Monitor logs regularly:** Keep an eye on the Analytics screen to track which prompt styles yield the highest token compression ratios.
   - **Fine-tune rules:** Customize persona overrides in Settings to better fit your team's specific industry vertical.`
  }

  return {
    response,
    isMock: true
  }
}
