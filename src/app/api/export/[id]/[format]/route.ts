import { NextRequest, NextResponse } from 'next/server';
import { Track, Collection, ExportFormat } from '@/types';

// Mock data - in a real app, this would come from your database
const mockCollections: Collection[] = [];
const mockTracks: Track[] = [];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; format: string }> }
) {
  try {
    const { id, format } = await context.params;
    
    // Validate format
    if (!['csv', 'm3u', 'json'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
    
    // Type assertion for format
    const validFormat = format as ExportFormat;
    
    // Find the collection
    const collection = mockCollections.find(c => c.id === id);
    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    
    // Get tracks for this collection (mock implementation)
    const tracks = mockTracks.filter(_track => 
      // In real implementation, you'd query collection_tracks table
      true // placeholder
    );
    
    let content: string;
    let contentType: string;
    let filename: string;
    
    switch (validFormat) {
      case 'csv':
        content = generateCSV(tracks, collection);
        contentType = 'text/csv';
        filename = `${collection.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        break;
        
      case 'm3u':
        content = generateM3U(tracks, collection);
        contentType = 'audio/x-mpegurl';
        filename = `${collection.name.replace(/[^a-zA-Z0-9]/g, '_')}.m3u`;
        break;
        
      case 'json':
        content = generateJSON(tracks, collection);
        contentType = 'application/json';
        filename = `${collection.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' }, 
      { status: 500 }
    );
  }
}

function generateCSV(tracks: Track[], _collection: Collection): string {
  const headers = [
    'Title',
    'Artists', 
    'Genre',
    'BPM',
    'Key',
    'Label',
    'Release Date',
    'Beatport ID',
    'Preview URL'
  ];
  
  const csvRows = [
    headers.join(','),
    ...tracks.map(track => [
      escapeCsvField(track.title),
      escapeCsvField(track.artists.join('; ')),
      escapeCsvField(track.genre),
      track.bpm.toString(),
      escapeCsvField(track.key),
      escapeCsvField(track.label || ''),
      escapeCsvField(track.releaseDate || ''),
      track.beatportId?.toString() || '',
      escapeCsvField(track.previewUrl || '')
    ].join(','))
  ];
  
  return csvRows.join('\n');
}

function generateM3U(tracks: Track[], collection: Collection): string {
  const m3uLines = [
    '#EXTM3U',
    `#PLAYLIST:${collection.name}`,
    ''
  ];
  
  tracks.forEach(track => {
    if (track.previewUrl) {
      m3uLines.push(`#EXTINF:-1,${track.artists.join(', ')} - ${track.title}`);
      m3uLines.push(track.previewUrl);
      m3uLines.push('');
    }
  });
  
  return m3uLines.join('\n');
}

function generateJSON(tracks: Track[], collection: Collection): string {
  const exportData = {
    collection: {
      id: collection.id,
      name: collection.name,
      tags: collection.tags,
      updatedAt: collection.updatedAt,
      syncedAt: collection.syncedAt,
      beatportPlaylistId: collection.beatportPlaylistId
    },
    tracks: tracks.map(track => ({
      id: track.id,
      beatportId: track.beatportId,
      title: track.title,
      artists: track.artists,
      genre: track.genre,
      bpm: track.bpm,
      key: track.key,
      label: track.label,
      releaseDate: track.releaseDate,
      previewUrl: track.previewUrl
    })),
    exportedAt: new Date().toISOString(),
    exportedBy: 'Beatport Curator',
    version: '1.0'
  };
  
  return JSON.stringify(exportData, null, 2);
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
