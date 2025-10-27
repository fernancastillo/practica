export const saveLocalstorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (ex) {
        console.error("Error al guardar: ", ex);
        return false;
    }
}

export const loadFromLocalstorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (ex) {
        console.error("Error al cargar: ", ex);
        return null;
    }
}

export const deleteFromLocalstorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (ex) {
        console.error("Error al eliminar: ", ex);
        return false;
    }
}