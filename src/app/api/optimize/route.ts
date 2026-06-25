import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Simple token estimator
function estimateTokens(text: string): number {
  if (!text) return 0
  // Basic heuristic: 1 token ~ 4 characters
  return Math.max(1, Math.ceil(text.length / 4))
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    // If Gemini API Key is not set, run the high-fidelity mock optimizer
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured. Using fallback prompt optimizer.')
      return NextResponse.json(getMockOptimization(prompt))
    }

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = `You are a professional Prompt Engineer and NLP Optimizer. 
Your goal is to optimize the user's raw prompt for maximum token-efficiency and LLM response quality.
Identify the core user intent, extract critical keywords, inject an expert persona if appropriate, define clear constraints, and strip away all conversational fluff, redundancies, and verbose phrases (like "please write a", "can you tell me", "in great detail", etc.).

Output your response STRICTLY as a JSON object with the following schema:
{
  "optimizedPrompt": "The restructured, clean, and highly token-efficient optimized prompt",
  "appliedRules": [
    { "name": "Rule Name (e.g. Persona Injection)", "description": "Short explanation of why/what was applied" }
  ],
  "removedPhrases": [
    "phrase 1",
    "phrase 2"
  ]
}
Do not return any markdown wrappers, backticks, or text before/after the JSON.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Raw Prompt: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    })

    const responseText = response.text ? response.text.trim() : '{}'
    const parsedData = JSON.parse(responseText)

    const originalTokens = estimateTokens(prompt)
    const optimizedTokens = estimateTokens(parsedData.optimizedPrompt)
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens)
    const savingsPercentage = originalTokens > 0 ? parseFloat(((tokensSaved / originalTokens) * 100).toFixed(1)) : 0

    return NextResponse.json({
      originalPrompt: prompt,
      optimizedPrompt: parsedData.optimizedPrompt,
      originalTokens,
      optimizedTokens,
      tokensSaved,
      savingsPercentage,
      appliedRules: parsedData.appliedRules || [],
      removedPhrases: parsedData.removedPhrases || [],
      isMock: false
    })

  } catch (error: any) {
    console.error('Error in /api/optimize:', error)
    return NextResponse.json({ 
      error: 'Failed to optimize prompt', 
      details: error.message 
    }, { status: 500 })
  }
}

// Fallback high-fidelity mock optimizer for out-of-the-box usage
function getMockOptimization(prompt: string) {
  const originalTokens = estimateTokens(prompt)
  
  // Custom mock rules to simulate prompt optimization
  let optimizedPrompt = prompt
  const appliedRules: { name: string; description: string }[] = []
  const removedPhrases: string[] = []

  // Check for common polite phrases
  const politePhrases = [
    /please write/i, /please tell/i, /can you/i, /could you/i, 
    /i would like you to/i, /i want you to/i, /help me write/i,
    /write a detailed/i, /explain in detail/i, /in great detail/i,
    /please explain/i, /a comprehensive guide to/i
  ]

  let cleaned = prompt
  politePhrases.forEach(regex => {
    if (regex.test(cleaned)) {
      const match = cleaned.match(regex)
      if (match) {
        removedPhrases.push(match[0])
        cleaned = cleaned.replace(regex, '')
      }
    }
  })

  // Apply Persona Injection simulation if user asks for specific domains
  if (/code|react|python|css|javascript|nextjs|html/i.test(prompt)) {
    optimizedPrompt = `Act as an expert Software Engineer. ${cleaned.trim()}`
    appliedRules.push({
      name: 'Persona Injection',
      description: 'Assigned "expert Software Engineer" to set technical depth and best-practice coding standards.'
    })
  } else if (/marketing|sales|blog|essay|write|copy/i.test(prompt)) {
    optimizedPrompt = `Act as an expert digital marketing copywriter. ${cleaned.trim()}`
    appliedRules.push({
      name: 'Persona Injection',
      description: 'Assigned "expert copywriter" to establish tone, vocabulary depth, and persuasive phrasing.'
    })
  } else {
    optimizedPrompt = `Act as an expert subject matter authority. ${cleaned.trim()}`
    appliedRules.push({
      name: 'Persona Injection',
      description: 'Assigned expert domain authority to ensure authoritative tone and accurate information.'
    })
  }

  // Redundancy removal rule
  if (removedPhrases.length > 0) {
    appliedRules.push({
      name: 'Redundancy Removal',
      description: 'Removed conversational filler, pleasantries, and polite framing to save input tokens.'
    })
  }

  // Constraint definition
  if (!/limit|words|sentences|paragraphs|bullet/i.test(prompt)) {
    optimizedPrompt = `${optimizedPrompt.trim()} Structure response with headings, bullet points, and a concise summary.`
    appliedRules.push({
      name: 'Constraint Definition',
      description: 'Added structuring rules (headings, bullet points) to optimize output token density.'
    })
  }

  const optimizedTokens = estimateTokens(optimizedPrompt)
  const tokensSaved = Math.max(0, originalTokens - optimizedTokens)
  const savingsPercentage = originalTokens > 0 ? parseFloat(((tokensSaved / originalTokens) * 100).toFixed(1)) : 0

  return {
    originalPrompt: prompt,
    optimizedPrompt,
    originalTokens,
    optimizedTokens,
    tokensSaved,
    savingsPercentage,
    appliedRules,
    removedPhrases: removedPhrases.length > 0 ? removedPhrases : ['(Polite phrasing/conversational filler)'],
    isMock: true
  }
}
