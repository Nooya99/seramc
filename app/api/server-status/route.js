import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://minecraft-mp.com/server-s360482', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 60 } // Cache data for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from minecraft-mp: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    let status = 'Offline';
    let players = '0';
    let maxPlayers = '0';
    
    // Check status
    if (html.includes('<span class="badge badge-success">Online</span>') || html.includes('Online</span>')) {
      status = 'Online';
    }
    
    // Extract players (format: <td><strong>23/28</strong></td>)
    const playerRegex = /<strong>(\d+)\/(\d+)<\/strong>/i;
    const match = html.match(playerRegex);
    if (match) {
      players = match[1];
      maxPlayers = match[2];
    }
    
    return NextResponse.json({ status, players, maxPlayers });
  } catch (error) {
    console.error('Error scraping minecraft-mp:', error);
    return NextResponse.json({ status: 'Offline', players: '0', maxPlayers: '0', error: error.message }, { status: 500 });
  }
}
