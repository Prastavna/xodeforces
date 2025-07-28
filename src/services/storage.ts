export const storage = {
    local: {
        get: (key: string) => {
            return localStorage.getItem(key)
        },
        set: (key: string, value: string) => {
            localStorage.setItem(key, value)
        },
        remove: (key: string) => {
            localStorage.removeItem(key)
        },
        clear: () => {
            localStorage.clear()
        }
    },

    session: {
        get: (key: string) => {
            return sessionStorage.getItem(key)
        },
        set: (key: string, value: string) => {
            sessionStorage.setItem(key, value)
        },
        remove: (key: string) => {
            sessionStorage.removeItem(key)
        },
        clear: () => {
            sessionStorage.clear()
        }
    }
}