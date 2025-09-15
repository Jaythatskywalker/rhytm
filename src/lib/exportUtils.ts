import { Track, Collection, ExportFormat } from '@/types';

export async function exportCollection(
  collectionId: string, 
  format: ExportFormat,
  includeMetadata: boolean = true
): Promise<void> {
  try {
    const url = `/api/export/${collectionId}/${format}${includeMetadata ? '?metadata=true' : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `export.${format}`;
    
    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

export function generateLocalCSV(tracks: Track[], _collectionName: string): string {
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

export function generateLocalM3U(tracks: Track[], collectionName: string): string {
  const m3uLines = [
    '#EXTM3U',
    `#PLAYLIST:${collectionName}`,
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

export function generateLocalJSON(tracks: Track[], collection: Collection): string {
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

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
