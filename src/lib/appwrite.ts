import { Client, Account, Databases, Storage, ID, Query, Realtime, TablesDB } from 'appwrite';
import { APPWRITE_CONFIG } from './appwrite/config';

export const APPWRITE_ENDPOINT = 'https://api.kylrix.space/v1';
export const APPWRITE_PROJECT_ID = APPWRITE_CONFIG.PROJECT_ID;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const realtime = new Realtime(client);
export const tablesDB = new TablesDB(client);

export { client };

export const APPWRITE_DATABASE_ID = APPWRITE_CONFIG.DATABASES.NOTE;
export const APPWRITE_TABLE_ID_USERS = APPWRITE_CONFIG.TABLES.NOTE.USERS;
export const APPWRITE_DATABASE_ID_CONNECT = APPWRITE_CONFIG.DATABASES.CONNECT;
export const APPWRITE_TABLE_ID_CONNECT_USERS = APPWRITE_CONFIG.TABLES.CONNECT.USERS;
export const APPWRITE_BUCKET_PROFILE_PICTURES = APPWRITE_CONFIG.BUCKETS.PROFILE_PICTURES;

export { ID, Query };

const CURRENT_USER_CACHE_KEY = 'kylrix_portal_current_user_v2';
const CURRENT_USER_CACHE_TTL = 5 * 60 * 1000;
const CURRENT_USER_REQUEST_TIMEOUT = 8000;

type CachedCurrentUser = {
    user: any | null;
    expiresAt: number;
};

let currentUserCache: CachedCurrentUser | null = null;
let currentUserInFlight: Promise<any | null> | null = null;
const originalAccountGet = account.get.bind(account);

const readPersistentCurrentUserCache = (): CachedCurrentUser | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(CURRENT_USER_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachedCurrentUser;
        if (!parsed || typeof parsed.expiresAt !== 'number' || parsed.expiresAt <= Date.now()) {
            window.localStorage.removeItem(CURRENT_USER_CACHE_KEY);
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
};

const writePersistentCurrentUserCache = (cache: CachedCurrentUser | null) => {
    if (typeof window === 'undefined') return;
    try {
        if (!cache) {
            window.localStorage.removeItem(CURRENT_USER_CACHE_KEY);
            return;
        }
        window.localStorage.setItem(CURRENT_USER_CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Ignore persistence failures.
    }
};

const clearCurrentUserCache = () => {
    currentUserCache = null;
    writePersistentCurrentUserCache(null);
};

const getCachedCurrentUser = () => {
    if (currentUserCache && currentUserCache.expiresAt > Date.now()) return currentUserCache.user;
    const persistent = readPersistentCurrentUserCache();
    if (!persistent) return null;
    currentUserCache = persistent;
    return persistent.user;
};

const setCachedCurrentUser = (user: any | null) => {
    const cache: CachedCurrentUser = { user, expiresAt: Date.now() + CURRENT_USER_CACHE_TTL };
    currentUserCache = cache;
    writePersistentCurrentUserCache(cache);
    return user;
};

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
            setTimeout(() => reject(new Error('Current user request timed out')), timeoutMs);
        }),
    ]);
};

(account as any).get = async () => {
    if (currentUserCache && currentUserCache.expiresAt > Date.now()) {
        return currentUserCache.user;
    }
    const persistent = readPersistentCurrentUserCache();
    if (persistent) {
        currentUserCache = persistent;
        return persistent.user;
    }
    if (currentUserInFlight) {
        return currentUserInFlight;
    }

    currentUserInFlight = withTimeout(originalAccountGet(), CURRENT_USER_REQUEST_TIMEOUT)
        .then((user) => setCachedCurrentUser(user))
        .catch(() => {
            clearCurrentUserCache();
            return null;
        })
        .finally(() => {
            currentUserInFlight = null;
        });

    return currentUserInFlight;
};

export function getFilePreview(bucketId: string, fileId: string, width: number = 64, height: number = 64) {
    return storage.getFilePreview(bucketId, fileId, width, height);
}

export function getProfilePicturePreview(fileId: string, width: number = 64, height: number = 64) {
    return getFilePreview("profile_pictures", fileId, width, height);
}

// --- USER SESSION ---

export async function getCurrentUser(): Promise<any | null> {
    if (currentUserCache && currentUserCache.expiresAt > Date.now()) {
        return currentUserCache.user;
    }

    const persistent = readPersistentCurrentUserCache();
    if (persistent) {
        currentUserCache = persistent;
        return persistent.user;
    }

    if (currentUserInFlight) {
        return currentUserInFlight;
    }

    currentUserInFlight = withTimeout(originalAccountGet(), CURRENT_USER_REQUEST_TIMEOUT)
        .then((user) => setCachedCurrentUser(user))
        .catch(() => {
            clearCurrentUserCache();
            return null;
        })
        .finally(() => {
            currentUserInFlight = null;
        });

    return currentUserInFlight;
}

export function invalidateCurrentUserCache() {
    clearCurrentUserCache();
}

// Unified resolver: attempts global session then cookie-based fallback
export async function resolveCurrentUser(req?: { headers: { get(k: string): string | null } } | null): Promise<any | null> {
    const direct = await getCurrentUser();
    if (direct && direct.$id) return direct;
    if (req) {
        const fallback = await getCurrentUserFromRequest(req as any);
        if (fallback && (fallback as any).$id) return fallback;
    }
    return null;
}

// Per-request user fetch using incoming Cookie header
export async function getCurrentUserFromRequest(req: { headers: { get(k: string): string | null } } | null | undefined): Promise<any | null> {
    try {
        if (!req) return null;
        const cookieHeader = req.headers.get('cookie') || req.headers.get('Cookie');
        if (!cookieHeader) return null;

        const res = await fetch(`${APPWRITE_ENDPOINT}/account`, {
            method: 'GET',
            headers: {
                'X-Appwrite-Project': APPWRITE_PROJECT_ID,
                'Cookie': cookieHeader,
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || typeof data !== 'object' || !data.$id) return null;
        return data;
    } catch (_e: unknown) {
        console.error('getCurrentUserFromRequest error', _e);
        return null;
    }
}

export async function getUser(userId: string) {
  return databases.getDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_ID_USERS,
    userId
  );
}

export async function createUser(data: any) {
  return databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_ID_USERS,
    data.id || ID.unique(),
    {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );
}

export async function updateUser(userId: string, data: any) {
  return databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_ID_USERS,
    userId,
    {
      ...data,
      updatedAt: new Date().toISOString()
    }
  );
}

export async function getGlobalProfile(username: string) {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID_CONNECT,
      APPWRITE_TABLE_ID_CONNECT_USERS,
      [Query.equal('username', username.toLowerCase())]
    );
    return res.documents[0] || null;
  } catch (error) {
    console.error('getGlobalProfile error:', error);
    return null;
  }
}
