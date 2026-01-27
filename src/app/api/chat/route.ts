import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Store conversations in memory (use database in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>()

let zaiInstance: any = null

async function getZAIInstance() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build message history with system prompt
    const systemPrompt = `You are Lano IA, a friendly and helpful AI assistant with a physical body (a cute animated ball). You are conversational, engaging, and always respond in Portuguese unless the user asks otherwise. You have a playful personality and love to chat with users. Be warm, helpful, and sometimes add emojis to make the conversation more engaging. You can move around the screen, so feel free to mention that you're moving while thinking or responding.`

    const messages = [
      {
        role: 'assistant',
        content: systemPrompt
      },
      ...history
    ]

    // Add user message
    messages.push({
      role: 'user',
      content: message
    })

    // Get ZAI instance
    const zai = await getZAIInstance()

    // Generate response
    const completion = await zai.chat.completions.create({
      messages: messages,
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('Empty response from AI')
    }

    return NextResponse.json({
      success: true,
      response: response
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process your message. Please try again.'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (sessionId) {
      conversations.delete(sessionId)
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation cleared'
    })
  } catch (error) {
    console.error('Error clearing conversation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear conversation'
      },
      { status: 500 }
    )
  }
}
