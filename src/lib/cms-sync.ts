/**
 * Zero-Delay Realtime CMS Sync Engine
 * Uses Web BroadcastChannel to broadcast immediate updates between /admin and storefront tabs.
 */

export const CMS_SYNC_CHANNEL = 'camcu_cms_sync';

export function broadcastCmsSync(action?: string) {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(CMS_SYNC_CHANNEL);
      channel.postMessage({
        type: 'CMS_UPDATED',
        action: action || 'update',
        timestamp: Date.now(),
      });
      channel.close();
    } catch {
      // Fallback or ignore
    }
  }
}
