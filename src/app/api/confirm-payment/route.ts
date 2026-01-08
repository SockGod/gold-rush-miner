import { NextRequest, NextResponse } from 'next/server'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload
}

export async function POST(req: NextRequest) {
  try {
    const { payload } = (await req.json()) as IRequestPayload

    console.log('🔍 Verifying payment with reference:', payload.reference)
    
    // IMPORTANTE: AQUI DEVÍAMOS VERIFICAR A REFERÊNCIA NA NOSSA BASE DE DADOS
    // Para esta primeira versão, vamos confiar e verificar diretamente com a WLD
    
    // 1. Verificar com a API do Developer Portal da WLD
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_WLD_APP_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.WLD_API_KEY}`,
        },
      }
    )
    
    if (!response.ok) {
      console.error('❌ WLD API response not OK:', response.status)
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to verify with WLD API' 
      })
    }
    
    const transaction = await response.json()
    console.log('📊 Transaction data from WLD:', transaction)
    
    // 2. Verificação básica (em produção seria mais rigorosa)
    if (transaction.reference === payload.reference && transaction.status !== 'failed') {
      console.log('✅ Payment verified successfully!')
      return NextResponse.json({ 
        success: true, 
        message: 'Payment confirmed!',
        transactionId: payload.transaction_id
      })
    } else {
      console.log('❌ Payment verification failed')
      return NextResponse.json({ 
        success: false, 
        message: 'Payment verification failed' 
      })
    }
    
  } catch (error) {
    console.error('💥 Error in confirm-payment:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error during verification' 
    })
  }
}