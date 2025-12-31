import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logout berhasil' 
      },
      { status: 200 }
    )

    // Hapus cookie auth-token
    response.cookies.delete('auth-token')
    
    // Hapus cookie user-role
    response.cookies.delete('user-role')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
