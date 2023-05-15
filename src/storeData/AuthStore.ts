import AsyncStorage from '@react-native-async-storage/async-storage';

interface Storage {
    [key: string]: any
}

const storeData = async (name: string, value: Storage) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(name, jsonValue)
    } catch (e) {
    }
}

const getData = async (name: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(name)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e)
    }
}

const clearData = async () => {
    AsyncStorage.clear()
};

export default { storeData, getData, clearData }